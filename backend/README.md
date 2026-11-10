# NexusFlow Backend Starter

Express API + MongoDB Time-Series collection + RxJS event batching + Socket.IO broadcast.

## Requirements
- Node.js 20+
- MongoDB 5.0+ running locally or a MongoDB connection string

## Setup
```bash
npm install
copy .env.example .env
```
Edit `.env` if your MongoDB connection string or frontend origin differs.

## Run
```bash
npm run dev
```

## Endpoints
- `GET /api/health` – backend health check
- `POST /api/telemetry` – insert one reading or an array of readings (max 1000)
- `GET /api/telemetry/latest?limit=20` – fetch latest readings
- Socket.IO event `telemetry:batch` – broadcasts buffered telemetry batches

Example request body:
```json
{
  "deviceId": "turbine-01",
  "metric": "vibration",
  "value": 42.8,
  "unit": "mm/s",
  "location": "Plant A"
}
```

This is an initial ingestion and streaming scaffold, not the completed rule compiler. Workflow JSON parsing, configurable RxJS operators, threshold evaluation, and outbound alert actions are still to be implemented. Performance claims such as 5,000 writes/second must be measured under a documented test setup before being reported.
