import type { NextApiRequest, NextApiResponse } from 'next'
import { USERS } from './users-data'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req
  if (query?.id) {
    const id = Number(Array.isArray(query.id) ? query.id[0] : query.id)
    const found = USERS.find((u) => u.id === id)
    if (!found) return res.status(404).json({ error: 'User not found' })
    return res.status(200).json(found)
  }

  if (query?.email) {
    const email = Array.isArray(query.email) ? query.email[0] : query.email
    const found = USERS.find((u) => u.email === email)
    if (!found) return res.status(404).json({ error: 'User not found' })
    return res.status(200).json(found)
  }

  // return full list for GET
  return res.status(200).json(USERS)
}
