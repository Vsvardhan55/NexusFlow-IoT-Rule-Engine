const metrics = {
  received: 0,
  processed: 0,
  failed: 0,
  queued: 0,
  inFlight: 0,
  lastProcessedAt: null,
  lastError: null,
}

export function markTelemetryQueued() {
  metrics.received += 1
  metrics.queued += 1
}

export function markTelemetryStarted() {
  metrics.queued = Math.max(0, metrics.queued - 1)
  metrics.inFlight += 1
}

export function markTelemetryProcessed() {
  metrics.inFlight = Math.max(0, metrics.inFlight - 1)
  metrics.processed += 1
  metrics.lastProcessedAt = new Date().toISOString()
  metrics.lastError = null
}

export function markTelemetryFailed(error) {
  metrics.inFlight = Math.max(0, metrics.inFlight - 1)
  metrics.failed += 1
  metrics.lastProcessedAt = new Date().toISOString()
  metrics.lastError = String(error?.message || error || 'Unknown processing error').slice(0, 300)
}

export function getTelemetryPipelineStats() {
  return { ...metrics }
}
