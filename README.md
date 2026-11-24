# NexusFlow: Visual IoT Telemetry & Rule Engine

**A Visual Platform for Real-Time IoT Monitoring, Telemetry Analytics, and Intelligent Rule-Based Automation.**

![Project](https://img.shields.io/badge/Project-NexusFlow-blue)
![Domain](https://img.shields.io/badge/Domain-Web%20Development-green)
![Internship](https://img.shields.io/badge/Internship-Infotact%20Solutions-orange)
![Stack](https://img.shields.io/badge/Stack-MERN-green)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

---

## 📌 Project Overview

**NexusFlow** is a web-based IoT telemetry monitoring and visual rule-engine platform designed to collect, process, visualize, and analyze real-time sensor data.

The platform provides a React-based dashboard and visual workflow builder that allows users to create sensor-processing pipelines. The Node.js backend processes incoming telemetry, evaluates configurable rules, executes active workflows using RxJS, and stores telemetry and execution history in MongoDB.

NexusFlow aims to simplify IoT monitoring and rule-based automation through real-time data processing and visual workflow configuration.

---

## 🎯 Project Objectives

- Develop an interactive IoT monitoring dashboard.
- Collect and store sensor telemetry data.
- Implement MongoDB Time-Series storage for telemetry.
- Visualize real-time sensor readings and moving averages.
- Build a visual workflow editor using React Flow.
- Compile visual workflows into executable processing plans.
- Execute configurable rules against incoming telemetry.
- Generate and broadcast alerts when conditions are satisfied.
- Monitor workflow execution history and statistics.
- Provide authentication for dashboard users.

---

## ✨ Key Features

### 1. Dashboard

- Centralized IoT monitoring interface.
- Telemetry statistics and summary cards.
- Live connection status.
- Real-time sensor data visualization.
- Moving-average monitoring.
- Recent workflow execution information.

### 2. Visual Workflow Builder

- Node-based workflow editor.
- Drag-and-drop workflow configuration.
- Sensor, moving-average, and alert operations.
- Workflow graph serialization.
- Backend workflow compilation.
- Workflow activation and deactivation.

### 3. IoT Telemetry Processing

- REST API for sensor data ingestion.
- Support for individual and batch telemetry submissions.
- MongoDB Time-Series storage.
- Telemetry validation.
- Device and metric identification.
- Historical telemetry queries.

### 4. Live Telemetry Dashboard

- Real-time updates through Socket.IO.
- Incoming telemetry event monitoring.
- Moving-average calculations using RxJS.
- Live chart updates.
- Device-based telemetry filtering.

### 5. Device Discovery

- Discover devices from stored telemetry records.
- View device IDs and observed metrics.
- Display latest observed timestamps.
- View device reading counts.
- Filter telemetry history by device and metric.

**Note:** Device discovery is currently based on received telemetry. A separate device registration and lifecycle management module is not yet implemented.

### 6. Rule Engine

- Configurable telemetry conditions.
- Numeric threshold comparisons.
- Rule creation, updating, and deletion.
- Automatic evaluation of enabled rules.
- Alert generation when conditions match.

Supported operators:

`>` `>=` `<` `<=` `==` `!=`

### 7. Workflow Execution Monitoring

- Compile and save workflows.
- Activate and deactivate workflows.
- Execute active workflows against matching telemetry.
- Persist workflow execution records.
- Retrieve recent execution history.
- View execution statistics.
- Receive live execution events through Socket.IO.

### 8. Authentication

- User registration.
- Email and password login.
- Password hashing using Node.js scrypt.
- Signed HS256 access tokens.
- Protected dashboard APIs.
- Authenticated Socket.IO connections.

---

## 🏗️ System Architecture

```text
                  IoT Devices / Simulators
                           |
                           | Sensor Telemetry
                           v
                +------------------------+
                |    Express REST API    |
                |   Telemetry Ingestion  |
                +-----------+------------+
                            |
                 +----------+----------+
                 |                     |
                 v                     v
        +----------------+    +------------------+
        | MongoDB        |    | RxJS Pipeline    |
        | Time-Series DB |    | Stream Processing|
        +----------------+    +--------+---------+
                                       |
                          +------------+------------+
                          |                         |
                          v                         v
                  +---------------+         +---------------+
                  | Rule Engine   |         | Workflow      |
                  | Evaluation    |         | Execution     |
                  +-------+-------+         +-------+-------+
                          |                         |
                          v                         v
                  +---------------+         +---------------+
                  | Alert Storage |         | Execution     |
                  |               |         | History       |
                  +-------+-------+         +-------+-------+
                          |                         |
                          +------------+------------+
                                       |
                                       v
                              +----------------+
                              |   Socket.IO    |
                              | Live Events    |
                              +-------+--------+
                                      |
                                      v
                              +----------------+
                              | React Dashboard|
                              | React Flow     |
                              | Recharts       |
                              +----------------+
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 |
| Build Tool | Vite |
| Workflow Editor | @xyflow/react |
| Styling | CSS, Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js |
| API Framework | Express 5 |
| Database | MongoDB |
| Database Driver | MongoDB Node.js Driver |
| Time-Series Storage | MongoDB Time-Series Collections |
| Reactive Processing | RxJS |
| Real-Time Communication | Socket.IO |
| Authentication | JWT-style HS256 tokens |
| Password Security | Node.js scrypt |
| Testing | Node.js Test Runner |
| Code Quality | ESLint |
| Version Control | Git & GitHub |

---

## 📂 Project Structure

```text
NexusFlow/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── telemetry.routes.js
│   │   │   ├── rule.routes.js
│   │   │   ├── alert.routes.js
│   │   │   └── workflow.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.js
│   │   │   ├── movingAverage.js
│   │   │   ├── movingAverage.test.js
│   │   │   ├── telemetryPipeline.js
│   │   │   ├── telemetryQuery.js
│   │   │   ├── telemetryQuery.test.js
│   │   │   ├── ruleEngine.js
│   │   │   ├── ruleEngine.test.js
│   │   │   ├── workflowCompiler.js
│   │   │   ├── workflowCompiler.test.js
│   │   │   ├── workflowExecution.js
│   │   │   ├── workflowExecution.test.js
│   │   │   └── workflowPlanRunner.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── TODAYS_WORK_17_NOV_2026.md
├── TODAYS_WORK_18_NOV_2026.md
├── TODAYS_WORK_19_NOV_2026.md
├── TODAYS_WORK_20_NOV_2026.md
├── TODAYS_WORK_21_NOV_2026.md
├── WORKLOG_20_21_NOV_2026.md
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

Install the following:

- Node.js 20 or later
- npm
- MongoDB 5.0 or later
- Git
- Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/Vsvardhan55/NexusFlow-IoT-Rule-Engine.git
```

```bash
cd NexusFlow-IoT-Rule-Engine
```

### 2. Backend Configuration

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

**Windows CMD:**

```cmd
copy .env.example .env
```

**PowerShell:**

```powershell
Copy-Item .env.example .env
```

### 3. Configure Backend Environment Variables

Update `backend/.env`:

```env
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=nexusflow

CLIENT_ORIGIN=http://localhost:5173

MONGO_MAX_POOL_SIZE=50

RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=300

NODE_ENV=development

MOVING_AVERAGE_WINDOW=10

JWT_SECRET=replace-with-a-random-secret-at-least-32-characters-long
```

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Replace the example value in `.env` with the generated secret.

**Important:** Never upload your `.env` file or production secrets to GitHub.

### 4. Start the Backend

Make sure MongoDB is running.

From the `backend` directory:

```bash
npm run dev
```

Backend API:

```text
http://localhost:5000
```

Health endpoint:

```text
http://localhost:5000/api/health
```

Authentication health endpoint:

```text
http://localhost:5000/api/auth/health
```

### 5. Frontend Configuration

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `frontend/.env` if you need to configure a non-default backend URL:

```env
VITE_API_URL=http://localhost:5000
```

### 6. Start the Frontend

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

The frontend and backend should run in separate terminals.

---

## 🔌 Backend API Documentation

Base URL:

```text
http://localhost:5000
```

Protected dashboard endpoints require:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API and database health |
| GET | `/api/auth/health` | Check authentication API availability |

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Authenticate a user | Public |
| GET | `/api/auth/me` | Get current user information | Protected |

Registration example:

```json
{
  "name": "User",
  "email": "user@example.com",
  "password": "your-secure-password"
}
```

Login example:

```json
{
  "email": "user@example.com",
  "password": "your-secure-password"
}
```

### Telemetry

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/telemetry` | Submit telemetry readings |
| GET | `/api/telemetry/latest` | Retrieve latest telemetry |
| GET | `/api/telemetry/stats` | Retrieve telemetry statistics |
| GET | `/api/telemetry/devices` | Discover devices from telemetry |
| GET | `/api/telemetry/history` | Retrieve filtered telemetry history |

Example telemetry payload:

```json
{
  "deviceId": "turbine-01",
  "metric": "temperature",
  "value": 86.5,
  "unit": "C",
  "location": "Plant A"
}
```

Batch ingestion is supported with a maximum of 1,000 readings per request.

Example:

```json
[
  {
    "deviceId": "turbine-01",
    "metric": "temperature",
    "value": 86.5,
    "unit": "C"
  },
  {
    "deviceId": "turbine-01",
    "metric": "vibration",
    "value": 42.8,
    "unit": "mm/s"
  }
]
```

### Device Discovery

```http
GET /api/telemetry/devices
```

Returns information derived from stored telemetry:

- Device ID
- Observed metrics
- Latest reading timestamp
- Total reading count

### Telemetry History

Example:

```http
GET /api/telemetry/history?deviceId=turbine-01&metric=temperature&limit=100
```

Supported query parameters:

| Parameter | Description |
|---|---|
| `deviceId` | Filter by device |
| `metric` | Filter by sensor metric |
| `from` | Start timestamp |
| `to` | End timestamp |
| `limit` | Maximum records, from 1 to 500 |

### Rules

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rules` | List rules |
| POST | `/api/rules` | Create a rule |
| PATCH | `/api/rules/:id` | Update a rule |
| DELETE | `/api/rules/:id` | Delete a rule |

Example rule:

```json
{
  "name": "High Temperature Alert",
  "description": "Notify when turbine temperature exceeds 80 C",
  "enabled": true,
  "condition": {
    "metric": "temperature",
    "operator": ">",
    "value": 80,
    "deviceId": "turbine-01"
  },
  "action": {
    "type": "alert",
    "message": "Temperature exceeded 80 C"
  }
}
```

### Alerts

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/alerts` | Retrieve recent alerts |

Example:

```http
GET /api/alerts?limit=50
```

### Workflows

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/workflows/compile` | Compile and validate a workflow |
| GET | `/api/workflows` | Retrieve saved workflows |
| POST | `/api/workflows` | Save a workflow |
| POST | `/api/workflows/:id/activate` | Activate a workflow |
| POST | `/api/workflows/:id/deactivate` | Deactivate a workflow |
| GET | `/api/workflows/:id/executions` | Retrieve executions for a workflow |
| GET | `/api/workflows/executions/recent` | Retrieve recent executions |
| GET | `/api/workflows/executions/summary` | Retrieve execution statistics |

Example:

```http
GET /api/workflows/executions/recent?limit=50
```

Execution summary:

```http
GET /api/workflows/executions/summary
```

---

## ⚡ Real-Time Socket.IO Events

NexusFlow uses Socket.IO to broadcast telemetry and workflow information to authenticated dashboard clients.

| Event | Description |
|---|---|
| `telemetry:batch` | Broadcasts buffered telemetry readings |
| `telemetry:average` | Broadcasts moving-average calculations |
| `alert:new` | Broadcasts newly triggered alerts |
| `workflow:execution` | Broadcasts workflow execution results |

### Moving Average Processing

The backend processes telemetry through an RxJS moving-average stream.

- Default window size: 10 samples.
- Window size is configurable through `MOVING_AVERAGE_WINDOW`.
- Samples are grouped by device and metric.
- Average values are broadcast through `telemetry:average`.

### Workflow Execution

The workflow execution process:

1. Create a visual workflow using the Rule Builder.
2. Submit the workflow graph to the backend.
3. Compile and validate the graph.
4. Save the compiled workflow in MongoDB.
5. Activate the workflow.
6. Submit matching telemetry readings.
7. Execute the workflow against incoming readings.
8. Store execution history.
9. Broadcast execution results through Socket.IO.

The current workflow supports sensor, moving-average, and alert operations.

---

## 🧪 Testing and Quality Assurance

### Backend Tests

Navigate to the backend directory:

```bash
cd backend
```

Run:

```bash
npm test
```

The backend uses the built-in Node.js test runner.

### Frontend Lint

Navigate to the frontend directory:

```bash
cd frontend
```

Run:

```bash
npm run lint
```

### Frontend Production Build

```bash
npm run build
```

### Frontend Preview

```bash
npm run preview
```

Run these checks after making changes and before committing to GitHub.

---

## 🔐 Security Considerations

- Passwords are stored as scrypt password hashes.
- Authentication uses signed HS256 access tokens.
- Protected dashboard APIs require authentication.
- Socket.IO dashboard connections require an access token.
- CORS origins are configurable.
- Basic per-IP request limiting is implemented.
- JSON request bodies have a size limit.
- Security-related HTTP headers are configured.
- Environment secrets should not be committed to GitHub.

**Current limitation:** The application uses local storage for browser access tokens. Production deployment should consider secure HttpOnly cookies, CSRF protection, HTTPS, and stronger production-grade rate limiting.

---

## ⚠️ Current Implementation Limitations

The following features are not yet fully implemented:

- Separate functional pages for every sidebar navigation item.
- Dedicated device registration and lifecycle management.
- External SMS and webhook notification providers.
- Advanced role-based access control.
- Per-user isolation of workflow and project records.
- Distributed RxJS processing across multiple backend instances.
- Redis-based Socket.IO scaling.
- Production deployment and load testing.

Workflow alert nodes currently create in-app alerts and Socket.IO events. They do not send actual SMS messages or external webhook notifications.

The device inventory is derived from telemetry received by the backend rather than a separate device-registration database.

---

## 📈 Development Progress

| Date | Development Work |
|---|---|
| 17 November 2026 | Sensor node configuration and workflow improvements |
| 18 November 2026 | Inspector configuration and validation improvements |
| 19 November 2026 | Live telemetry dashboard and moving-average enhancements |
| 20 November 2026 | Device discovery and telemetry history APIs |
| 21 November 2026 | Persistent workflow execution monitoring and statistics |

See the daily work log files in the repository for additional development details.

---

## 🗓️ Internship Information

| Particular | Details |
|---|---|
| Organization | Infotact Solutions |
| Intern Name | Sethu Vardhan Valluri |
| Internship Role | Associate L1 Intern |
| Domain | Web Development |
| Internship Duration | 3 Months |
| Project Name | NexusFlow: Visual IoT Telemetry & Rule Engine |
| Project Start Date | 10 November 2026 |
| Project End Date | 10 December 2026 |

---

## 🚀 Future Enhancements

- Functional multi-page dashboard navigation.
- Dedicated device registration and management.
- MQTT-based IoT communication.
- External webhook integrations.
- SMS and email notifications.
- Advanced telemetry analytics.
- Customizable dashboard widgets.
- Role-based access control.
- Historical data export.
- Cloud deployment.
- Distributed event processing.
- Advanced workflow monitoring.

---

## 📜 License

This project is developed as part of the Infotact Solutions internship program.

Project materials are intended for educational and internship purposes. Refer to the organization's policies before redistributing project materials.

---

## 🙌 Acknowledgement

We sincerely thank **Infotact Solutions** for providing the opportunity to gain practical experience in Web Development, MERN stack engineering, database integration, real-time communication, and collaborative software development.

---

**NexusFlow – Connecting Devices, Visualizing Intelligence, Automating Actions.**

Developed as part of the Infotact Solutions Internship Program | November–December 2026.
