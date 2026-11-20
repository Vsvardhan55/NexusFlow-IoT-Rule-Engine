# NexusFlow Workspace Navigation Implementation

## Implemented

- Replaced placeholder sidebar anchors and `preventDefault()` handlers with working React navigation state.
- Added active navigation styling and page-aware breadcrumb labels.
- Added **Overview** with device, telemetry, alert, execution and connection summaries.
- Added **Devices** with discovered device IDs, observed metrics, reading counts and latest-seen timestamps. Devices are discovered from telemetry records; this project does not currently have a separate device-registration collection/API.
- Added **Telemetry** with historical readings and device/metric filters using `GET /api/telemetry/history`.
- Added **Alerts** with recent alert records using `GET /api/alerts`.
- Added **Data sources** with the ingestion endpoint, JSON example, and a form that posts a test reading to `POST /api/telemetry`.
- Added **Settings** with a browser-local backend API URL setting and signed-in account details.
- Added responsive styles for the new pages and sidebar buttons.
- Updated API URL resolution to prefer the saved browser setting, then `VITE_API_URL`, then `http://localhost:5000`.

## Notes

- The Rule Builder remains the existing React Flow workspace and is now reachable from the sidebar.
- The backend routes already present in this project are reused; no database schema migration is required.
- The Settings API URL is stored in `localStorage`. Reload the frontend after changing it so all existing socket connections and data loaders reconnect using the new URL.
- Device entries appear after a device publishes at least one telemetry reading.
- The telemetry ingestion endpoint is intentionally unauthenticated in the current backend; read APIs remain protected by the existing authentication middleware.

## Verification status

- Source files and archive structure were inspected after editing.
- A full frontend lint/build could not be run in this packaging environment because `npm ci` did not complete before the environment timeout. Run `npm install`, `npm run lint`, and `npm run build` on the Windows development machine before committing.


## Week 3 implementation (19–25 November 2026)

This update strengthens the live telemetry path and adds a local device simulator.

### Run a local telemetry simulation

1. Start MongoDB and configure `backend/.env` from `backend/.env.example`.
2. Start the API with `cd backend && npm install && npm run dev`.
3. In another terminal, run `cd backend && npm run simulate`.
4. Sign in to the frontend and open the live dashboard. The simulator posts vibration and temperature readings for `turbine-01` every second by default.

Override simulator settings with `SIMULATOR_API_URL`, `SIMULATOR_INTERVAL_MS`, and `SIMULATOR_DEVICE_ID`. Stop it with Ctrl+C.

### Week 3 reliability updates

- Telemetry ingestion validation is isolated in a reusable, unit-tested service.
- Workflow compilation now treats `metricName` as the sensor metric key and no longer mistakes the canvas display value for a required numeric input.
- Asynchronous workflow and rule processing is serialized in arrival order to reduce out-of-order execution under burst traffic.
- Moving-average and batched telemetry Socket.IO events continue to feed the dashboard.

See `WORK_LOG_25_NOV_2026.md` for the implementation checklist and verification notes.
