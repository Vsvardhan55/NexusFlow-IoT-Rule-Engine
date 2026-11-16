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
| POST | `/api/workflows/compile` | Validate a React Flow graph and return a topologically ordered execution plan |
| GET | `/api/workflows` | List saved workflows |
| POST | `/api/workflows` | Compile and save a workflow draft |
| POST | `/api/workflows/:id/activate` | Activate a saved workflow for live telemetry |
| POST | `/api/workflows/:id/deactivate` | Stop live workflow processing |
| GET | `/api/workflows/:id/executions?limit=50` | Read persisted execution history

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
- `alert:new` — a rule- or workflow-triggered in-app alert
- `workflow:execution` — node-by-node result for each matching reading processed by an active workflow

## Improvements included
- Modular rule and alert APIs; dynamic threshold evaluation (no `eval`).
- MongoDB Time-Series telemetry collection and supporting indexes.
- Input validation, bounded batch size, JSON body limit and configurable basic per-IP rate limiting.
- Security headers, explicit CORS origins and graceful shutdown.
- Health check that pings MongoDB; telemetry stats endpoint.
- Unit tests for rule validation and evaluation: `npm test`.

## Workflow compiler
Send the React Flow `name`, `nodes`, and `edges` to `/api/workflows/compile`. The compiler validates node types and connections, rejects cycles and invalid thresholds, then returns an ordered plan for sensor, moving-average, and alert operations. Saved workflows can be activated through the API. Active workflows execute against each matching incoming telemetry reading; execution records are persisted in `workflowExecutions`.


## Live workflow execution

1. In the Rule Builder, click **Compile**. The backend validates the React Flow graph, compiles it and saves a draft in MongoDB.
2. Click **Run workflow** to activate that saved workflow. The button deactivates it when clicked again.
3. Send telemetry to `POST /api/telemetry`. A reading is routed through each active workflow whose sensor node matches its `metric` and (when configured) `deviceId`.
4. Moving-average nodes keep a rolling sample window per workflow/node/device/metric. Alert nodes evaluate the configured numeric threshold.
5. Every matched reading creates a `workflowExecutions` document and emits `workflow:execution`. Triggered alert nodes also create `alerts` documents and emit `alert:new`.

Example activation flow:
```http
POST /api/workflows
Content-Type: application/json

{ "name": "Turbine Vibration Monitor", "nodes": [...], "edges": [...] }

POST /api/workflows/<returned-id>/activate
POST /api/telemetry
Content-Type: application/json

{ "deviceId": "sensor-01", "metric": "vibration", "value": 56.2, "unit": "mm/s" }
```

The sensor node's metric is taken from `data.metricName`, or inferred from the part of `data.subtitle` before `·`; the device ID is inferred from the part after `·`. Set `data.deviceId` explicitly to override inference. Threshold alerts are in-app only; configure a real notification provider before describing them as SMS or webhook delivery.

## Important limitations
Workflow alert nodes currently create persisted in-app alerts and Socket.IO events; they do not send real SMS or webhook messages. External SMS/webhook providers, authentication/authorization, distributed workers, Redis-based Socket.IO scaling, and production-grade rate limiting are not included. The in-memory RxJS stream is single-process. Benchmark throughput on your own hardware and database before claiming a writes/second figure.


## Live moving-average stream

Every accepted telemetry reading is also processed by an RxJS rolling moving-average stream. Samples are grouped independently by `deviceId` and `metric`; the default rolling window is 10 samples and can be changed with `MOVING_AVERAGE_WINDOW` in the backend environment. The server broadcasts each result over Socket.IO as `telemetry:average` with `deviceId`, `metric`, `average`, `sampleCount`, `windowSize`, `unit`, and timestamps. The first result for each group is emitted immediately using the samples available so far.
