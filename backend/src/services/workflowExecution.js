import { getDatabase } from '../config/database.js'
import { evaluateCompiledWorkflow } from './workflowPlanRunner.js'

export async function executeActiveWorkflows(reading, io) {
  const db = getDatabase()
  const active = await db.collection('workflows').find({ active: true }).toArray()
  for (const workflow of active) {
    try {
      const result = evaluateCompiledWorkflow(workflow, reading)
      if (!result.matched) continue
      const now = new Date()
      const execution = {
        workflowId: workflow._id,
        workflowName: workflow.name,
        deviceId: reading.metadata.deviceId,
        metric: reading.metadata.metric,
        inputValue: reading.value,
        unit: reading.unit || '',
        status: result.alerts.length ? 'triggered' : 'completed',
        nodeResults: result.nodeResults,
        triggeredAlerts: result.alerts,
        startedAt: now,
        completedAt: new Date(),
      }
      const inserted = await db.collection('workflowExecutions').insertOne(execution)
      execution._id = inserted.insertedId
      io.emit('workflow:execution', execution)

      if (result.alerts.length) {
        const alertDocuments = result.alerts.map((alert) => ({
          workflowId: workflow._id,
          workflowName: workflow.name,
          nodeId: alert.nodeId,
          deviceId: reading.metadata.deviceId,
          metric: reading.metadata.metric,
          value: alert.value,
          message: alert.message,
          actionType: 'in-app-alert',
          triggeredAt: new Date(),
          acknowledged: false,
        }))
        await db.collection('alerts').insertMany(alertDocuments)
        alertDocuments.forEach((alert) => io.emit('alert:new', alert))
      }
    } catch (error) {
      console.error(`Workflow ${workflow._id} execution failed:`, error.message)
    }
  }
}


export { evaluateCompiledWorkflow, resetWorkflowExecutionState } from './workflowPlanRunner.js'
