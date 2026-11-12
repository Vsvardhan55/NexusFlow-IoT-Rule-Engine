import { MongoClient } from 'mongodb'
let client
let database
export async function connectDatabase() {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB || 'nexusflow'
  if (!uri) throw new Error('MONGODB_URI is missing. Add it to your .env file.')
  client = new MongoClient(uri, { maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 50, minPoolSize: 2, retryWrites: true, serverSelectionTimeoutMS: 10000 })
  await client.connect()
  database = client.db(dbName)
  const existing = await database.listCollections({ name: 'telemetry' }).toArray()
  if (!existing.length) await database.createCollection('telemetry', { timeseries: { timeField: 'timestamp', metaField: 'metadata', granularity: 'seconds' } })
  await Promise.all([
    database.collection('telemetry').createIndex({ 'metadata.deviceId': 1, timestamp: -1 }),
    database.collection('rules').createIndex({ enabled: 1, 'condition.metric': 1 }),
    database.collection('alerts').createIndex({ triggeredAt: -1 }),
  ])
  console.log(`MongoDB connected: ${dbName}`)
  return database
}
export function getDatabase() { if (!database) throw new Error('Database is not connected yet.'); return database }
export async function closeDatabase() { if (client) await client.close(); client = undefined; database = undefined }
