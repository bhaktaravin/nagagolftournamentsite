import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // clear cookie
  res.setHeader('Set-Cookie', `user=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`)
  return res.status(200).json({ ok: true })
}
