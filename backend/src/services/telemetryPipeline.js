import { Subject, bufferTime, filter, map } from 'rxjs'

// A lightweight in-process stream for telemetry events.
// This is a starter pipeline; workflow-specific RxJS compilation comes later.
export const telemetrySubject = new Subject()

export function startTelemetryPipeline(io) {
  const subscription = telemetrySubject.pipe(
    bufferTime(250),
    filter((batch) => batch.length > 0),
    map((batch) => ({
      type: 'telemetry:batch',
      count: batch.length,
      events: batch,
      emittedAt: new Date().toISOString(),
    })),
  ).subscribe((payload) => {
    io.emit('telemetry:batch', payload)
  })

  return () => subscription.unsubscribe()
}
