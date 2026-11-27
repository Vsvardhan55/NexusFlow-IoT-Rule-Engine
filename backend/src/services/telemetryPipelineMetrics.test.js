import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getTelemetryPipelineStats,
  markTelemetryFailed,
  markTelemetryProcessed,
  markTelemetryQueued,
  markTelemetryStarted,
} from './telemetryPipelineMetrics.js'

test('pipeline metrics track queued, active, and completed readings', () => {
  markTelemetryQueued()
  markTelemetryStarted()
  markTelemetryProcessed()
  const stats = getTelemetryPipelineStats()
  assert.equal(stats.received, 1)
  assert.equal(stats.queued, 0)
  assert.equal(stats.inFlight, 0)
  assert.equal(stats.processed, 1)
  assert.equal(stats.failed, 0)
  assert.ok(stats.lastProcessedAt)
})

test('pipeline metrics record failures without leaving work in flight', () => {
  markTelemetryQueued()
  markTelemetryStarted()
  markTelemetryFailed(new Error('database unavailable'))
  const stats = getTelemetryPipelineStats()
  assert.equal(stats.queued, 0)
  assert.equal(stats.inFlight, 0)
  assert.equal(stats.failed, 1)
  assert.equal(stats.lastError, 'database unavailable')
})
