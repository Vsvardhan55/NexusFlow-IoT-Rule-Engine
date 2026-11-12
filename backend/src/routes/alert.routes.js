import { Router } from 'express'
import { getDatabase } from '../config/database.js'
const router = Router()
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200)
    const data = await getDatabase().collection('alerts').find({}).sort({ triggeredAt: -1 }).limit(limit).toArray()
    res.json({ success: true, count: data.length, data })
  } catch (error) { next(error) }
})
export default router
