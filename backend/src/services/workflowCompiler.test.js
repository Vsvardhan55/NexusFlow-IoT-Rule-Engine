import test from 'node:test'
import assert from 'node:assert/strict'
import { compileWorkflow } from './workflowCompiler.js'

const graph = {
  name: 'Turbine Vibration Monitor',
  nodes: [
    { id: 'sensor-1', type: 'sensorNode', data: { label: 'Turbine Sensor', subtitle: 'Vibration · sensor-01', metric: '42.8', unit: 'mm/s' } },
    { id: 'filter-1', type: 'filterNode', data: { label: 'Moving Average', window: '10 samples' } },
    { id: 'alert-1', type: 'alertNode', data: { label: 'SMS Alert', condition: 'Value > 50 mm/s' } },
  ],
  edges: [
    { id: 'e1', source: 'sensor-1', target: 'filter-1' },
    { id: 'e2', source: 'filter-1', target: 'alert-1' },
  ],
}

test('compiles the sample React Flow graph in dependency order', () => {
  const result = compileWorkflow(graph)
  assert.deepEqual(result.executionPlan.map((step) => step.operation), ['read-telemetry', 'moving-average', 'trigger-alert'])
  assert.equal(result.executionPlan[1].config.windowSize, 10)
  assert.equal(result.executionPlan[2].config.threshold, 50)
  assert.equal(result.executionPlan[0].config.metric, 'vibration')
  assert.equal(result.executionPlan[0].config.deviceId, 'sensor-01')
  assert.equal(result.nodeCount, 3)
})

test('rejects missing edge endpoints', () => {
  assert.throws(() => compileWorkflow({ ...graph, edges: [{ source: 'missing', target: 'filter-1' }] }), /existing source and target/)
})

test('rejects cycles', () => {
  assert.throws(() => compileWorkflow({ ...graph, edges: [...graph.edges, { source: 'alert-1', target: 'sensor-1' }] }), /cycle/)
})

test('rejects invalid alert conditions', () => {
  const nodes = graph.nodes.map((node) => node.id === 'alert-1' ? { ...node, data: { ...node.data, condition: 'whenever' } } : node)
  assert.throws(() => compileWorkflow({ ...graph, nodes }), /supported numeric threshold/)
})
