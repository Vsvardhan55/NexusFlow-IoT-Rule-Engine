import { MongoClient } from 'mongodb'

let client
let database

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB || 'nexusflow'
  if (!uri) throw new Error('MONGODB_URI is missing. Add it to your .env file.')

  client = new MongoClient(uri, {
    maxPoolSize: 50,
    minPoolSize: 5,
    retryWrites: true,
  })
  await client.connect()
  database = client.db(dbName)

  const collections = await database.listCollections({ name: 'telemetry' }).toArray()
  if (collections.length === 0) {
    await database.createCollection('telemetry', {
      timeseries: {
        timeField: 'timestamp',
        metaField: 'metadata',
        granularity: 'seconds',
      },
    })
  }

  await database.collection('telemetry').createIndex({
    'metadata.deviceId': 1,
    timestamp: -1,
  })
  console.log(`MongoDB connected: ${dbName}`)
  return database
}

export function getDatabase() {
  if (!database) throw new Error('Database is not connected yet.')
  return database
}

export async function closeDatabase() {
  if (client) await client.close()
}
