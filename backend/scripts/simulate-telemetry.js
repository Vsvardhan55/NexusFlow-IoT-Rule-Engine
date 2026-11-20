import 'dotenv/config'

const apiUrl = (process.env.SIMULATOR_API_URL || 'http://localhost:5000').replace(/\/$/, '')
const intervalMs = Math.max(250, Number(process.env.SIMULATOR_INTERVAL_MS) || 1000)
const deviceId = process.env.SIMULATOR_DEVICE_ID || 'turbine-01'
const metrics = [
  { metric: 'vibration', unit: 'mm/s', base: 38, amplitude: 18, drift: 0.8 },
  { metric: 'temperature', unit: '°C', base: 68, amplitude: 9, drift: 0.25 },
]
let sequence = 0
let stopped = false

function sample(config) {
  const wave = Math.sin(sequence / 5) * config.amplitude
  const noise = (Math.random() - 0.5) * config.amplitude * 0.18
  return Number((config.base + wave + noise + (sequence % 30) * config.drift / 30).toFixed(2))
}

async function publish() {
  const readings = metrics.map((config) => ({
    deviceId, metric: config.metric, value: sample(config), unit: config.unit,
    location: 'simulated-turbine', timestamp: new Date().toISOString(),
  }))
  const response = await fetch(`${apiUrl}/api/telemetry`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify(readings),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.message || `HTTP ${response.status}`)
  console.log(`[${new Date().toLocaleTimeString()}] sent ${result.insertedCount ?? readings.length} readings for ${deviceId}`)
}

console.log(`NexusFlow telemetry simulator → ${apiUrl}/api/telemetry`)
console.log(`Device: ${deviceId} | Interval: ${intervalMs}ms | Metrics: vibration, temperature`)
console.log('Press Ctrl+C to stop.')

async function tick() {
  if (stopped) return
  try { await publish() }
  catch (error) { console.error(`Publish failed: ${error.message}`) }
  sequence += 1
  if (!stopped) setTimeout(tick, intervalMs)
}

process.on('SIGINT', () => { stopped = true; console.log('\nSimulator stopped.'); process.exit(0) })
process.on('SIGTERM', () => { stopped = true; process.exit(0) })
await tick()
