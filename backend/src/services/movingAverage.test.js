import test from 'node:test'
import assert from 'node:assert/strict'
import { Subject } from 'rxjs'
import { createMovingAverageStream } from './movingAverage.js'

const reading = (deviceId, metric, value) => ({
  metadata: { deviceId, metric }, value, unit: 'mm/s', timestamp: new Date(),
})

test('calculates a rolling average and drops values outside the configured window', () => {
  const source = new Subject()
  const results = []
  const subscription = createMovingAverageStream(source, 3).subscribe((result) => results.push(result))

  ;[10, 20, 30, 40].forEach((value) => source.next(reading('turbine-1', 'vibration', value)))

  assert.deepEqual(results.map(({ average }) => average), [10, 15, 20, 30])
  assert.equal(results.at(-1).sampleCount, 3)
  assert.equal(results.at(-1).windowSize, 3)
  assert.equal(results.at(-1).rawValue, 40)
  subscription.unsubscribe()
})

test('keeps rolling windows isolated by device and metric', () => {
  const source = new Subject()
  const results = []
  const subscription = createMovingAverageStream(source, 2).subscribe((result) => results.push(result))

  source.next(reading('turbine-1', 'vibration', 10))
  source.next(reading('turbine-2', 'vibration', 100))
  source.next(reading('turbine-1', 'vibration', 30))

  assert.deepEqual(results.map(({ deviceId, average }) => [deviceId, average]), [
    ['turbine-1', 10], ['turbine-2', 100], ['turbine-1', 20],
  ])
  subscription.unsubscribe()
})

test('rejects invalid window sizes', () => {
  const source = new Subject()
  assert.throws(() => createMovingAverageStream(source, 0), /between 1 and 10000/)
  assert.throws(() => createMovingAverageStream(source, 1.5), /between 1 and 10000/)
})
