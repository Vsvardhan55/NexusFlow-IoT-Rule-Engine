import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { getDatabase } from '../config/database.js'
import { compileWorkflow } from '../services/workflowCompiler.js'

const router = Router()

router.post('/compile', (req, res) => {
  try { res.json({ success: true, data: compileWorkflow(req.body) }) }
  catch (error) { res.status(400).json({ success: false, message: error.message }) }
})

router.get('/', async (_req, res, next) => {
  try {
    const data = await getDatabase().collection('workflows').find({}).sort({ updatedAt: -1 }).limit(100).toArray()
    res.json({ success: true, count: data.length, data })
  } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const compiled = compileWorkflow(req.body)
    const now = new Date()
    const document = {
      name: compiled.workflowName,
      graph: { name: req.body.name, nodes: req.body.nodes, edges: req.body.edges },
      compiled,
      active: false,
      createdAt: now,
      updatedAt: now,
    }
    const result = await getDatabase().collection('workflows').insertOne(document)
    res.status(201).json({ success: true, data: { ...document, _id: result.insertedId } })
  } catch (error) {
    if (error.message) return res.status(400).json({ success: false, message: error.message })
    next(error)
  }
})

router.post('/:id/activate', async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid workflow ID.' })
    const result = await getDatabase().collection('workflows').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { active: true, activatedAt: new Date(), updatedAt: new Date() } },
    )
    if (!result.matchedCount) return res.status(404).json({ success: false, message: 'Workflow not found.' })
    res.json({ success: true, message: 'Workflow activated for live telemetry.', data: { id: req.params.id, active: true } })
  } catch (error) { next(error) }
})

router.post('/:id/deactivate', async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid workflow ID.' })
    const result = await getDatabase().collection('workflows').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { active: false, updatedAt: new Date() } },
    )
    if (!result.matchedCount) return res.status(404).json({ success: false, message: 'Workflow not found.' })
    res.json({ success: true, message: 'Workflow deactivated.', data: { id: req.params.id, active: false } })
  } catch (error) { next(error) }
})

router.get('/:id/executions', async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid workflow ID.' })
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200)
    const data = await getDatabase().collection('workflowExecutions').find({ workflowId: new ObjectId(req.params.id) }).sort({ startedAt: -1 }).limit(limit).toArray()
    res.json({ success: true, count: data.length, data })
  } catch (error) { next(error) }
})

export default router
