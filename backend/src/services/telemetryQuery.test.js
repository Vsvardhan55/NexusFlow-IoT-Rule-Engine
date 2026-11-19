import test from 'node:test'
import assert from 'node:assert/strict'
import { buildTelemetryQuery } from './telemetryQuery.js'

test('builds a telemetry history query with device, metric and date filters', () => {
  const query = buildTelemetryQuery({
    deviceId: 'turbine-01', metric: 'vibration',
    from: '2026-11-20T00:00:00.000Z', to: '2026-11-21T00:00:00.000Z', limit: '25',
  })
  assert.equal(query.filter['metadata.deviceId'], 'turbine-01')
  assert.equal(query.filter['metadata.metric'], 'vibration')
  assert.equal(query.filter.timestamp.$gte.toISOString(), '2026-11-20T00:00:00.000Z')
  assert.equal(query.limit, 25)
  assert.deepEqual(query.sort, { timestamp: -1 })
})

test('clamps limits and rejects invalid or reversed date ranges', () => {
  assert.equal(buildTelemetryQuery({ limit: '9000' }).limit, 500)
  assert.equal(buildTelemetryQuery({ limit: '-5' }).limit, 1)
  assert.throws(() => buildTelemetryQuery({ from: 'not-a-date' }), /from must be a valid date/)
  assert.throws(() => buildTelemetryQuery({ from: '2026-11-21', to: '2026-11-20' }), /earlier than or equal/)
})
