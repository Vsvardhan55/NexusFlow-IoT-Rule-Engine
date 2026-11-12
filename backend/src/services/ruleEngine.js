const OPERATORS = new Set(['>', '>=', '<', '<=', '==', '!='])

export function validateRule(input) {
  const name = String(input?.name || '').trim()
  const condition = input?.condition
  const action = input?.action
  if (!name) throw new Error('Rule name is required.')
  if (!condition || !String(condition.metric || '').trim()) throw new Error('condition.metric is required.')
  if (!OPERATORS.has(condition.operator)) throw new Error('Unsupported condition operator.')
  if (!Number.isFinite(Number(condition.value))) throw new Error('condition.value must be numeric.')
  if (!action || action.type !== 'alert') throw new Error('Only the alert action is currently supported.')
  return {
    name,
    description: String(input.description || '').trim(),
    enabled: input.enabled !== false,
    condition: {
      metric: String(condition.metric).trim(),
      operator: condition.operator,
      value: Number(condition.value),
      ...(condition.deviceId ? { deviceId: String(condition.deviceId).trim() } : {}),
    },
    action: { type: 'alert', message: String(action.message || `${name} triggered`).trim() },
  }
}

export function matchesRule(rule, reading) {
  if (!rule.enabled) return false
  if (rule.condition.metric !== reading.metadata.metric) return false
  if (rule.condition.deviceId && rule.condition.deviceId !== reading.metadata.deviceId) return false
  const left = Number(reading.value)
  const right = Number(rule.condition.value)
  switch (rule.condition.operator) {
    case '>': return left > right
    case '>=': return left >= right
    case '<': return left < right
    case '<=': return left <= right
    case '==': return left === right
    case '!=': return left !== right
    default: return false
  }
}
