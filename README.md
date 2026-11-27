# NexusFlow: Visual IoT Telemetry & Rule Engine

**A Visual Platform for Real-Time IoT Monitoring, Telemetry Analytics, and Intelligent Rule-Based Automation.**

![Project](https://img.shields.io/badge/Project-NexusFlow-blue)
![Domain](https://img.shields.io/badge/Domain-Web%20Development-green)
![Internship](https://img.shields.io/badge/Internship-Infotact%20Solutions-orange)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

---

## 📌 Project Overview

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


## Latest development log

See [`TODAYS_WORK_27_NOV_2026.md`](./TODAYS_WORK_27_NOV_2026.md) for the 27 November telemetry pipeline reliability and observability increment.
