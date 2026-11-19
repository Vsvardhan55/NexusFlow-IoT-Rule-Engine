import { useCallback, useEffect, useState } from 'react'
import {
  ReactFlow, Background, Controls, MiniMap, Handle, Position,
  addEdge, useNodesState, useEdgesState, MarkerType
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  Activity, Bell, ChevronDown, CircleHelp, Cloud, Code2, Cpu, Database,
  Gauge, GitBranch, LayoutDashboard, Play, Plus, Radio, Save,
  Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles,
  Zap, Clock3, CheckCircle2, X, Trash2, LogOut, Mail, LockKeyhole, UserRound, Eye, EyeOff
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import './App.css'

const initialNodes = [
  {
    id: 'sensor-1', type: 'sensorNode', position: { x: 80, y: 150 },
    data: { label: 'Turbine Sensor', subtitle: 'Vibration · sensor-01', metric: '42.8', metricName: 'vibration', deviceId: 'sensor-01', unit: 'mm/s', status: 'Connected' }
  },
  {
    id: 'filter-1', type: 'filterNode', position: { x: 390, y: 150 },
    data: { label: 'Moving Average', subtitle: 'Signal processing', window: '10 samples' }
  },
  {
    id: 'alert-1', type: 'alertNode', position: { x: 710, y: 150 },
    data: { label: 'In-app Alert', subtitle: 'Action trigger', condition: 'Value > 50 mm/s' }
  },
]
const initialEdges = [
  { id: 'e1-2', source: 'sensor-1', target: 'filter-1', animated: true, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#7c8cff', strokeWidth: 2 } },
  { id: 'e2-3', source: 'filter-1', target: 'alert-1', animated: true, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#7c8cff', strokeWidth: 2 } },
]
function NodeShell({ children, kind, icon: Icon, title, subtitle, selected }) {
  return <div className={`flow-node ${kind} ${selected ? 'selected' : ''}`}>
    <Handle type="target" position={Position.Left} />
    <div className="node-heading">
      <span className="node-icon"><Icon size={16} /></span>
      <span className="node-kind">{title}</span>
      <span className="node-menu">•••</span>
    </div>
    <div className="node-title">{children}</div>
    <div className="node-subtitle">{subtitle}</div>
    <Handle type="source" position={Position.Right} />
  </div>
}
function SensorNode({ data, selected }) {
  return <NodeShell kind="sensor" icon={Radio} title="DATA SOURCE" subtitle={data.subtitle} selected={selected}>
    <div className="node-main-row"><strong>{data.label}</strong><span className="live-dot" /></div>
    <div className="node-metric">{data.metric}<small>{data.unit}</small></div>
    <div className="node-foot"><span><span className="tiny-dot" /> {data.status}</span><span>Live feed</span></div>
  </NodeShell>
}
function FilterNode({ data, selected }) {
  return <NodeShell kind="filter" icon={SlidersHorizontal} title="PROCESSING" subtitle={data.subtitle} selected={selected}>
    <strong>{data.label}</strong>
    <div className="node-config"><span>Window size</span><b>{data.window}</b></div>
    <div className="node-foot"><span>Moving average</span><span>{Number.isFinite(data.latestAverage) ? data.latestAverage.toFixed(2) : 'Waiting'}</span></div>
  </NodeShell>
}
function AlertNode({ data, selected }) {
  return <NodeShell kind="alert" icon={Bell} title="ACTION" subtitle={data.subtitle} selected={selected}>
    <strong>{data.label}</strong>
    <div className="node-config"><span>Trigger when</span><b>{data.condition}</b></div>
    <div className="node-foot"><span>In-app notification</span><span className="enabled-pill">Enabled</span></div>
  </NodeShell>
}
const nodeTypes = { sensorNode: SensorNode, filterNode: FilterNode, alertNode: AlertNode }

function toExecutionRecord(execution) {
  return {
    id: String(execution._id || execution.id || `${execution.workflowId}-${execution.startedAt}`),
    workflowName: execution.workflowName || 'Workflow',
    startedAt: execution.startedAt,
    status: execution.status === 'triggered' ? 'Triggered' : 'Completed',
    triggeredCount: (execution.triggeredAlerts || []).length,
    durationMs: Math.max(0, new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()),
    steps: (execution.nodeResults || []).map((step) => ({
      nodeId: step.nodeId,
      status: step.status === 'triggered' ? 'Triggered' : step.status === 'skipped' ? 'Skipped' : 'Completed',
      detail: step.detail,
      value: step.value,
    })),
  }
}

async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('nexusflow-token')
  const headers = { ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  return fetch(url, { ...options, headers })
}

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault(); setError(''); setBusy(true)
    try {
      const apiBase = (localStorage.getItem('nexusflow-api-url') || import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')
      let response
      try {
        response = await apiFetch(`${apiBase}/api/auth/${mode === 'login' ? 'login' : 'register'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
      } catch {
        throw new Error('Cannot reach the NexusFlow API. Start the backend from the project’s backend folder with npm run dev.')
      }
      const result = await response.json().catch(() => ({}))
      if (response.status === 404) throw new Error('Authentication endpoint not found. Your backend is likely an older version or running from a different project folder. Stop it and restart the backend from this updated project.')
      if (response.status === 409 && mode === 'register') throw new Error('An account with this email already exists. Switch to Sign in and use the same email and password.')
      if (!response.ok || !result.success) throw new Error(result.message || `Unable to ${mode === 'login' ? 'sign in' : 'register'} (HTTP ${response.status}).`)
      localStorage.setItem('nexusflow-token', result.data.token)
      localStorage.setItem('nexusflow-user', JSON.stringify(result.data.user))
      onAuthenticated(result.data.user)
    } catch (err) { setError(err.message || 'Unable to connect to the server.') }
    finally { setBusy(false) }
  }
  return <div className="auth-screen"><div className="auth-card"><div className="auth-brand"><span className="brand-mark"><Zap size={20}/></span><div><b>NexusFlow</b><small>VISUAL IOT PLATFORM</small></div></div><div className="auth-intro"><div className="eyebrow"><span className="eyebrow-dot"/> SECURE WORKSPACE</div><h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1><p>{mode === 'login' ? 'Sign in to continue building and monitoring your IoT workflows.' : 'Get started with your personal NexusFlow workspace.'}</p></div><form onSubmit={submit}>{mode === 'register' && <label className="auth-field"><span>Full name</span><div><UserRound size={17}/><input autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required minLength={2}/></div></label>}<label className="auth-field"><span>Email address</span><div><Mail size={17}/><input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></div></label><label className="auth-field"><span>Password</span><div><LockKeyhole size={17}/><input type={showPassword ? "text" : "password"} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" required minLength={8}/><button className="password-toggle" type="button" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>{error && <div className="auth-error" role="alert">{error}</div>}<button className="auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in to NexusFlow' : 'Create account'}</button></form><div className="auth-switch">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'} <button onClick={()=>{setMode(mode === 'login' ? 'register' : 'login');setError('')}}>{mode === 'login' ? 'Create account' : 'Sign in'}</button></div><div className="auth-security"><ShieldCheck size={15}/> Your workspace is protected with secure authentication.</div></div></div>
}


// Main application navigation. This component was referenced by App but was
// missing from the previous archive, which caused the runtime ReferenceError.
function Sidebar({ alertCount = 0, user = null, currentPage = 'Rule Builder', onNavigate = () => {} }) {
  const primaryItems = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Rule Builder', icon: GitBranch },
    { label: 'Devices', icon: Radio },
    { label: 'Telemetry', icon: Activity },
    { label: 'Alerts', icon: Bell, count: alertCount },
  ]
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark"><Zap size={19} /></div><div><b>NexusFlow</b><small>VISUAL IOT PLATFORM</small></div></div>
    <div className="workspace-label">WORKSPACE <ChevronDown size={12} /></div>
    <div className="workspace-card"><div className="workspace-avatar">N</div><div><b>NexusFlow Project</b><small>Personal workspace</small></div><ChevronDown size={14} /></div>
    <div className="nav-section">BUILD & MONITOR</div>
    <nav className="side-nav" aria-label="Main navigation">
      {primaryItems.map(({ label, icon: Icon, count }) => <button type="button" key={label} className={currentPage === label ? 'active' : ''} aria-current={currentPage === label ? 'page' : undefined} onClick={() => onNavigate(label)}>
        <Icon size={16} /><span>{label}</span>{count > 0 && <span className="alert-count">{count > 99 ? '99+' : count}</span>}
      </button>)}
    </nav>
    <div className="nav-section lower">CONFIGURATION</div>
    <nav className="side-nav" aria-label="Configuration">
      <button type="button" className={currentPage === 'Data sources' ? 'active' : ''} onClick={() => onNavigate('Data sources')}><Database size={16} /><span>Data sources</span></button>
      <button type="button" className={currentPage === 'Settings' ? 'active' : ''} onClick={() => onNavigate('Settings')}><Settings2 size={16} /><span>Settings</span></button>
    </nav>
    <div className="sidebar-bottom">
      <div className="usage-card"><div className="usage-title"><span>Workspace usage</span><b>68%</b></div><div className="usage-track"><span /></div><small>Telemetry capacity used</small></div>
      <div className="profile"><div className="profile-avatar">SV</div><div><b>{user?.name || 'Workspace member'}</b><small>{user?.email || 'Developer'}</small></div><Settings2 size={15} /></div>
    </div>
  </aside>
}

function ExecutionDetails({ record }) {
  return <div className="execution-steps">
    {(record.steps || []).map((step, index) => <div className="execution-step" key={`${step.nodeId}-${index}`}>
      <span className={`step-indicator ${String(step.status).toLowerCase()}`} />
      <div><b>{step.nodeId}</b><small>{step.detail || step.status}</small></div>
      <span>{step.value == null ? '—' : Number(step.value).toFixed(2)}</span>
    </div>)}
  </div>
}

function WorkspacePage({ page, user, socketStatus, incomingEvents, recentAlerts, executionMetrics, onToast }) {
  const [devices, setDevices] = useState([])
  const [readings, setReadings] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deviceFilter, setDeviceFilter] = useState('')
  const [metricFilter, setMetricFilter] = useState('')
  const [sampleDevice, setSampleDevice] = useState('sensor-demo-01')
  const [sampleMetric, setSampleMetric] = useState('temperature')
  const [sampleValue, setSampleValue] = useState('24.5')
  const [sampleUnit, setSampleUnit] = useState('°C')
  const [apiBase, setApiBase] = useState(() => localStorage.getItem('nexusflow-api-url') || import.meta.env.VITE_API_URL || 'http://localhost:5000')
  const [savedMessage, setSavedMessage] = useState('')

  const loadDevices = async () => {
    const response = await apiFetch(`${apiBase.replace(/\/$/, '')}/api/telemetry/devices`)
    const result = await response.json()
    if (!response.ok || !result.success) throw new Error(result.message || 'Could not load devices')
    setDevices(result.data || [])
  }
  const loadReadings = async () => {
    const params = new URLSearchParams({ limit: '100' })
    if (deviceFilter) params.set('deviceId', deviceFilter)
    if (metricFilter) params.set('metric', metricFilter)
    const response = await apiFetch(`${apiBase.replace(/\/$/, '')}/api/telemetry/history?${params}`)
    const result = await response.json()
    if (!response.ok || !result.success) throw new Error(result.message || 'Could not load telemetry history')
    setReadings(result.data || [])
  }
  const loadAlerts = async () => {
    const response = await apiFetch(`${apiBase.replace(/\/$/, '')}/api/alerts?limit=100`)
    const result = await response.json()
    if (!response.ok || !result.success) throw new Error(result.message || 'Could not load alerts')
    setAlerts(result.data || [])
  }
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true); setError('')
      try {
        if (page === 'Overview' || page === 'Devices' || page === 'Data sources') await loadDevices()
        if (page === 'Telemetry') { await loadDevices(); await loadReadings() }
        if (page === 'Alerts') await loadAlerts()
      } catch (err) { if (!cancelled) setError(err.message || 'Unable to load page data') }
      finally { if (!cancelled) setLoading(false) }
    }
    load()
    return () => { cancelled = true }
    // page and filter changes intentionally trigger data refreshes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, deviceFilter, metricFilter, apiBase])

  const sendSample = async (event) => {
    event.preventDefault(); setSavedMessage('')
    try {
      const response = await fetch(`${apiBase.replace(/\/$/, '')}/api/telemetry`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deviceId: sampleDevice, metric: sampleMetric, value: Number(sampleValue), unit: sampleUnit }) })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message || 'Could not send sample')
      setSavedMessage(`Successfully ingested ${result.insertedCount || 1} reading. Refresh telemetry to view it.`)
      onToast('Sample telemetry sent')
      if (page === 'Devices') await loadDevices()
    } catch (err) { setError(err.message || 'Unable to send sample') }
  }
  const saveSettings = (event) => {
    event.preventDefault()
    const normalized = apiBase.trim().replace(/\/$/, '')
    if (!/^https?:\/\//i.test(normalized)) { setError('API URL must start with http:// or https://'); return }
    localStorage.setItem('nexusflow-api-url', normalized)
    setApiBase(normalized); setError(''); setSavedMessage('API endpoint saved in this browser. Reload the app to apply it everywhere.')
  }
  const titleMap = {
    Overview: ['Workspace overview', 'A live snapshot of your IoT workspace.'],
    Devices: ['Connected devices', 'Discover devices that have submitted telemetry.'],
    Telemetry: ['Telemetry explorer', 'Inspect historical sensor readings stored in MongoDB.'],
    Alerts: ['Alert center', 'Review alert events generated by your workflows.'],
    'Data sources': ['Data sources', 'Connect devices by publishing readings to the telemetry ingestion API.'],
    Settings: ['Workspace settings', 'Manage your local workspace connection and account details.'],
  }
  const [title, description] = titleMap[page] || titleMap.Overview
  const formatDate = (value) => value ? new Date(value).toLocaleString() : '—'
  return <div className="workspace-page">
    <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> NEXUSFLOW WORKSPACE</div><h1>{title}</h1><p>{description}</p></div><button className="secondary-button" onClick={() => { setError(''); if (page === 'Alerts') loadAlerts().catch(e=>setError(e.message)); else if (page === 'Telemetry') loadReadings().catch(e=>setError(e.message)); else loadDevices().catch(e=>setError(e.message)) }}>Refresh data</button></div>
    {error && <div className="workspace-error" role="alert">{error}</div>}
    {savedMessage && <div className="workspace-success" role="status">{savedMessage}</div>}
    {loading && <div className="workspace-loading">Loading workspace data…</div>}
    {page === 'Overview' && <>
      <div className="metric-grid workspace-metrics">
        <div className="metric-card"><div className="metric-top"><span>Registered devices</span><span className="metric-icon blue"><Radio size={16}/></span></div><div className="metric-value">{devices.length}</div><p>Devices with stored readings</p></div>
        <div className="metric-card"><div className="metric-top"><span>Telemetry readings</span><span className="metric-icon purple"><Activity size={16}/></span></div><div className="metric-value">{incomingEvents.toLocaleString()}</div><p>Total readings reported by API</p></div>
        <div className="metric-card"><div className="metric-top"><span>Recent alerts</span><span className="metric-icon orange"><Bell size={16}/></span></div><div className="metric-value">{recentAlerts.toLocaleString()}</div><p>Alert records currently loaded</p></div>
        <div className="metric-card"><div className="metric-top"><span>Workflow executions</span><span className="metric-icon green"><GitBranch size={16}/></span></div><div className="metric-value">{executionMetrics.totalExecutions.toLocaleString()}</div><p>{executionMetrics.triggeredExecutions.toLocaleString()} triggered</p></div>
      </div>
      <div className="workspace-card-panel"><div className="workspace-panel-heading"><div><h3>Devices recently seen</h3><p>Latest devices reporting into NexusFlow</p></div></div><DeviceTable devices={devices.slice(0,8)} /></div>
      <div className="workspace-card-panel"><div className="workspace-panel-heading"><div><h3>Platform connection</h3><p>Real-time event channel status</p></div><span className={`connection-pill ${socketStatus === 'connected' ? 'online' : ''}`}>{socketStatus}</span></div></div>
    </>}
    {page === 'Devices' && <div className="workspace-card-panel"><div className="workspace-panel-heading"><div><h3>Device registry</h3><p>{devices.length} device(s) discovered from telemetry records</p></div></div><DeviceTable devices={devices}/></div>}
    {page === 'Telemetry' && <div className="workspace-card-panel"><div className="workspace-panel-heading"><div><h3>Historical readings</h3><p>Latest 100 readings, newest first</p></div><div className="workspace-filters"><select value={deviceFilter} onChange={e=>setDeviceFilter(e.target.value)}><option value="">All devices</option>{devices.map(d=><option key={d.deviceId} value={d.deviceId}>{d.deviceId}</option>)}</select><input value={metricFilter} onChange={e=>setMetricFilter(e.target.value)} placeholder="Filter metric" /></div></div><div className="workspace-table-wrap"><table className="workspace-table"><thead><tr><th>Timestamp</th><th>Device</th><th>Metric</th><th>Value</th><th>Unit</th></tr></thead><tbody>{readings.map((r,i)=><tr key={r._id || `${r.timestamp}-${i}`}><td>{formatDate(r.timestamp)}</td><td>{r.metadata?.deviceId || '—'}</td><td>{r.metadata?.metric || '—'}</td><td>{r.value}</td><td>{r.unit || '—'}</td></tr>)}</tbody></table>{!readings.length && <div className="workspace-empty">No readings found. Try another filter or send a sample from Data sources.</div>}</div></div>}
    {page === 'Alerts' && <div className="workspace-card-panel"><div className="workspace-panel-heading"><div><h3>Recent alert events</h3><p>{alerts.length} alert record(s) returned by the API</p></div></div>{alerts.length ? <div className="workspace-list">{alerts.map((alert,i)=><article className="workspace-alert" key={alert._id || i}><span className="alert-symbol"><Bell size={17}/></span><div><b>{alert.title || alert.message || alert.ruleName || 'Workflow alert'}</b><p>{alert.message || alert.description || alert.condition || 'An alert event was recorded.'}</p><small>{formatDate(alert.triggeredAt || alert.createdAt)} · {alert.deviceId || alert.metadata?.deviceId || 'Device not specified'}</small></div><span className="history-status warning">Alert</span></article>)}</div> : <div className="workspace-empty">No alerts have been recorded yet.</div>}</div>}
    {page === 'Data sources' && <>
      <div className="workspace-card-panel"><div className="workspace-panel-heading"><div><h3>Ingestion endpoint</h3><p>Send JSON readings to this endpoint. Device IDs appear in the registry after the first reading.</p></div><span className="connection-pill online">POST enabled</span></div><div className="endpoint-box"><code>{apiBase.replace(/\/$/, '')}/api/telemetry</code><span>Content-Type: application/json</span></div><pre className="sample-code">{`{\n  "deviceId": "sensor-demo-01",\n  "metric": "temperature",\n  "value": 24.5,\n  "unit": "°C"\n}`}</pre></div>
      <div className="workspace-card-panel"><div className="workspace-panel-heading"><div><h3>Send a test reading</h3><p>Publish a sample telemetry event to verify ingestion.</p></div></div><form className="workspace-form" onSubmit={sendSample}><label>Device ID<input required value={sampleDevice} onChange={e=>setSampleDevice(e.target.value)} /></label><label>Metric<input required value={sampleMetric} onChange={e=>setSampleMetric(e.target.value)} /></label><label>Value<input required type="number" step="any" value={sampleValue} onChange={e=>setSampleValue(e.target.value)} /></label><label>Unit<input value={sampleUnit} onChange={e=>setSampleUnit(e.target.value)} /></label><button className="primary-button" type="submit">Send test telemetry</button></form></div>
      <div className="workspace-card-panel"><div className="workspace-panel-heading"><div><h3>Discovered devices</h3><p>Devices that have sent at least one reading</p></div></div><DeviceTable devices={devices}/></div>
    </>}
    {page === 'Settings' && <>
      <div className="workspace-card-panel"><div className="workspace-panel-heading"><div><h3>API connection</h3><p>Configure the backend URL used by this workspace.</p></div></div><form className="workspace-form settings-form" onSubmit={saveSettings}><label>Backend API base URL<input type="url" required value={apiBase} onChange={e=>setApiBase(e.target.value)} placeholder="http://localhost:5000" /></label><button className="primary-button" type="submit">Save API settings</button></form><p className="workspace-note">Current frontend default: {localStorage.getItem('nexusflow-api-url') || import.meta.env.VITE_API_URL || 'http://localhost:5000'}</p></div>
      <div className="workspace-card-panel"><div className="workspace-panel-heading"><div><h3>Signed-in account</h3><p>Current authenticated workspace user</p></div></div><div className="account-details"><div><small>Name</small><b>{user?.name || 'Workspace member'}</b></div><div><small>Email</small><b>{user?.email || 'Not available'}</b></div><div><small>Session</small><b>Authenticated</b></div></div></div>
    </>}
  </div>
}

function DeviceTable({ devices }) {
  return <div className="workspace-table-wrap"><table className="workspace-table"><thead><tr><th>Device ID</th><th>Metrics</th><th>Readings</th><th>Last seen</th><th>Status</th></tr></thead><tbody>{devices.map((device)=><tr key={device.deviceId}><td><b>{device.deviceId}</b></td><td>{(device.metrics || []).join(', ') || '—'}</td><td>{(device.readingCount || 0).toLocaleString()}</td><td>{device.latestSeen ? new Date(device.latestSeen).toLocaleString() : '—'}</td><td><span className="connection-pill online">Seen</span></td></tr>)}</tbody></table>{!devices.length && <div className="workspace-empty">No devices discovered yet. Publish a reading from Data sources to register a device.</div>}</div>
}

function App() {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('nexusflow-token') || '')
  const [currentUser, setCurrentUser] = useState(() => { try { return JSON.parse(localStorage.getItem('nexusflow-user') || 'null') } catch { return null } })
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [activeTab, setActiveTab] = useState('Builder')
  const [currentPage, setCurrentPage] = useState('Rule Builder')
  const [selectedNode, setSelectedNode] = useState(null)
  const [running, setRunning] = useState(false)
  const [deployedWorkflowId, setDeployedWorkflowId] = useState('')
  const [executionHistory, setExecutionHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexusflow-execution-history') || '[]') }
    catch { return [] }
  })
  const [toast, setToast] = useState('')
  const [workflowName, setWorkflowName] = useState('Turbine Vibration Monitor')
  const [showInspector, setShowInspector] = useState(true)
  const [socketStatus, setSocketStatus] = useState('connecting')
  const [incomingEvents, setIncomingEvents] = useState(0)
  const [recentAlerts, setRecentAlerts] = useState(0)
  const [averageHistory, setAverageHistory] = useState([])
  const [latestAverage, setLatestAverage] = useState(null)
  const [telemetryDevices, setTelemetryDevices] = useState([])
  const [selectedDeviceFilter, setSelectedDeviceFilter] = useState('')
  const [executionMetrics, setExecutionMetrics] = useState({ totalExecutions: 0, triggeredExecutions: 0 })

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({
    ...params, type: 'smoothstep', animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#7c8cff', strokeWidth: 2 }
  }, eds)), [setEdges])

  const addNode = (type) => {
    const config = {
      sensorNode: { label: 'New Sensor', subtitle: 'Telemetry · sensor-new', metric: '0.0', metricName: 'vibration', deviceId: 'sensor-new', unit: 'units', status: 'Waiting' },
      filterNode: { label: 'Threshold Filter', subtitle: 'Signal processing', window: '5 samples' },
      alertNode: { label: 'Webhook Action', subtitle: 'Action trigger', condition: 'Value > 100' },
    }
    const id = `${type}-${Date.now()}`
    setNodes((nds) => [...nds, { id, type, position: { x: 120 + nds.length * 35, y: 330 + (nds.length % 3) * 35 }, data: config[type] }])
    setToast('Node added to canvas')
    setTimeout(() => setToast(''), 2200)
  }

  const saveWorkflow = () => {
    localStorage.setItem('nexusflow-workflow', JSON.stringify({ name: workflowName, nodes, edges }))
    setToast('Workflow saved in this browser')
    setTimeout(() => setToast(''), 2500)
  }

  const compileWorkflow = async () => {
    try {
      const apiBase = localStorage.getItem('nexusflow-api-url') || import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await apiFetch(`${apiBase}/api/workflows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: workflowName, nodes, edges }),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message || 'Workflow compilation failed.')
      setDeployedWorkflowId(result.data._id)
      localStorage.setItem('nexusflow-compiled-plan', JSON.stringify(result.data.compiled))
      setToast(`Compiled and saved: ${result.data.compiled.nodeCount} nodes · Ready to activate`)
    } catch (error) {
      setToast(error.message || 'Could not reach the compiler API. Is the backend running?')
    }
    window.setTimeout(() => setToast(''), 3500)
  }
  const runWorkflow = async () => {
    const apiBase = localStorage.getItem('nexusflow-api-url') || import.meta.env.VITE_API_URL || 'http://localhost:5000'
    try {
      if (running) {
        if (deployedWorkflowId) {
          const response = await apiFetch(`${apiBase}/api/workflows/${deployedWorkflowId}/deactivate`, { method: 'POST' })
          const result = await response.json()
          if (!response.ok || !result.success) throw new Error(result.message || 'Could not deactivate workflow.')
        }
        setRunning(false)
        setToast('Live workflow deactivated')
      } else {
        if (!deployedWorkflowId) {
          setToast('Compile the workflow first to save it to the backend')
          return
        }
        const response = await apiFetch(`${apiBase}/api/workflows/${deployedWorkflowId}/activate`, { method: 'POST' })
        const result = await response.json()
        if (!response.ok || !result.success) throw new Error(result.message || 'Could not activate workflow.')
        setRunning(true)
        setToast('Workflow is active and processing live telemetry')
      }
    } catch (error) {
      setToast(error.message || 'Workflow action failed. Check the backend connection.')
    }
    window.setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    if (!authToken) return undefined
    const apiBase = localStorage.getItem('nexusflow-api-url') || import.meta.env.VITE_API_URL || 'http://localhost:5000'
    let disposed = false
    let socket
    let script
    apiFetch(`${apiBase}/api/workflows/executions/recent?limit=50`)
      .then((response) => { if (!response.ok) throw new Error('Unable to load execution history'); return response.json() })
      .then((result) => {
        if (disposed || !result.success) return
        const records = (result.data || []).map(toExecutionRecord)
        setExecutionHistory((current) => {
          const byId = new Map(records.map((record) => [record.id, record]))
          current.forEach((record) => { if (!byId.has(record.id)) byId.set(record.id, record) })
          const merged = [...byId.values()].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt)).slice(0, 50)
          localStorage.setItem('nexusflow-execution-history', JSON.stringify(merged))
          return merged
        })
      })
      .catch(() => {})
    apiFetch(`${apiBase}/api/workflows/executions/summary`)
      .then((response) => response.json())
      .then((result) => { if (!disposed && result.success) setExecutionMetrics(result.data) })
      .catch(() => {})
    const attach = () => {
      if (disposed || typeof window.io !== 'function') return
      socket = window.io(apiBase, { auth: { token: authToken }, transports: ['websocket', 'polling'], reconnection: true })
      socket.on('workflow:execution', (execution) => {
        if (disposed) return
        const record = toExecutionRecord(execution)
        setExecutionHistory((current) => {
          const updated = [record, ...current.filter((item) => item.id !== record.id)].slice(0, 50)
          localStorage.setItem('nexusflow-execution-history', JSON.stringify(updated))
          return updated
        })
        setExecutionMetrics((current) => ({
          totalExecutions: current.totalExecutions + 1,
          triggeredExecutions: current.triggeredExecutions + (execution.status === 'triggered' ? 1 : 0),
        }))
      })
    }
    if (typeof window.io === 'function') attach()
    else {
      script = document.createElement('script')
      script.src = `${apiBase}/socket.io/socket.io.js`
      script.async = true
      script.onload = attach
      document.head.appendChild(script)
    }
    return () => { disposed = true; if (socket) socket.disconnect(); if (script?.parentNode) script.parentNode.removeChild(script) }
  }, [authToken])

  const onNodeClick = (_, node) => { setSelectedNode(node); setShowInspector(true) }

  // Keep the selected-node snapshot and React Flow graph in sync while editing.
  const updateSelectedNode = (patch) => {
    if (!selectedNode) return
    setNodes((current) => current.map((node) => node.id === selectedNode.id
      ? { ...node, data: { ...node.data, ...patch } }
      : node))
    setSelectedNode((current) => current ? { ...current, data: { ...current.data, ...patch } } : current)
  }

  // Connect the dashboard to the backend's real Socket.IO telemetry stream.
  useEffect(() => {
    if (!authToken) return undefined
    const apiBase = localStorage.getItem('nexusflow-api-url') || import.meta.env.VITE_API_URL || 'http://localhost:5000'
    let socket
    let script
    let disposed = false

    apiFetch(`${apiBase}/api/telemetry/stats`)
      .then((response) => { if (!response.ok) throw new Error('Unable to load telemetry stats'); return response.json() })
      .then((result) => { if (!disposed && result.success) setIncomingEvents((count) => Math.max(count, result.data.totalReadings || 0)) })
      .catch(() => { if (!disposed) setSocketStatus('disconnected') })
    apiFetch(`${apiBase}/api/telemetry/devices`)
      .then((response) => { if (!response.ok) throw new Error('Unable to load devices'); return response.json() })
      .then((result) => { if (!disposed && result.success) setTelemetryDevices(result.data || []) })
      .catch(() => {})

    apiFetch(`${apiBase}/api/alerts?limit=200`)
      .then((response) => response.json())
      .then((result) => { if (!disposed && result.success) setRecentAlerts((count) => Math.max(count, result.count || 0)) })
      .catch(() => {})

    const connectSocket = () => {
      if (disposed || typeof window.io !== 'function') return
      socket = window.io(apiBase, { auth: { token: authToken }, transports: ['websocket', 'polling'], reconnection: true })
      socket.on('connect', () => { if (!disposed) setSocketStatus('connected') })
      socket.on('disconnect', () => { if (!disposed) setSocketStatus('disconnected') })
      socket.on('connect_error', () => { if (!disposed) setSocketStatus('disconnected') })
      socket.on('telemetry:batch', (payload) => {
        if (disposed) return
        if (Number.isFinite(payload?.count)) setIncomingEvents((count) => count + payload.count)
        const incomingDevices = [...new Set((payload?.events || []).map((event) => event?.metadata?.deviceId).filter(Boolean))]
        if (incomingDevices.length) setTelemetryDevices((current) => {
          const known = new Set(current.map((device) => device.deviceId))
          return [...current, ...incomingDevices.filter((deviceId) => !known.has(deviceId)).map((deviceId) => ({ deviceId, metrics: [], readingCount: 0 }))]
        })
      })
      socket.on('telemetry:average', (result) => {
        if (disposed || !Number.isFinite(Number(result?.average))) return
        const point = {
          time: new Date(result.timestamp || result.calculatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          value: Number(result.average),
          rawValue: Number.isFinite(Number(result.rawValue)) ? Number(result.rawValue) : Number(result.average),
          deviceId: result.deviceId,
          metric: result.metric,
          unit: result.unit || '',
          sampleCount: result.sampleCount,
        }
        setLatestAverage(point)
        setAverageHistory((history) => [...history, point].slice(-100))
        setNodes((current) => current.map((node) => {
          if (node.type === 'sensorNode' && String(node.data.subtitle || '').includes(result.deviceId)) {
            return { ...node, data: { ...node.data, metric: point.value.toFixed(2), status: 'Connected' } }
          }
          if (node.type === 'filterNode') return { ...node, data: { ...node.data, latestAverage: point.value } }
          return node
        }))
      })
      socket.on('alert:new', () => { if (!disposed) setRecentAlerts((count) => count + 1) })
    }

    if (typeof window.io === 'function') {
      connectSocket()
    } else {
      script = document.createElement('script')
      script.src = `${apiBase}/socket.io/socket.io.js`
      script.async = true
      script.onload = connectSocket
      script.onerror = () => { if (!disposed) setSocketStatus('disconnected') }
      document.head.appendChild(script)
    }

    return () => {
      disposed = true
      if (socket) socket.disconnect()
      if (script?.parentNode) script.parentNode.removeChild(script)
    }
  }, [setNodes, authToken])

  if (!authToken) return <AuthScreen onAuthenticated={(user) => { setCurrentUser(user); setAuthToken(localStorage.getItem('nexusflow-token') || '') }} />

  const signOut = () => { localStorage.removeItem('nexusflow-token'); localStorage.removeItem('nexusflow-user'); setAuthToken(''); setCurrentUser(null) }
  const visibleAverageHistory = selectedDeviceFilter
    ? averageHistory.filter((point) => point.deviceId === selectedDeviceFilter)
    : averageHistory
  const visibleLatestAverage = visibleAverageHistory.at(-1) || (selectedDeviceFilter ? null : latestAverage)
  return <div className="app-shell">
    <Sidebar alertCount={recentAlerts} user={currentUser} currentPage={currentPage} onNavigate={(page) => { setCurrentPage(page); setSelectedNode(null) }} />
    <main className="main-area">
      <header className="topbar">
        <div className="breadcrumb">Projects <span>/</span> <b>{currentPage}</b></div>
        <div className="top-actions"><span className={`system-status ${socketStatus === 'connected' ? '' : 'system-status-offline'}`}><i /> {socketStatus === 'connected' ? 'Live telemetry connected' : socketStatus === 'connecting' ? 'Connecting telemetry…' : 'Telemetry disconnected'}</span><button className="icon-button"><CircleHelp size={18} /></button><button className="icon-button"><Bell size={18} /><i className="notification-dot" /></button><button className="top-avatar logout-button" title={`Sign out${currentUser?.name ? ` ${currentUser.name}` : ''}`} onClick={signOut}><LogOut size={15}/></button></div>
      </header>
      <section className="page-content">
        {currentPage === 'Rule Builder' ? <>
        <div className="page-heading">
          <div><div className="eyebrow"><span className="eyebrow-dot" /> VISUAL AUTOMATION</div><h1>Rule Builder</h1><p>Design, connect, and deploy intelligent IoT workflows.</p></div>
          <div className="heading-actions"><button className="secondary-button" onClick={saveWorkflow}><Save size={16} /> Save draft</button><button className="secondary-button" onClick={compileWorkflow}><Code2 size={16} /> Compile</button><button className={`primary-button ${running ? 'is-running' : ''}`} onClick={runWorkflow}>{running ? <><Activity size={16} /> Stop simulation</> : <><Play size={16} fill="currentColor" /> Run workflow</>}</button></div>
        </div>
        <div className="project-strip">
          <div className="project-title"><div className="project-icon"><Zap size={18} /></div><div><span>WORKFLOW NAME</span><input value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} /></div><span className="draft-tag">DRAFT</span></div>
          <div className="project-meta"><span><span className="tiny-dot green" /> {running ? 'Running' : 'Not deployed'}</span><span><Clock3 size={14} /> Edited just now</span><button onClick={() => setShowInspector(!showInspector)}><SlidersHorizontal size={15} /> Inspector</button></div>
        </div>
        <div className="builder-tabs"><div className="tabs-left">{['Builder', 'Live Preview', 'Execution History'].map(t => <button key={t} className={activeTab === t ? 'tab-active' : ''} onClick={() => setActiveTab(t)}>{t}</button>)}</div><div className="canvas-tools"><span className="canvas-hint"><span className="tiny-dot green" /> Autosave on</span><button className="icon-button"><Search size={16} /></button></div></div>
        {activeTab === 'Builder' ? <div className="builder-layout">
          <section className="canvas-panel">
            <div className="canvas-toolbar"><div><b>Workflow canvas</b><span>Drag nodes to arrange · Connect handles to build logic</span></div><div className="canvas-toolbar-right"><span className="zoom-label">100%</span><button className="small-tool" onClick={() => setNodes(initialNodes)}>Reset layout</button></div></div>
            <div className="flow-canvas">
              <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeClick={onNodeClick} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.25 }} minZoom={0.35} maxZoom={1.5}>
                <Background color="#dfe4f0" gap={22} size={1} />
                <Controls />
                <MiniMap nodeColor={(node) => node.type === 'sensorNode' ? '#5a9dff' : node.type === 'filterNode' ? '#9a83f5' : '#f2a34a'} maskColor="rgba(246,248,252,.72)" />
              </ReactFlow>
              <div className="canvas-legend"><span><i className="legend-source" /> Source</span><span><i className="legend-process" /> Processing</span><span><i className="legend-action" /> Action</span></div>
            </div>
            <div className="node-library"><div className="library-heading"><div><b><Plus size={16} /> Node library</b><span>Add components to your workflow</span></div><button className="text-button">Browse all <ChevronDown size={14} /></button></div>
              <div className="library-items">
                <button onClick={() => addNode('sensorNode')}><span className="lib-icon blue"><Radio size={17} /></span><span><b>Data source</b><small>Sensor input</small></span><Plus size={15} /></button>
                <button onClick={() => addNode('filterNode')}><span className="lib-icon purple"><SlidersHorizontal size={17} /></span><span><b>Math operation</b><small>Transform data</small></span><Plus size={15} /></button>
                <button onClick={() => addNode('alertNode')}><span className="lib-icon orange"><Bell size={17} /></span><span><b>Action trigger</b><small>Send notification</small></span><Plus size={15} /></button>
              </div>
            </div>
          </section>
          {showInspector && <aside className="inspector">
            <div className="inspector-header"><div><b>Inspector</b><small>Configure workflow</small></div><button className="icon-button" onClick={() => setShowInspector(false)}><X size={17} /></button></div>
            {selectedNode ? <div className="inspector-body">
              <div className="selected-type">{selectedNode.type === 'sensorNode' ? 'DATA SOURCE' : selectedNode.type === 'filterNode' ? 'PROCESSING COMPONENT' : 'ACTION COMPONENT'}</div>
              <h3>{selectedNode.data.label || 'Untitled node'}</h3>
              <p className="inspector-description">Configure this component. Changes are reflected on the canvas and included when you compile the workflow.</p>
              <label htmlFor="node-label">Node name</label>
              <input id="node-label" className="field-input" value={selectedNode.data.label || ''} maxLength={80} onChange={(event) => updateSelectedNode({ label: event.target.value })} />

              {selectedNode.type === 'sensorNode' && <>
                <label htmlFor="sensor-device">Device ID</label>
                <input id="sensor-device" className="field-input" value={selectedNode.data.deviceId || ''} maxLength={100} onChange={(event) => { const deviceId = event.target.value; updateSelectedNode({ deviceId, subtitle: `${selectedNode.data.metricName || 'vibration'} · ${deviceId || 'unassigned'}` }) }} />
                <label htmlFor="sensor-metric">Metric name</label>
                <input id="sensor-metric" className="field-input" value={selectedNode.data.metricName || ''} maxLength={80} onChange={(event) => { const metricName = event.target.value; updateSelectedNode({ metricName, subtitle: `${metricName || 'metric'} · ${selectedNode.data.deviceId || 'unassigned'}` }) }} />
                <label htmlFor="sensor-unit">Unit</label>
                <input id="sensor-unit" className="field-input" value={selectedNode.data.unit || ''} maxLength={24} onChange={(event) => updateSelectedNode({ unit: event.target.value })} />
                <label htmlFor="sensor-status">Device status</label>
                <select id="sensor-status" className="field-input" value={selectedNode.data.status || 'Waiting'} onChange={(event) => updateSelectedNode({ status: event.target.value })}><option>Connected</option><option>Waiting</option><option>Disconnected</option></select>
              </>}

              {selectedNode.type === 'filterNode' && <>
                <label htmlFor="filter-window">Moving average window (samples)</label>
                <input id="filter-window" className="field-input" type="number" min="1" max="10000" step="1" value={Number.parseInt(String(selectedNode.data.windowSize ?? selectedNode.data.window ?? '10').match(/\d+/)?.[0] || '10', 10)} onChange={(event) => { const windowSize = event.target.value; updateSelectedNode({ windowSize, window: `${windowSize || 1} samples`, subtitle: `Moving average · ${windowSize || 1} samples` }) }} />
                <label>Processing operation</label>
                <div className="read-only-field">Moving average</div>
              </>}

              {selectedNode.type === 'alertNode' && <>
                <label htmlFor="alert-condition">Alert condition</label>
                <input id="alert-condition" className="field-input" value={selectedNode.data.condition || ''} placeholder="Value > 50" maxLength={80} onChange={(event) => updateSelectedNode({ condition: event.target.value })} />
                <label htmlFor="alert-message">Alert message</label>
                <input id="alert-message" className="field-input" value={selectedNode.data.message || ''} placeholder="Threshold exceeded" maxLength={200} onChange={(event) => updateSelectedNode({ message: event.target.value })} />
                <small className="inspector-help">Supported operators: &gt;, &gt;=, &lt;, &lt;=, ==, != followed by a number.</small>
              </>}

              <label>Component ID</label><div className="read-only-field">{selectedNode.id}</div>
              <label>Execution status</label><div className="status-field"><span className="tiny-dot green" /> Ready for execution</div>
              <button className="delete-button" onClick={() => { setNodes(ns => ns.filter(n => n.id !== selectedNode.id)); setEdges(es => es.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id)); setSelectedNode(null) }}><Trash2 size={15} /> Remove node</button>
            </div> : <div className="inspector-empty"><div className="empty-icon"><Cpu size={22} /></div><b>No node selected</b><p>Select a node on the canvas to view and edit its properties.</p><div className="tip-box"><Sparkles size={16} /><span><b>Quick tip</b> Connect nodes from left to right to define your data pipeline.</span></div></div>}
            <div className="inspector-footer"><ShieldCheck size={15} /> Changes are saved locally</div>
          </aside>}
        </div> : activeTab === 'Live Preview' ? <div className="execution-panel">
          <div className="execution-panel-heading"><div><h3>Live workflow preview</h3><p>{running ? 'Live workflow is listening for matching sensor telemetry.' : 'Compile and activate the workflow to process incoming telemetry.'}</p></div><span className={`execution-state ${running ? 'is-live' : ''}`}><i /> {running ? 'Running' : 'Stopped'}</span></div>
          {executionHistory[0] ? <ExecutionDetails record={executionHistory[0]} /> : <div className="execution-empty"><Activity size={24} /><b>No preview data yet</b><span>Execution details appear when matching telemetry reaches the active workflow.</span></div>}
          <button className="secondary-button" onClick={() => setActiveTab('Builder')}>Back to builder</button>
        </div> : <div className="execution-panel">
          <div className="execution-panel-heading"><div><h3>Execution History</h3><p>{executionHistory.length} recent run{executionHistory.length === 1 ? '' : 's'} · {executionMetrics.totalExecutions.toLocaleString()} total on server</p></div></div>
          {executionHistory.length ? <div className="history-list">{executionHistory.map((record) => <div className="history-card" key={record.id}>
            <div className="history-card-top"><div><b>{record.workflowName}</b><small>{new Date(record.startedAt).toLocaleString()}</small></div><span className={`history-status ${record.status === 'Completed' ? 'success' : 'warning'}`}>{record.status}</span></div>
            <div className="history-summary"><span>{record.steps.length} node steps</span><span>{record.triggeredCount} actions triggered</span><span>{record.durationMs} ms</span></div>
            <ExecutionDetails record={record} />
          </div>)}</div> : <div className="execution-empty"><Activity size={24} /><b>No executions recorded</b><span>Compile, activate, then send matching telemetry to create execution records.</span></div>}
          <button className="secondary-button" onClick={() => setActiveTab('Builder')}>Back to builder</button>
        </div>}
        <section className="telemetry-section">
          <div className="telemetry-heading"><div><div className="eyebrow">REAL-TIME MONITORING</div><h2>Telemetry overview</h2></div><div className="time-filter">Last 20 minutes <ChevronDown size={14} /></div></div>
          <div className="metric-grid">
            <div className="metric-card"><div className="metric-top"><span>Incoming events</span><span className="metric-icon blue"><Activity size={16} /></span></div><div className="metric-value">{incomingEvents.toLocaleString()}</div><p>Stored telemetry readings</p></div>
            <div className="metric-card"><div className="metric-top"><span>Moving average</span><span className="metric-icon purple"><Gauge size={16} /></span></div><div className="metric-value">{latestAverage ? latestAverage.value.toFixed(2) : '—'} <small>{latestAverage?.unit || 'units'}</small></div><p>{latestAverage ? `${latestAverage.sampleCount} sample${latestAverage.sampleCount === 1 ? '' : 's'} in current window` : 'Waiting for telemetry stream'}</p></div>
            <div className="metric-card"><div className="metric-top"><span>Socket connection</span><span className="metric-icon green"><Cloud size={16} /></span></div><div className="metric-value">{socketStatus === 'connected' ? 'Online' : socketStatus === 'connecting' ? '…' : 'Offline'}</div><p>Backend real-time channel</p></div>
            <div className="metric-card"><div className="metric-top"><span>Recent alerts</span><span className="metric-icon orange"><Bell size={16} /></span></div><div className="metric-value">{recentAlerts.toLocaleString()}</div><p>Alerts returned by the API + live events</p></div>
          </div>
          <div className="chart-card"><div className="chart-header"><div><b>Live sensor telemetry</b><p>Raw sensor readings compared with the RxJS rolling average</p></div><div className="chart-controls"><label className="device-filter-label" htmlFor="telemetry-device-filter">Device</label><select id="telemetry-device-filter" className="device-filter" value={selectedDeviceFilter} onChange={(event) => setSelectedDeviceFilter(event.target.value)}><option value="">All devices</option>{telemetryDevices.map((device) => <option key={device.deviceId} value={device.deviceId}>{device.deviceId}</option>)}</select><div className="chart-legend"><span><i /> {visibleLatestAverage?.metric || 'Sensor metric'} · average + raw</span><b>{visibleLatestAverage ? visibleLatestAverage.value.toFixed(2) : '—'} <small>{visibleLatestAverage?.unit || 'units'}</small></b></div></div></div><div className="chart-wrap">{visibleAverageHistory.length ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={visibleAverageHistory}><defs><linearGradient id="vibrationFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7888f6" stopOpacity={0.22}/><stop offset="100%" stopColor="#7888f6" stopOpacity={0.01}/></linearGradient></defs><CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#edf0f6"/><XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#98a1b4', fontSize: 11 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: '#98a1b4', fontSize: 11 }} width={42}/><Tooltip contentStyle={{ border: '1px solid #e9edf5', borderRadius: 10, fontSize: 12 }}/><Area type="monotone" dataKey="value" name="Moving average" stroke="#7888f6" strokeWidth={2.5} fill="url(#vibrationFill)" /><Line type="monotone" dataKey="rawValue" name="Raw reading" stroke="#35b984" strokeWidth={1.7} dot={false} activeDot={{ r: 3 }} /></AreaChart></ResponsiveContainer> : <div className="execution-empty"><Activity size={22}/><b>Waiting for live telemetry</b><span>Post a reading to POST /api/telemetry to see its moving average here.</span></div>}</div></div>
        </section>
        <footer className="footer"><span>© 2026 NexusFlow · IoT Rule Engine</span><span><i /> API {socketStatus === 'connected' ? 'connected' : 'not connected'} <span className="footer-sep">·</span> v0.3.0</span></footer>
        </> : <WorkspacePage page={currentPage} user={currentUser} socketStatus={socketStatus} incomingEvents={incomingEvents} recentAlerts={recentAlerts} executionMetrics={executionMetrics} onToast={setToast} />}
      </section>
    </main>
    {toast && <div className="toast"><CheckCircle2 size={17} />{toast}</div>}
  </div>
}

export default App
