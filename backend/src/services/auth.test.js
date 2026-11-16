import test from 'node:test'
import assert from 'node:assert/strict'
import { hashPassword, verifyPassword, signToken, verifyToken } from './auth.js'
process.env.JWT_SECRET = 'test-secret-for-nexusflow-auth-service-0123456789'
test('password hashes verify without storing the original password', async () => {
  const hash = await hashPassword('correct-horse-battery')
  assert.notEqual(hash, 'correct-horse-battery')
  assert.equal(await verifyPassword('correct-horse-battery', hash), true)
  assert.equal(await verifyPassword('incorrect-password', hash), false)
})
test('signed access tokens verify and expose user claims', () => {
  const token = signToken({ _id: '507f1f77bcf86cd799439011', email: 'demo@example.com', role: 'user' })
  const claims = verifyToken(token)
  assert.equal(claims.sub, '507f1f77bcf86cd799439011')
  assert.equal(claims.email, 'demo@example.com')
  assert.throws(() => verifyToken(`${token.slice(0, -1)}x`), /signature/)
})
