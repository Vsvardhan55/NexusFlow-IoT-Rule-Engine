import { useCallback, useMemo, useState } from 'react'
import {
  ReactFlow, Background, Controls, MiniMap, Handle, Position,
  addEdge, useNodesState, useEdgesState, MarkerType
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  Activity, Bell, ChevronDown, CircleHelp, Cloud, Cpu, Database,
  Gauge, GitBranch, LayoutDashboard, Play, Plus, Radio, Save,
  Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles,
  SquareTerminal, Zap, Clock3, CheckCircle2, X, Trash2
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import './App.css'

const initialNodes = [
  {
    id: 'sensor-1', type: 'sensorNode', position: { x: 80, y: 150 },
    data: { label: 'Turbine Sensor', subtitle: 'Vibration · sensor-01', metric: '42.8', unit: 'mm/s', status: 'Connected' }
  },
  {
    id: 'filter-1', type: 'filterNode', position: { x: 390, y: 150 },
    data: { label: 'Moving Average', subtitle: 'Signal processing', window: '10 samples' }
  },
  {
    id: 'alert-1', type: 'alertNode', position: { x: 710, y: 150 },
    data: { label: 'SMS Alert', subtitle: 'Action trigger', condition: 'Value > 50 mm/s' }
  },
]
const initialEdges = [
  { id: 'e1-2', source: 'sensor-1', target: 'filter-1', animated: true, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#7c8cff', strokeWidth: 2 } },
  { id: 'e2-3', source: 'filter-1', target: 'alert-1', animated: true, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#7c8cff', strokeWidth: 2 } },
]
const chartData = [
  { time: '10:40', value: 29 }, { time: '10:42', value: 34 }, { time: '10:44', value: 31 },
  { time: '10:46', value: 39 }, { time: '10:48', value: 36 }, { time: '10:50', value: 44 },
  { time: '10:52', value: 41 }, { time: '10:54', value: 47 }, { time: '10:56', value: 43 },
  { time: '10:58', value: 42.8 },
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
    <div className="node-foot"><span>Moving average</span><span>ƒ(x)</span></div>
  </NodeShell>
}
function AlertNode({ data, selected }) {
  return <NodeShell kind="alert" icon={Bell} title="ACTION" subtitle={data.subtitle} selected={selected}>
    <strong>{data.label}</strong>
    <div className="node-config"><span>Trigger when</span><b>{data.condition}</b></div>
    <div className="node-foot"><span>SMS notification</span><span className="enabled-pill">Enabled</span></div>
  </NodeShell>
}
const nodeTypes = { sensorNode: SensorNode, filterNode: FilterNode, alertNode: AlertNode }

function Sidebar() {
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark"><GitBranch size={20} /></div><div><b>NexusFlow</b><small>IoT RULE ENGINE</small></div></div>
    <div className="workspace-label">WORKSPACE <ChevronDown size={13} /></div>
    <div className="workspace-card"><div className="workspace-avatar">N</div><div><b>Nexus Labs</b><small>Free workspace</small></div><ChevronDown size={15} /></div>
    <div className="nav-section">GENERAL</div>
    <nav className="side-nav">
      <a><LayoutDashboard size={17} /> Overview</a>
      <a className="active"><GitBranch size={17} /> Rule Builder <span className="nav-count">1</span></a>
      <a><Activity size={17} /> Live Telemetry</a>
      <a><Database size={17} /> Data Sources</a>
      <a><Bell size={17} /> Alerts <span className="alert-count">3</span></a>
    </nav>
    <div className="nav-section lower">MANAGE</div>
    <nav className="side-nav">
      <a><SquareTerminal size={17} /> Event Logs</a>
      <a><Settings2 size={17} /> Settings</a>
    </nav>
    <div className="sidebar-bottom">
      <div className="usage-card"><div className="usage-title"><span>Monthly usage</span><b>68%</b></div><div className="usage-track"><span /></div><small>6,820 / 10,000 events</small></div>
      <div className="profile"><div className="profile-avatar">SV</div><div><b>Sethu Vardhan</b><small>Administrator</small></div><ChevronDown size={15} /></div>
    </div>
  </aside>
}

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [activeTab, setActiveTab] = useState('Builder')
  const [selectedNode, setSelectedNode] = useState(null)
  const [running, setRunning] = useState(false)
  const [toast, setToast] = useState('')
  const [workflowName, setWorkflowName] = useState('Turbine Vibration Monitor')
  const [showInspector, setShowInspector] = useState(true)

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({
    ...params, type: 'smoothstep', animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#7c8cff', strokeWidth: 2 }
  }, eds)), [setEdges])

  const addNode = (type) => {
    const config = {
      sensorNode: { label: 'New Sensor', subtitle: 'Telemetry · sensor-new', metric: '0.0', unit: 'units', status: 'Waiting' },
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
  const runWorkflow = () => {
    setRunning((v) => !v)
    setToast(running ? 'Workflow paused' : 'Workflow simulation started')
    setTimeout(() => setToast(''), 2500)
  }
  const onNodeClick = (_, node) => { setSelectedNode(node); setShowInspector(true) }
  const chart = useMemo(() => chartData, [])

  return <div className="app-shell">
    <Sidebar />
    <main className="main-area">
      <header className="topbar">
        <div className="breadcrumb">Projects <span>/</span> <b>Rule Builder</b></div>
        <div className="top-actions"><span className="system-status"><i /> All systems operational</span><button className="icon-button"><CircleHelp size={18} /></button><button className="icon-button"><Bell size={18} /><i className="notification-dot" /></button><div className="top-avatar">SV</div></div>
      </header>
      <section className="page-content">
        <div className="page-heading">
          <div><div className="eyebrow"><span className="eyebrow-dot" /> VISUAL AUTOMATION</div><h1>Rule Builder</h1><p>Design, connect, and deploy intelligent IoT workflows.</p></div>
          <div className="heading-actions"><button className="secondary-button" onClick={saveWorkflow}><Save size={16} /> Save draft</button><button className={`primary-button ${running ? 'is-running' : ''}`} onClick={runWorkflow}>{running ? <><Activity size={16} /> Stop simulation</> : <><Play size={16} fill="currentColor" /> Run workflow</>}</button></div>
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
            {selectedNode ? <div className="inspector-body"><div className="selected-type">SELECTED COMPONENT</div><h3>{selectedNode.data.label}</h3><p className="inspector-description">Configure the selected node and its processing behavior.</p><label>Node name</label><input className="field-input" value={selectedNode.data.label || ''} onChange={(e) => { const value = e.target.value; setNodes(ns => ns.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: value } } : n)); setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, label: value } }) }} /><label>Component ID</label><div className="read-only-field">{selectedNode.id}</div><label>Execution status</label><div className="status-field"><span className="tiny-dot green" /> Ready for execution</div><button className="delete-button" onClick={() => { setNodes(ns => ns.filter(n => n.id !== selectedNode.id)); setEdges(es => es.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id)); setSelectedNode(null) }}><Trash2 size={15} /> Remove node</button></div> : <div className="inspector-empty"><div className="empty-icon"><Cpu size={22} /></div><b>No node selected</b><p>Select a node on the canvas to view and edit its properties.</p><div className="tip-box"><Sparkles size={16} /><span><b>Quick tip</b> Connect nodes from left to right to define your data pipeline.</span></div></div>}
            <div className="inspector-footer"><ShieldCheck size={15} /> Changes are saved locally</div>
          </aside>}
        </div> : <div className="alternate-panel"><div className="empty-icon"><Activity size={25} /></div><h3>{activeTab}</h3><p>{activeTab === 'Live Preview' ? 'Run the workflow simulation to preview telemetry and node execution.' : 'Execution records will appear here after workflow runs.'}</p><button className="primary-button" onClick={() => { setActiveTab('Builder'); runWorkflow() }}><Play size={15} /> {activeTab === 'Live Preview' ? 'Start simulation' : 'Back to builder'}</button></div>}
        <section className="telemetry-section">
          <div className="telemetry-heading"><div><div className="eyebrow">REAL-TIME MONITORING</div><h2>Telemetry overview</h2></div><div className="time-filter">Last 20 minutes <ChevronDown size={14} /></div></div>
          <div className="metric-grid">
            <div className="metric-card"><div className="metric-top"><span>Incoming events</span><span className="metric-icon blue"><Activity size={16} /></span></div><div className="metric-value">12,840 <small className="positive">↗ 12.8%</small></div><p>Compared to previous period</p></div>
            <div className="metric-card"><div className="metric-top"><span>Avg. processing time</span><span className="metric-icon purple"><Gauge size={16} /></span></div><div className="metric-value">24 <small>ms</small></div><p><span className="positive">↓ 4.2%</span> faster than average</p></div>
            <div className="metric-card"><div className="metric-top"><span>Active connections</span><span className="metric-icon green"><Cloud size={16} /></span></div><div className="metric-value">08 <small>/ 10</small></div><p>All devices responding</p></div>
            <div className="metric-card"><div className="metric-top"><span>Triggered alerts</span><span className="metric-icon orange"><Bell size={16} /></span></div><div className="metric-value">03 <small className="neutral">today</small></div><p>1 alert requires attention</p></div>
          </div>
          <div className="chart-card"><div className="chart-header"><div><b>Sensor activity</b><p>Vibration readings over time</p></div><div className="chart-legend"><span><i /> Vibration (mm/s)</span><b>42.8 <small>mm/s</small></b></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chart}><defs><linearGradient id="vibrationFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7888f6" stopOpacity={0.22}/><stop offset="100%" stopColor="#7888f6" stopOpacity={0.01}/></linearGradient></defs><CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#edf0f6"/><XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#98a1b4', fontSize: 11 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: '#98a1b4', fontSize: 11 }} width={34}/><Tooltip contentStyle={{ border: '1px solid #e9edf5', borderRadius: 10, fontSize: 12 }}/><Area type="monotone" dataKey="value" stroke="#7888f6" strokeWidth={2.5} fill="url(#vibrationFill)" /></AreaChart></ResponsiveContainer></div></div>
        </section>
        <footer className="footer"><span>© 2026 NexusFlow · IoT Rule Engine</span><span><i /> API operational <span className="footer-sep">·</span> v0.1.0</span></footer>
      </section>
    </main>
    {toast && <div className="toast"><CheckCircle2 size={17} />{toast}</div>}
  </div>
}

export default App
