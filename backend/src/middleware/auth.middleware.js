import { verifyToken } from '../services/auth.js'
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  try { const claims = verifyToken(token); req.user = { ...claims, id: claims.sub }; next() }
  catch { res.status(401).json({ success: false, message: 'Authentication required. Please sign in again.' }) }
}
