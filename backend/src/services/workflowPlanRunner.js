const rollingSamples = new Map()
const operators = {
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '==': (a, b) => a === b,
  '!=': (a, b) => a !== b,
}

/** Execute a compiled plan for one matching telemetry reading. */
export function evaluateCompiledWorkflow(workflow, reading, buffers = rollingSamples) {
  const values = new Map()
  const nodeResults = []
  const alerts = []
  const { executionPlan = [] } = workflow.compiled || workflow

  for (const step of executionPlan) {
    const parentValues = step.inputs.map((id) => values.get(id)).filter((value) => Number.isFinite(value))
    let output = parentValues.length ? parentValues[0] : undefined
    let status = 'completed'
    let detail = 'Node executed.'

    if (step.operation === 'read-telemetry') {
      const { metric, deviceId } = step.config
      if (metric !== reading.metadata.metric || (deviceId && deviceId !== reading.metadata.deviceId)) {
        status = 'skipped'
        detail = 'Incoming reading does not match this sensor node.'
      } else {
        output = Number(reading.value)
        detail = `Read ${output} ${reading.unit || step.config.unit || ''} from ${reading.metadata.deviceId}.`.trim()
      }
    } else if (step.operation === 'moving-average') {
      if (!Number.isFinite(output)) {
        status = 'skipped'
        detail = 'No numeric input was received.'
      } else {
        const key = `${workflow._id || workflow.id}:${step.nodeId}:${reading.metadata.deviceId}:${reading.metadata.metric}`
        const samples = buffers.get(key) || []
        samples.push(output)
        if (samples.length > step.config.windowSize) samples.splice(0, samples.length - step.config.windowSize)
        buffers.set(key, samples)
        output = samples.reduce((sum, value) => sum + value, 0) / samples.length
        detail = `Calculated ${samples.length}-sample moving average (${output.toFixed(3)}).`
      }
    } else if (step.operation === 'trigger-alert') {
      if (!Number.isFinite(output)) {
        status = 'skipped'
        detail = 'No numeric input was received.'
      } else if (operators[step.config.operator]?.(output, step.config.threshold)) {
        status = 'triggered'
        detail = `Threshold met: ${output} ${step.config.operator} ${step.config.threshold}.`
        alerts.push({ nodeId: step.nodeId, name: step.config.name, message: step.config.message, value: output, operator: step.config.operator, threshold: step.config.threshold })
      } else {
        detail = `Threshold not met: ${output} is not ${step.config.operator} ${step.config.threshold}.`
      }
    }

    if (Number.isFinite(output)) values.set(step.nodeId, output)
    nodeResults.push({ nodeId: step.nodeId, operation: step.operation, status, value: Number.isFinite(output) ? output : null, detail })
  }

  return { nodeResults, alerts, matched: nodeResults.some((result) => result.operation === 'read-telemetry' && result.status === 'completed') }
}


export function resetWorkflowExecutionState() { rollingSamples.clear() }
