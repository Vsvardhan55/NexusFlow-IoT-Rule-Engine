import { Router } from 'express'
import { getDatabase } from '../config/database.js'
import { telemetrySubject } from '../services/telemetryPipeline.js'
import { buildTelemetryQuery } from '../services/telemetryQuery.js'
import { normalizeReading } from '../services/telemetryReading.js'

const router = Router()
router.post('/', async (req, res, next) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body]
    if (!payload.length || payload.length > 1000) return res.status(payload.length ? 413 : 400).json({ success: false, message: 'Submit between 1 and 1000 readings per request.' })
    let documents
    try { documents = payload.map((item) => normalizeReading(item)) }
    catch (error) { return res.status(400).json({ success: false, message: error.message }) }
    const result = await getDatabase().collection('telemetry').insertMany(documents, { ordered: false })
    documents.forEach((reading) => telemetrySubject.next(reading))
    res.status(201).json({ success: true, insertedCount: result.insertedCount, message: 'Telemetry stored and queued for rule evaluation.' })
  } catch (error) { next(error) }
})


router.get('/devices', async (_req, res, next) => {
  try {
    const devices = await getDatabase().collection('telemetry').aggregate([
      { $group: {
        _id: '$metadata.deviceId',
        latestSeen: { $max: '$timestamp' },
        metrics: { $addToSet: '$metadata.metric' },
        readingCount: { $sum: 1 },
      } },
      { $sort: { latestSeen: -1, _id: 1 } },
      { $limit: 500 },
      { $project: { _id: 0, deviceId: '$_id', latestSeen: 1, metrics: 1, readingCount: 1 } },
    ]).toArray()
    res.json({ success: true, count: devices.length, data: devices })
  } catch (error) { next(error) }
})

router.get('/history', async (req, res, next) => {
  try {
    let query
    try { query = buildTelemetryQuery(req.query) }
    catch (error) { return res.status(400).json({ success: false, message: error.message }) }
    const readings = await getDatabase().collection('telemetry')
      .find(query.filter).sort(query.sort).limit(query.limit).toArray()
    res.json({ success: true, count: readings.length, limit: query.limit, data: readings })
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
