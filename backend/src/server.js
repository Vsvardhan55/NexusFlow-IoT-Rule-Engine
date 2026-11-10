import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { connectDatabase, closeDatabase } from './config/database.js'
import telemetryRoutes from './routes/telemetry.routes.js'
import { startTelemetryPipeline } from './services/telemetryPipeline.js'

const app = express()
const httpServer = createServer(app)
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

const io = new Server(httpServer, {
  cors: { origin: allowedOrigin, methods: ['GET', 'POST'] },
})

app.use(cors({ origin: allowedOrigin }))
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ success: true, service: 'NexusFlow API', status: 'healthy' })
})

app.use('/api/telemetry', telemetryRoutes)

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ success: false, message: 'Internal server error.' })
})

io.on('connection', (socket) => {
  console.log(`WebSocket client connected: ${socket.id}`)
  socket.on('disconnect', () => console.log(`WebSocket client disconnected: ${socket.id}`))
})

const stopPipeline = startTelemetryPipeline(io)

const port = Number(process.env.PORT) || 5000

try {
  await connectDatabase()
  httpServer.listen(port, () => {
    console.log(`NexusFlow API listening on http://localhost:${port}`)
  })
} catch (error) {
  console.error('Failed to start NexusFlow backend:', error.message)
  process.exit(1)
}

async function shutdown() {
  console.log('Shutting down NexusFlow backend...')
  stopPipeline()
  await closeDatabase()
  httpServer.close(() => process.exit(0))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
