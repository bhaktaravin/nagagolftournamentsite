import type { NextApiRequest } from 'next'

export type User = {
  id: number
  name: string
  email?: string
  phone?: string
  club?: string
  ghin?: string
}

export function parseCookies(cookieHeader?: string) {
  const out: Record<string, string> = {}
  if (!cookieHeader) return out
  cookieHeader.split(';').forEach((c) => {
    const [k, ...v] = c.split('=')
    out[k.trim()] = decodeURIComponent((v || []).join('=').trim())
  })
  return out
}

export function getUserFromReq(req: NextApiRequest): User | null {
  const cookies = parseCookies(req.headers?.cookie)
  if (!cookies.user) return null
  try {
    const parsed = JSON.parse(cookies.user)
    return parsed as User
  } catch (e) {
    return null
  }
}
