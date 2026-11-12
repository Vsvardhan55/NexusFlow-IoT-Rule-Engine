import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { connectDatabase, closeDatabase, getDatabase } from './config/database.js'
import telemetryRoutes from './routes/telemetry.routes.js'
import ruleRoutes from './routes/rule.routes.js'
import alertRoutes from './routes/alert.routes.js'
import { startTelemetryPipeline } from './services/telemetryPipeline.js'

const app = express()
const httpServer = createServer(app)
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((value) => value.trim())
const io = new Server(httpServer, { cors: { origin: origins, methods: ['GET', 'POST', 'PATCH', 'DELETE'] } })
app.disable('x-powered-by')
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
  next()
})
app.use(cors({ origin: origins }))
app.use(express.json({ limit: '1mb' }))

// Lightweight per-IP request guard; tune limits through environment variables.
const windows = new Map()
app.use((req, res, next) => {
  const now = Date.now(); const key = req.ip
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000
  const max = Number(process.env.RATE_LIMIT_MAX) || 300
  let entry = windows.get(key)
  if (!entry || now - entry.start > windowMs) entry = { start: now, count: 0 }
  entry.count += 1; windows.set(key, entry)
  if (entry.count > max) return res.status(429).json({ success: false, message: 'Too many requests. Try again shortly.' })
  next()
})

app.get('/api/health', async (_req, res) => {
  try { await getDatabase().command({ ping: 1 }); res.json({ success: true, service: 'NexusFlow API', status: 'healthy', database: 'connected', timestamp: new Date().toISOString() }) }
  catch { res.status(503).json({ success: false, service: 'NexusFlow API', status: 'unavailable', database: 'disconnected' }) }
})
app.use('/api/telemetry', telemetryRoutes)
app.use('/api/rules', ruleRoutes)
app.use('/api/alerts', alertRoutes)
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found.' }))
app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ success: false, message: process.env.NODE_ENV === 'production' ? 'Internal server error.' : error.message }) })
io.on('connection', (socket) => { console.log(`Socket connected: ${socket.id}`); socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`)) })
const stopPipeline = startTelemetryPipeline(io)
const port = Number(process.env.PORT) || 5000
try { await connectDatabase(); httpServer.listen(port, () => console.log(`NexusFlow API listening on http://localhost:${port}`)) }
catch (error) { console.error('Failed to start NexusFlow backend:', error.message); process.exit(1) }
let shuttingDown = false
async function shutdown() {
  if (shuttingDown) return; shuttingDown = true
  console.log('Shutting down NexusFlow backend...'); stopPipeline(); io.close()
  await new Promise((resolve) => httpServer.close(resolve))
  await closeDatabase(); process.exit(0)
}
process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown)
