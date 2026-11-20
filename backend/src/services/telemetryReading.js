/** Validate and normalize a single device telemetry payload. */
export function normalizeReading(item, receivedAt = new Date()) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('Each reading must be an object.')
  const deviceId = String(item.deviceId || '').trim()
  const metric = String(item.metric || 'value').trim().toLowerCase()
  const value = Number(item.value)
  const timestamp = item.timestamp ? new Date(item.timestamp) : new Date(receivedAt)
  if (!deviceId) throw new Error('Each reading must include deviceId.')
  if (!metric) throw new Error('Each reading must include metric.')
  if (!Number.isFinite(value)) throw new Error('Each reading must include a numeric value.')
  if (Number.isNaN(timestamp.getTime())) throw new Error('timestamp must be a valid date.')
  return { timestamp, metadata: { deviceId, metric, location: String(item.location || 'unspecified') }, value, unit: String(item.unit || ''), receivedAt: new Date(receivedAt) }
}
