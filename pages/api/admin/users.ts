import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromReq } from '../../../lib/auth'
import { USERS } from '../users-data'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromReq(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  // simple admin check: allow user with email ravin1994@yahoo.com or id === 1
  if (!(user.email === 'ravin1994@yahoo.com' || user.id === 1)) {
    return res.status(403).json({ error: 'Forbidden: admin only' })
  }

  // Admin can view full users list
  return res.status(200).json(USERS)
}
