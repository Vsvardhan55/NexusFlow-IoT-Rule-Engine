import { Subject, bufferTime, filter, map } from 'rxjs'
import { createMovingAverageStream } from './movingAverage.js'
import { getDatabase } from '../config/database.js'
import { matchesRule } from './ruleEngine.js'
import { executeActiveWorkflows } from './workflowExecution.js'

export const telemetrySubject = new Subject()

export function startTelemetryPipeline(io) {
  // MongoDB writes and workflow evaluation are asynchronous. Serialize this
  // portion of the pipeline so rapid readings cannot overtake one another.
  let processing = Promise.resolve()
  const subscription = telemetrySubject.subscribe((reading) => {
    processing = processing.then(async () => {
      await executeActiveWorkflows(reading, io)
      const rules = await getDatabase().collection('rules').find({ enabled: true, 'condition.metric': reading.metadata.metric }).toArray()
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
    }).catch((error) => {
      console.error('Telemetry rule/workflow processing failed:', error.message)
    })
  })

  const configuredWindow = Number(process.env.MOVING_AVERAGE_WINDOW) || 10
  const averageSubscription = createMovingAverageStream(telemetrySubject, configuredWindow)
    .subscribe((result) => io.emit('telemetry:average', result))

  const batchSubscription = telemetrySubject.pipe(
    bufferTime(250), filter((batch) => batch.length > 0),
    map((batch) => ({ type: 'telemetry:batch', count: batch.length, events: batch, emittedAt: new Date().toISOString() })),
  ).subscribe((payload) => io.emit('telemetry:batch', payload))

  return () => { subscription.unsubscribe(); averageSubscription.unsubscribe(); batchSubscription.unsubscribe(); telemetrySubject.complete() }
}
