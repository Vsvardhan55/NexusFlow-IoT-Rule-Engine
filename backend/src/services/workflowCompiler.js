const NODE_TYPES = new Set(['sensorNode', 'filterNode', 'alertNode'])

function fail(message) { throw new Error(message) }

/**
 * Validate a React Flow graph and compile it into a deterministic execution plan.
 * This is intentionally a compiler/validator: execution remains in the telemetry pipeline.
 */
export function compileWorkflow(graph) {
  if (!graph || typeof graph !== 'object' || Array.isArray(graph)) fail('Workflow payload must be an object.')
  const { nodes, edges } = graph
  if (!Array.isArray(nodes) || nodes.length === 0) fail('Workflow must contain at least one node.')
  if (!Array.isArray(edges)) fail('Workflow edges must be an array.')

  const nodeById = new Map()
  for (const node of nodes) {
    if (!node || typeof node.id !== 'string' || !node.id.trim()) fail('Every node must have a non-empty string ID.')
    if (nodeById.has(node.id)) fail(`Duplicate node ID: ${node.id}`)
    if (!NODE_TYPES.has(node.type)) fail(`Unsupported node type: ${node.type || '(missing)'}.`)
    if (!node.data || typeof node.data !== 'object' || Array.isArray(node.data)) fail(`Node ${node.id} must include a data object.`)
    nodeById.set(node.id, node)
  }

  const indegree = new Map(nodes.map(({ id }) => [id, 0]))
  const outgoing = new Map(nodes.map(({ id }) => [id, []]))
  const edgeKeys = new Set()
  for (const edge of edges) {
    if (!edge || !nodeById.has(edge.source) || !nodeById.has(edge.target)) fail('Every edge must reference existing source and target nodes.')
    if (edge.source === edge.target) fail('A node cannot connect to itself.')
    const key = `${edge.source}->${edge.target}`
    if (edgeKeys.has(key)) fail(`Duplicate connection: ${key}`)
    edgeKeys.add(key)
    outgoing.get(edge.source).push(edge.target)
    indegree.set(edge.target, indegree.get(edge.target) + 1)
  }

  const queue = nodes.filter(({ id }) => indegree.get(id) === 0).map(({ id }) => id)
  const orderedIds = []
  // Keep the order stable relative to the canvas node list.
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const id = queue[cursor]
    orderedIds.push(id)
    for (const target of outgoing.get(id)) {
      indegree.set(target, indegree.get(target) - 1)
      if (indegree.get(target) === 0) queue.push(target)
    }
  }
  if (orderedIds.length !== nodes.length) fail('Workflow contains a cycle. Remove cyclic connections before compiling.')

  const plan = orderedIds.map((id, index) => {
    const node = nodeById.get(id)
    const inputs = edges.filter((edge) => edge.target === id).map((edge) => edge.source)
    const data = node.data
    if (node.type === 'sensorNode') {
      const value = Number(data.metric)
      if (data.metric !== undefined && data.metric !== '' && !Number.isFinite(value)) fail(`Sensor node ${id} has an invalid numeric metric value.`)
      const subtitle = String(data.subtitle || '')
      const inferredDeviceId = subtitle.includes('·') ? subtitle.split('·').pop().trim() : ''
      const inferredMetric = subtitle.includes('·') ? subtitle.split('·')[0].trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_') : ''
      return { order: index + 1, nodeId: id, type: node.type, operation: 'read-telemetry', inputs, config: { name: String(data.label || 'Sensor'), metric: String(data.metricName || inferredMetric || 'vibration'), deviceId: String(data.deviceId || inferredDeviceId), value: Number.isFinite(value) ? value : null, unit: String(data.unit || '') } }
    }
    if (node.type === 'filterNode') {
      const windowSize = Number.parseInt(String(data.windowSize ?? data.window ?? '10').match(/\d+/)?.[0] || '10', 10)
      if (!Number.isInteger(windowSize) || windowSize < 1 || windowSize > 10000) fail(`Filter node ${id} window size must be between 1 and 10000.`)
      return { order: index + 1, nodeId: id, type: node.type, operation: 'moving-average', inputs, config: { name: String(data.label || 'Moving Average'), windowSize } }
    }
    const condition = String(data.condition || 'Value > 50')
    const match = condition.match(/(>=|<=|==|!=|>|<)\s*(-?\d+(?:\.\d+)?)/)
    if (!match) fail(`Alert node ${id} must have a supported numeric threshold condition.`)
    return { order: index + 1, nodeId: id, type: node.type, operation: 'trigger-alert', inputs, config: { name: String(data.label || 'Alert'), operator: match[1], threshold: Number(match[2]), message: String(data.message || data.label || 'Workflow alert') } }
  })

  return { workflowName: String(graph.name || 'Untitled workflow'), nodeCount: nodes.length, edgeCount: edges.length, compiledAt: new Date().toISOString(), executionPlan: plan }
}
