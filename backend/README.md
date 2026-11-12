# NexusFlow Backend — Improved

Node.js + Express 5 + MongoDB Time-Series + RxJS + Socket.IO backend for the NexusFlow IoT telemetry and rule engine.

## Requirements
- Node.js 20+
- MongoDB 5.0+ (time-series collection support)

## Install and run
```bash
cd backend
npm install
cp .env.example .env   # Windows PowerShell: Copy-Item .env.example .env
# Set MONGODB_URI in .env
npm run dev
```

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API and database health |
| POST | `/api/telemetry` | Store one reading or a batch (max 1000) |
| GET | `/api/telemetry/latest?limit=20&deviceId=turbine-01` | Latest readings |
| GET | `/api/telemetry/stats` | Total readings and distinct devices |
| GET | `/api/rules` | List rules |
| POST | `/api/rules` | Create a rule |
| PATCH | `/api/rules/:id` | Update a rule |
| DELETE | `/api/rules/:id` | Delete a rule |
| GET | `/api/alerts?limit=50` | Recent triggered alerts |

### Create a rule
```json
{
  "name": "Turbine high temperature",
  "description": "Notify when the turbine overheats",
  "enabled": true,
  "condition": { "metric": "temperature", "operator": ">", "value": 80, "deviceId": "turbine-01" },
  "action": { "type": "alert", "message": "Temperature exceeded 80 C" }
}
```
Allowed operators: `>`, `>=`, `<`, `<=`, `==`, `!=`. Currently supported action: `alert`.

### Send telemetry
```json
{ "deviceId": "turbine-01", "metric": "temperature", "value": 86.5, "unit": "C", "location": "Plant A" }
```

## Socket.IO events
- `telemetry:batch` — buffered telemetry updates (250 ms window)
- `alert:new` — a rule-triggered alert

## Improvements included
- Modular rule and alert APIs; dynamic threshold evaluation (no `eval`).
- MongoDB Time-Series telemetry collection and supporting indexes.
- Input validation, bounded batch size, JSON body limit and configurable basic per-IP rate limiting.
- Security headers, explicit CORS origins and graceful shutdown.
- Health check that pings MongoDB; telemetry stats endpoint.
- Unit tests for rule validation and evaluation: `npm test`.

## Important limitations
This version provides a functional threshold rule engine, not a complete React Flow graph compiler. It supports alert actions only; webhook/SMS actions, authentication/authorization, distributed workers, Redis-based Socket.IO scaling, and production-grade rate limiting are not included. The in-memory RxJS stream is single-process. Benchmark throughput on your own hardware and database before claiming a writes/second figure.
