import test from 'node:test'
import assert from 'node:assert/strict'
import { matchesRule, validateRule } from './ruleEngine.js'
const reading = { value: 85, metadata: { metric: 'temperature', deviceId: 'turbine-01' } }
test('validates and matches a threshold rule', () => {
  const rule = validateRule({ name: 'High temp', condition: { metric: 'temperature', operator: '>', value: 80 }, action: { type: 'alert', message: 'Hot' } })
  assert.equal(matchesRule(rule, reading), true)
})
test('does not match a different metric', () => {
  const rule = validateRule({ name: 'High temp', condition: { metric: 'pressure', operator: '>', value: 80 }, action: { type: 'alert' } })
  assert.equal(matchesRule(rule, reading), false)
})
test('rejects unsupported operators', () => {
  assert.throws(() => validateRule({ name: 'Bad', condition: { metric: 'temperature', operator: 'eval', value: 1 }, action: { type: 'alert' } }))
})
