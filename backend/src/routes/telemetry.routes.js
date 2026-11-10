import { Router } from 'express'
import { getDatabase } from '../config/database.js'
import { telemetrySubject } from '../services/telemetryPipeline.js'

const router = Router()

function normalizeReading(item) {
  const deviceId = String(item.deviceId || '').trim()
  const value = Number(item.value)
  const metric = String(item.metric || 'value').trim()

  if (!deviceId) throw new Error('Each reading must include deviceId.')
  if (!Number.isFinite(value)) throw new Error('Each reading must include a numeric value.')

  return {
    timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
    metadata: {
      deviceId,
      metric,
      location: item.location || 'unspecified',
    },
    value,
    unit: item.unit || '',
    receivedAt: new Date(),
  }
}

router.post('/', async (req, res, next) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body]
    if (payload.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one reading is required.' })
    }
    if (payload.length > 1000) {
      return res.status(413).json({ success: false, message: 'Maximum batch size is 1000 readings.' })
    }

    const documents = payload.map(normalizeReading)
    const result = await getDatabase().collection('telemetry').insertMany(documents, { ordered: false })

    // Notify the in-process RxJS stream after MongoDB accepts the writes.
    documents.forEach((reading) => telemetrySubject.next(reading))

    return res.status(201).json({
      success: true,
      insertedCount: result.insertedCount,
      message: 'Telemetry accepted.',
    })
  } catch (error) {
    if (error.message?.includes('deviceId') || error.message?.includes('numeric value')) {
      return res.status(400).json({ success: false, message: error.message })
    }
    next(error)
  }
})

router.get('/latest', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 200)
    const deviceId = req.query.deviceId
    const query = deviceId ? { 'metadata.deviceId': String(deviceId) } : {}
    const readings = await getDatabase().collection('telemetry')
      .find(query).sort({ timestamp: -1 }).limit(limit).toArray()
    res.json({ success: true, count: readings.length, data: readings })
  } catch (error) {
    next(error)
  }
})

export default router
