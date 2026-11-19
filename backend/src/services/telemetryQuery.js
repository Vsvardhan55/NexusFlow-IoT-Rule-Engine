const MAX_LIMIT = 500

/** Build a bounded MongoDB query for telemetry history requests. */
export function buildTelemetryQuery(params = {}) {
  const limitValue = Number.parseInt(String(params.limit ?? '100'), 10)
  const limit = Number.isFinite(limitValue) ? Math.min(Math.max(limitValue, 1), MAX_LIMIT) : 100
  const filter = {}

  if (params.deviceId !== undefined && String(params.deviceId).trim()) {
    filter['metadata.deviceId'] = String(params.deviceId).trim().slice(0, 120)
  }
  if (params.metric !== undefined && String(params.metric).trim()) {
    filter['metadata.metric'] = String(params.metric).trim().slice(0, 80)
  }

  const range = {}
  if (params.from !== undefined && String(params.from).trim()) {
    const from = new Date(params.from)
    if (Number.isNaN(from.getTime())) throw new Error('from must be a valid date.')
    range.$gte = from
  }
  if (params.to !== undefined && String(params.to).trim()) {
    const to = new Date(params.to)
    if (Number.isNaN(to.getTime())) throw new Error('to must be a valid date.')
    range.$lte = to
  }
  if (range.$gte && range.$lte && range.$gte > range.$lte) {
    throw new Error('from must be earlier than or equal to to.')
  }
  if (Object.keys(range).length) filter.timestamp = range

  return { filter, limit, sort: { timestamp: -1 } }
}
