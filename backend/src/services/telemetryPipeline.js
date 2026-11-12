import { Subject, bufferTime, filter, map } from 'rxjs'
import { getDatabase } from '../config/database.js'
import { matchesRule } from './ruleEngine.js'

export const telemetrySubject = new Subject()

export function startTelemetryPipeline(io) {
  const subscription = telemetrySubject.subscribe(async (reading) => {
    try {
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
    } catch (error) {
      console.error('Rule evaluation failed:', error.message)
    }
  })

  const batchSubscription = telemetrySubject.pipe(
    bufferTime(250), filter((batch) => batch.length > 0),
    map((batch) => ({ type: 'telemetry:batch', count: batch.length, events: batch, emittedAt: new Date().toISOString() })),
  ).subscribe((payload) => io.emit('telemetry:batch', payload))

  return () => { subscription.unsubscribe(); batchSubscription.unsubscribe(); telemetrySubject.complete() }
}
