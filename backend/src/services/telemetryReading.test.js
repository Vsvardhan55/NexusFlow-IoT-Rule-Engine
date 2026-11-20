import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeReading } from './telemetryReading.js'

test('normalizes valid telemetry and applies stable defaults', () => {
  const receivedAt = new Date('2026-11-20T10:00:00.000Z')
  const result = normalizeReading({ deviceId: ' turbine-01 ', metric: ' VIBRATION ', value: '12.5', unit: 'mm/s' }, receivedAt)
  assert.equal(result.metadata.deviceId, 'turbine-01')
  assert.equal(result.metadata.metric, 'vibration')
  assert.equal(result.metadata.location, 'unspecified')
  assert.equal(result.value, 12.5)
  assert.equal(result.timestamp.toISOString(), receivedAt.toISOString())
})

test('rejects missing device IDs, empty metrics, non-numeric values and invalid timestamps', () => {
  assert.throws(() => normalizeReading({ metric: 'vibration', value: 1 }), /deviceId/)
  assert.throws(() => normalizeReading({ deviceId: 'd1', metric: ' ', value: 1 }), /metric/)
  assert.throws(() => normalizeReading({ deviceId: 'd1', value: 'hot' }), /numeric value/)
  assert.throws(() => normalizeReading({ deviceId: 'd1', value: 1, timestamp: 'not-a-date' }), /valid date/)
})
