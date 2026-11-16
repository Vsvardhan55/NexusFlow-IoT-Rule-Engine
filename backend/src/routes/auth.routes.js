import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { getDatabase } from '../config/database.js'
import { hashPassword, verifyPassword, signToken } from '../services/auth.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()
const safeUser = (user) => ({ id: String(user._id), name: user.name, email: user.email, role: user.role || 'user' })

// Public diagnostic endpoint: use this to confirm the running backend includes auth routes.
router.get('/health', (_req, res) => res.json({ success: true, service: 'NexusFlow authentication API', status: 'available', endpoints: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'] }))
router.post('/register', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim()
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')
    if (name.length < 2 || name.length > 60) return res.status(400).json({ success: false, message: 'Name must be between 2 and 60 characters.' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ success: false, message: 'Enter a valid email address.' })
    if (password.length < 8 || password.length > 128) return res.status(400).json({ success: false, message: 'Password must be between 8 and 128 characters.' })
    const users = getDatabase().collection('users')
    if (await users.findOne({ email })) return res.status(409).json({ success: false, message: 'An account with this email already exists.' })
    // Create the ID and token before writing the account. A missing JWT_SECRET
    // must never leave behind an account that the client cannot sign into.
    const user = { _id: new ObjectId(), name, email, passwordHash: await hashPassword(password), role: 'user', createdAt: new Date() }
    const token = signToken(user)
    await users.insertOne(user)
    res.status(201).json({ success: true, message: 'Account created successfully.', data: { user: safeUser(user), token } })
  } catch (error) { if (error.code === 11000) return res.status(409).json({ success: false, message: 'An account with this email already exists.' }); next(error) }
})
router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')
    const user = await getDatabase().collection('users').findOne({ email })
    if (!user || !(await verifyPassword(password, user.passwordHash))) return res.status(401).json({ success: false, message: 'Email or password is incorrect.' })
    res.json({ success: true, message: 'Signed in successfully.', data: { user: safeUser(user), token: signToken(user) } })
  } catch (error) { next(error) }
})
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await getDatabase().collection('users').findOne({ _id: req.user.id ? new ObjectId(req.user.id) : null }, { projection: { passwordHash: 0 } })
    if (!user) return res.status(404).json({ success: false, message: 'Account not found.' })
    res.json({ success: true, data: { user: safeUser(user) } })
  } catch (error) { next(error) }
})
export default router
