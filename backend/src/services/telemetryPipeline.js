import { Subject, bufferTime, catchError, defer, EMPTY, filter, from, map, mergeMap, tap } from 'rxjs'
import { createMovingAverageStream } from './movingAverage.js'
import { getDatabase } from '../config/database.js'
import { matchesRule } from './ruleEngine.js'
import { executeActiveWorkflows } from './workflowExecution.js'
import {
  getTelemetryPipelineStats,
  markTelemetryFailed,
  markTelemetryProcessed,
  markTelemetryQueued,
  markTelemetryStarted,
} from './telemetryPipelineMetrics.js'

export const telemetrySubject = new Subject()
export { getTelemetryPipelineStats }

async function processTelemetryReading(reading, io) {
  await executeActiveWorkflows(reading, io)
  const rules = await getDatabase().collection('rules')
    .find({ enabled: true, 'condition.metric': reading.metadata.metric }).toArray()
  const matched = rules.filter((rule) => matchesRule(rule, reading))
  if (!matched.length) return

  const alerts = matched.map((rule) => ({
    ruleId: rule._id,
    ruleName: rule.name,
    deviceId: reading.metadata.deviceId,
    metric: reading.metadata.metric,
    value: reading.value,
    message: rule.action.message,
    triggeredAt: new Date(),
    acknowledged: false,
  }))
  await getDatabase().collection('alerts').insertMany(alerts)
  alerts.forEach((alert) => io.emit('alert:new', alert))
}

export function startTelemetryPipeline(io) {
  const concurrency = Math.min(Math.max(Number(process.env.TELEMETRY_PROCESSING_CONCURRENCY) || 8, 1), 32)
  const subscription = telemetrySubject.pipe(
    tap(() => markTelemetryQueued()),
    // Bound concurrent DB-backed rule/workflow processing to avoid an unbounded
    // number of async Subject callbacks during telemetry bursts.
    mergeMap((reading) => defer(() => {
      markTelemetryStarted()
      return from(processTelemetryReading(reading, io)).pipe(
        tap(() => markTelemetryProcessed()),
        catchError((error) => {
          markTelemetryFailed(error)
          console.error('Telemetry rule evaluation failed:', error.message)
          return EMPTY
        }),
      )
    }), concurrency),
  ).subscribe({
    error: (error) => console.error('Telemetry pipeline stopped unexpectedly:', error.message),
  })

  const configuredWindow = Number(process.env.MOVING_AVERAGE_WINDOW) || 10
  const averageSubscription = createMovingAverageStream(telemetrySubject, configuredWindow)
    .subscribe((result) => io.emit('telemetry:average', result))

  const batchSubscription = telemetrySubject.pipe(
    bufferTime(250), filter((batch) => batch.length > 0),
    map((batch) => ({ type: 'telemetry:batch', count: batch.length, events: batch, emittedAt: new Date().toISOString() })),
  ).subscribe((payload) => io.emit('telemetry:batch', payload))

  return () => {
    subscription.unsubscribe()
    averageSubscription.unsubscribe()
    batchSubscription.unsubscribe()
    telemetrySubject.complete()
  }
}
