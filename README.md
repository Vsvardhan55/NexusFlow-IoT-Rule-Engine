# NexusFlow: Visual IoT Telemetry & Rule Engine

**A Visual Platform for Real-Time IoT Monitoring, Telemetry Analytics, and Intelligent Rule-Based Automation.**

![Project](https://img.shields.io/badge/Project-NexusFlow-blue)
![Domain](https://img.shields.io/badge/Domain-Web%20Development-green)
![Internship](https://img.shields.io/badge/Internship-Infotact%20Solutions-orange)
---

## 📌 Project Overview

<<<<<<< HEAD
**NexusFlow** is a web-based IoT telemetry monitoring and visual rule-engine platform designed to collect, process, visualize, and analyze real-time sensor data.

The platform provides a React-based dashboard and visual workflow builder that allows users to create sensor-processing pipelines. The Node.js backend processes incoming telemetry, evaluates configurable rules, executes active workflows using RxJS, and stores telemetry and execution history in MongoDB.
=======
**NexusFlow** is a web-based IoT telemetry monitoring and rule engine platform designed to visualize device data, monitor real-time sensor readings, and automate actions based on configurable conditions.

The platform aims to provide a centralized dashboard where users can monitor connected IoT devices, analyze telemetry data through interactive visualizations, configure automation rules, and track device activities.

By combining modern web technologies, data visualization, backend services, and rule-based processing, NexusFlow aims to simplify IoT monitoring and make device management more accessible and efficient.

---

## 🎯 Project Objectives

- Develop a responsive and interactive IoT monitoring dashboard.
- Visualize real-time and historical device telemetry data.
- Provide centralized device monitoring and management.
- Implement a configurable rule engine for automated event detection.
- Enable users to define conditions and corresponding actions.
- Display alerts and notifications when specified conditions are triggered.
- Maintain organized telemetry data for monitoring and analysis.
- Develop a scalable and maintainable web application architecture.

---

## ✨ Key Features

The following features define the planned scope of NexusFlow.

### 1. IoT Dashboard
- Centralized monitoring interface.
- Device status overview.
- Telemetry statistics and summary cards.
- Interactive data visualizations.

### 2. Device Management
- Register and manage IoT devices.
- View individual device information.
- Monitor device connectivity and operational status.
- Organize devices for easier monitoring.

### 3. Telemetry Visualization
- Display sensor readings through interactive charts.
- Monitor parameters such as temperature, humidity, and other sensor values.
- View historical telemetry information.
- Identify changes and trends in device data.

### 4. Visual Rule Engine
- Create configurable automation rules.
- Define conditions based on telemetry values.
- Configure logical operators and threshold conditions.
- Associate actions with triggered rules.
- Monitor rule execution status.

### 5. Alerts and Notifications
- Generate alerts when predefined conditions are satisfied.
- Display triggered rule notifications.
- Maintain an event history.
- Highlight important device activities.

### 6. User Interface
- Responsive dashboard design.
- Organized navigation and reusable components.
- Interactive charts and data tables.
- Clean and accessible user experience.

---

## 🏗️ Proposed System Architecture

NexusFlow follows a modular web application architecture.

```text
              ┌─────────────────────────┐
              │       User Interface    │
              │     Web Dashboard       │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │      Frontend Layer     │
              │  Dashboard / Charts     │
              │  Device Management      │
              │  Rule Configuration     │
              └────────────┬────────────┘
                           │
                        REST API
                           │
                           ▼
              ┌─────────────────────────┐
              │      Backend Layer      │
              │   API & Business Logic  │
              │   Telemetry Processing  │
              │   Rule Engine            │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │      Database Layer     │
              │   Device Information    │
              │   Telemetry Records     │
              │   Rules & Event History │
              └─────────────────────────┘
                           ▲
                           │
              ┌─────────────────────────┐
              │       IoT Devices       │
              │   Sensors / Simulators  │
              └─────────────────────────┘
```

---

## 🛠️ Technology Stack

The final technology stack will be determined during implementation.

Potential technologies include:

| Layer | Technologies |
|---|---|
| Frontend | React.js / Next.js |
| Programming Languages | JavaScript / TypeScript |
| UI Styling | Tailwind CSS / CSS |
| Backend | Node.js / Express.js |
| Database | MongoDB / PostgreSQL |
| API Communication | REST APIs |
| Real-Time Communication | WebSockets |
| Data Visualization | Recharts / Chart.js |
| Version Control | Git & GitHub |
| Development Environment | Visual Studio Code |

---

## 📂 Project Structure

The repository will follow a modular structure as development progresses.

```text
NexusFlow/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── services/
│       ├── hooks/
│       ├── assets/
│       └── styles/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── middleware/
│   ├── config/
│   └── utils/
│
├── docs/
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Install the following tools before starting development:

- Node.js
- npm
- Git
- Visual Studio Code
- MongoDB or PostgreSQL (depending on the selected database)

### 1. Clone the Repository

```bash
git clone https://github.com/Vsvardhan55/NexusFlow-IoT-Rule-Engine/tree/main
```

### 2. Navigate to the Project

```bash
cd NexusFlow
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Start the Frontend

```bash
npm run dev
```

### 5. Install Backend Dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 6. Start the Backend

```bash
npm run dev
```

**Note:** These commands represent the planned development setup. Update scripts and environment configuration according to the actual implementation.

---

## 🔄 Development Workflow

The project will be developed through the following phases:

| Phase | Activities |
|---|---|
| Phase 1 | Requirement analysis and project setup |
| Phase 2 | UI/UX design and dashboard development |
| Phase 3 | Backend API and database integration |
| Phase 4 | Telemetry visualization and rule engine |
| Phase 5 | Testing, debugging, and integration |
| Phase 6 | Documentation and final demonstration |

---

## 👥 Team Collaboration

This project is maintained using Git and GitHub for collaborative development.

### Branching Strategy

Each team member will work on an individual development branch.

```text
main
│
├── sethu-vardhan
├── member-2
├── member-3
└── member-4
```

### Contribution Guidelines

1. Clone the central repository.
2. Switch to your assigned branch.
3. Work only on your assigned modules.
4. Commit meaningful changes regularly.
5. Push your changes to your respective GitHub branch.
6. Create a Pull Request when your module is ready.
7. Review and merge approved changes into the main branch.

**Important:** Avoid committing directly to the `main` branch.

---

## 🧪 Testing and Quality Assurance

The application will undergo testing to ensure reliability and functionality.

Testing activities include:

- Frontend component testing.
- Backend API testing.
- Database integration testing.
- Telemetry data validation.
- Rule engine condition testing.
- Responsive UI testing.
- Application performance testing.

---

## 🎓 Internship Information

| Particular | Details |
|---|---|
| Organization | Infotact Solutions |
| Intern Name | Sethu Vardhan Valluri |
| Internship Role | Associate L1 Intern |
| Internship Domain | Web Development |
| Internship Duration | 3 Months |
| Project Name | NexusFlow: Visual IoT Telemetry & Rule Engine |
| Project Completion Duration | 1 Month |
| Project Start Date | 10 November 2026 |
| Project End Date | 10 December 2026 |

---

## 📦 Project Deliverables

The expected project deliverables include:

- Complete application source code.
- Functional web application.
- Project documentation.
- Project report.
- Project presentation (PPT).
- Testing and evaluation results, where applicable.
- Final project demonstration.

---

## 🚀 Future Enhancements

Potential future improvements include:

- MQTT-based IoT device communication.
- Advanced telemetry analytics.
- Customizable dashboard widgets.
- Predictive analytics for sensor data.
- Advanced event-processing capabilities.
- Role-based access control.
- Cloud-based IoT device integration.
- Automated reporting and data exports.

---

## 📜 License

This project is developed as part of the Infotact Solutions internship program.

All project materials are intended for educational and internship purposes. Refer to the organization's policies before redistributing project materials.

---

## 🙌 Acknowledgement

We sincerely thank **Infotact Solutions** for providing this opportunity to gain practical experience in Web Development and collaborative software engineering.

This project represents our effort to apply technical knowledge, strengthen development skills, and build a practical IoT monitoring solution.

---

**NexusFlow – Connecting Devices, Visualizing Intelligence, Automating Actions.**

Developed as part of the Infotact Solutions Internship Program | November–December 2026.

## 📡 Live Telemetry Dashboard Integration

The dashboard subscribes to the backend Socket.IO server and displays real telemetry instead of fixed sample values.

- `telemetry:batch` updates the incoming-reading counter.
- `telemetry:average` updates the rolling-average metric, chart, sensor node, and processing node.
- `alert:new` updates the recent-alert counter.
- Initial event and alert totals are loaded from `GET /api/telemetry/stats` and `GET /api/alerts`.

The frontend loads the Socket.IO browser client from the backend's `/socket.io/socket.io.js` endpoint, so no separate Socket.IO client dependency is required in the frontend package.

For a non-default backend URL, create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000
```

Start MongoDB, then start the backend and frontend in separate terminals. Send telemetry to `POST http://localhost:5000/api/telemetry` to populate the live dashboard. Example request body:

```json
{
  "deviceId": "sensor-01",
  "metric": "vibration",
  "value": 42.8,
  "unit": "mm/s"
}
```

The moving-average chart remains empty until the backend emits actual telemetry averages; it no longer displays hard-coded sample readings.
>>>>>>> 312bc04 (Complete November 20-21 telemetry and workflow monitoring)

NexusFlow aims to simplify IoT monitoring and rule-based automation through real-time data processing and visual workflow configuration.

<<<<<<< HEAD
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
=======
## Dynamic workflow execution (latest)

The Rule Builder now compiles and saves workflows to MongoDB. Use **Run workflow** to activate the saved workflow for live telemetry. Active sensor → moving-average → alert plans execute on matching readings; each execution is stored and broadcast to the UI. Alert nodes currently produce in-app alerts only (no real SMS or webhook provider is configured). See `backend/README.md` for API routes and the telemetry payload example.

## Authentication (Login & Registration)

The application now includes email/password registration and login backed by MongoDB. Passwords are stored as salted scrypt hashes; the API issues signed HS256 access tokens that expire after seven days. Dashboard APIs (rules, alerts, workflows, and telemetry reads) require a Bearer token. The telemetry ingestion endpoint (`POST /api/telemetry`) remains available to device publishers, while Socket.IO dashboard connections require the same access token.

### Configure authentication

1. Copy `backend/.env.example` to `backend/.env`.
2. Set `MONGODB_URI` and `MONGODB_DB` as usual.
3. Replace `JWT_SECRET` with a unique random secret of at least 32 characters. Generate one with:

   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

4. Start the backend and frontend. New users can choose **Create account** on the login screen; existing users can sign in.

The browser stores the access token in local storage and sends it as a Bearer token. Signing out clears the local session. For production deployment, use HTTPS and consider moving access tokens to secure, HttpOnly cookies with CSRF protection. The current authentication establishes individual accounts, but project/workflow records are still in a shared workspace collection; per-user data isolation is a separate follow-up task.

## Authentication troubleshooting

The authentication endpoints are served by the **backend** process. If the frontend reports `POST /api/auth/register 404`, it is usually connected to an older backend process or a backend started from a different project folder.

1. Stop any running backend terminal with `Ctrl+C`.
2. Open a new terminal in this extracted project's `backend` directory (the directory containing `package.json`).
3. Run `npm install`, then `npm run dev`.
4. Confirm the backend terminal prints the authentication diagnostic URL.
5. Open `http://localhost:5000/api/auth/health`. It should return JSON with `"status":"available"` and list the register/login endpoints.
6. Keep that backend terminal running, then start the frontend in a separate terminal with `npm run dev` from `frontend`.

If the health URL itself returns 404, port 5000 is still serving a different/older backend. Stop that process before retrying. On Windows, you can identify the process using `netstat -ano | findstr :5000` and stop the matching PID with `taskkill /PID <PID> /F`.

The login and registration password field includes an eye button to show or hide the password. This only changes visibility in the form; passwords are still sent over the API request and stored as password hashes by the backend.


## Work update — 17 November 2026

- Added explicit `metricName` and `deviceId` properties to the default and newly created Sensor nodes.
- Updated frontend ESLint configuration with `eslint-plugin-react` and the JSX variable-usage rule.
- Local verification: frontend lint and production build passed. Vite still reports a non-fatal large-chunk advisory; see `TODAYS_WORK_17_NOV_2026.md`.

## Workspace navigation (26 November 2026)

The authenticated workspace sidebar now opens functional pages for Overview, Rule Builder, Devices, Telemetry, Alerts, Data sources, and Settings. The data views call the existing authenticated API routes and include refresh, loading, empty, and error states. Device and data-source discovery is based on telemetry already received by the ingestion endpoint; this version does not add a separate device-registration service.

See `TODAYS_WORK_26_NOV_2026.md` for the implementation log and validation status.
>>>>>>> 312bc04 (Complete November 20-21 telemetry and workflow monitoring)
