import { Router } from 'express'
import { getDatabase } from '../config/database.js'
import { telemetrySubject } from '../services/telemetryPipeline.js'

const router = Router()
function normalizeReading(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('Each reading must be an object.')
  const deviceId = String(item.deviceId || '').trim()
  const metric = String(item.metric || 'value').trim()
  const value = Number(item.value)
  const timestamp = item.timestamp ? new Date(item.timestamp) : new Date()
  if (!deviceId) throw new Error('Each reading must include deviceId.')
  if (!metric) throw new Error('Each reading must include metric.')
  if (!Number.isFinite(value)) throw new Error('Each reading must include a numeric value.')
  if (Number.isNaN(timestamp.getTime())) throw new Error('timestamp must be a valid date.')
  return { timestamp, metadata: { deviceId, metric, location: String(item.location || 'unspecified') }, value, unit: String(item.unit || ''), receivedAt: new Date() }
}

router.post('/', async (req, res, next) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body]
    if (!payload.length || payload.length > 1000) return res.status(payload.length ? 413 : 400).json({ success: false, message: 'Submit between 1 and 1000 readings per request.' })
    let documents
    try { documents = payload.map(normalizeReading) }
    catch (error) { return res.status(400).json({ success: false, message: error.message }) }
    const result = await getDatabase().collection('telemetry').insertMany(documents, { ordered: false })
    documents.forEach((reading) => telemetrySubject.next(reading))
    res.status(201).json({ success: true, insertedCount: result.insertedCount, message: 'Telemetry stored and queued for rule evaluation.' })
  } catch (error) { next(error) }
})

router.get('/latest', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 200)
    const query = req.query.deviceId ? { 'metadata.deviceId': String(req.query.deviceId) } : {}
    const readings = await getDatabase().collection('telemetry').find(query).sort({ timestamp: -1 }).limit(limit).toArray()
    res.json({ success: true, count: readings.length, data: readings })
  } catch (error) { next(error) }
})

router.get('/stats', async (_req, res, next) => {
  try {
    const [total, devices] = await Promise.all([
      getDatabase().collection('telemetry').countDocuments(),
      getDatabase().collection('telemetry').distinct('metadata.deviceId'),
    ])
    res.json({ success: true, data: { totalReadings: total, deviceCount: devices.length } })
  } catch (error) { next(error) }
})
export default router
