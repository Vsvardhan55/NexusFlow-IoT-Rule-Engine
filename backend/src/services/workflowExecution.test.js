import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateCompiledWorkflow } from './workflowPlanRunner.js'

const workflow = {
  _id: 'workflow-test',
  compiled: { executionPlan: [
    { nodeId: 'sensor', operation: 'read-telemetry', inputs: [], config: { metric: 'vibration', deviceId: 'turbine-01', unit: 'mm/s' } },
    { nodeId: 'average', operation: 'moving-average', inputs: ['sensor'], config: { windowSize: 2 } },
    { nodeId: 'alert', operation: 'trigger-alert', inputs: ['average'], config: { name: 'High vibration', operator: '>', threshold: 10, message: 'Vibration too high' } },
  ] },
}
const reading = (value) => ({ metadata: { deviceId: 'turbine-01', metric: 'vibration' }, value, unit: 'mm/s' })

test('executes sensor, rolling average and threshold alert on live readings', () => {
  const buffers = new Map()
  const first = evaluateCompiledWorkflow(workflow, reading(8), buffers)
  assert.equal(first.matched, true)
  assert.equal(first.nodeResults[1].value, 8)
  assert.equal(first.alerts.length, 0)
  const second = evaluateCompiledWorkflow(workflow, reading(14), buffers)
  assert.equal(second.nodeResults[1].value, 11)
  assert.equal(second.alerts.length, 1)
  assert.equal(second.alerts[0].message, 'Vibration too high')
})

test('does not execute a workflow for a different sensor or metric', () => {
  const result = evaluateCompiledWorkflow(workflow, { ...reading(99), metadata: { deviceId: 'other-device', metric: 'temperature' } }, new Map())
  assert.equal(result.matched, false)
  assert.equal(result.alerts.length, 0)
})

test('respects the rolling window size', () => {
  const buffers = new Map()
  evaluateCompiledWorkflow(workflow, reading(2), buffers)
  evaluateCompiledWorkflow(workflow, reading(4), buffers)
  const third = evaluateCompiledWorkflow(workflow, reading(9), buffers)
  assert.equal(third.nodeResults[1].value, 6.5)
})
