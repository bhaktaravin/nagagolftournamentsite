import type { NextApiRequest, NextApiResponse } from 'next'
import { USERS } from '../users-data'

// Very small demo login endpoint
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password } = req.body || {}
  // demo: match by email and password (password stored as plain for demo only)
  const user = USERS.find((u) => (u.email && u.email === email) || (u.phone && u.phone === email))
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  // In this demo we accept any password if user exists OR check a demo password key
  // For a specific testuser (Rohit) accept password '94087' (from attachment)
  if (user.email === 'ravin1994@yahoo.com' && password !== '94087') {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  // Set an HttpOnly cookie with a JSON payload (demo only — not secure for production)
  const cookieValue = encodeURIComponent(JSON.stringify(user))
  res.setHeader('Set-Cookie', `user=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`)
  return res.status(200).json({ ok: true, user })
}
