import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { getDatabase } from '../config/database.js'
import { validateRule } from '../services/ruleEngine.js'

const router = Router()
const collection = () => getDatabase().collection('rules')
const validId = (id) => ObjectId.isValid(id)

router.get('/', async (_req, res, next) => {
  try {
    const data = await collection().find({}).sort({ createdAt: -1 }).toArray()
    res.json({ success: true, count: data.length, data })
  } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const rule = validateRule(req.body)
    const now = new Date()
    const document = { ...rule, createdAt: now, updatedAt: now }
    const result = await collection().insertOne(document)
    res.status(201).json({ success: true, data: { _id: result.insertedId, ...document } })
  } catch (error) {
    if (/required|numeric|operator|supported/.test(error.message)) return res.status(400).json({ success: false, message: error.message })
    next(error)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid rule ID.' })
    const current = await collection().findOne({ _id: new ObjectId(req.params.id) })
    if (!current) return res.status(404).json({ success: false, message: 'Rule not found.' })
    const merged = validateRule({ ...current, ...req.body, condition: req.body.condition ?? current.condition, action: req.body.action ?? current.action })
    await collection().updateOne({ _id: current._id }, { $set: { ...merged, updatedAt: new Date() } })
    res.json({ success: true, data: { ...current, ...merged, updatedAt: new Date() } })
  } catch (error) {
    if (/required|numeric|operator|supported/.test(error.message)) return res.status(400).json({ success: false, message: error.message })
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid rule ID.' })
    const result = await collection().deleteOne({ _id: new ObjectId(req.params.id) })
    if (!result.deletedCount) return res.status(404).json({ success: false, message: 'Rule not found.' })
    res.json({ success: true, message: 'Rule deleted.' })
  } catch (error) { next(error) }
})

export default router
