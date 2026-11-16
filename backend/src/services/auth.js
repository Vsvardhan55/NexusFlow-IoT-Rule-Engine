import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
const scrypt = promisify(scryptCallback)

export function assertAuthConfiguration() {
  const value = process.env.JWT_SECRET
  if (!value || value.length < 32 || value === 'replace-with-a-random-secret-at-least-32-characters-long') {
    throw new Error('Authentication configuration missing: set JWT_SECRET in backend/.env to a random value of at least 32 characters. Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"')
  }
  return true
}
function secret() {
  assertAuthConfiguration()
  return process.env.JWT_SECRET
}
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const derived = await scrypt(password, salt, 64)
  return `${salt}:${Buffer.from(derived).toString('hex')}`
}
export async function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':')
  if (!salt || !hash) return false
  const derived = Buffer.from(await scrypt(password, salt, 64))
  const expected = Buffer.from(hash, 'hex')
  return expected.length === derived.length && timingSafeEqual(expected, derived)
}
export function signToken(user) {
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({ sub: String(user._id), email: user.email, role: user.role || 'user', iat: now, exp: now + 60 * 60 * 24 * 7 })).toString('base64url')
  const input = `${header}.${payload}`
  const signature = createHmac('sha256', secret()).update(input).digest('base64url')
  return `${input}.${signature}`
}
export function verifyToken(token) {
  const parts = String(token || '').split('.')
  if (parts.length !== 3) throw new Error('Invalid token.')
  const input = `${parts[0]}.${parts[1]}`
  const actual = Buffer.from(parts[2])
  const expected = Buffer.from(createHmac('sha256', secret()).update(input).digest('base64url'))
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new Error('Invalid token signature.')
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
  if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) throw new Error('Session expired.')
  return payload
}
