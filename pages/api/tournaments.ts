import type { NextApiRequest, NextApiResponse } from 'next'

type Tournament = {
  id: number
  name: string
  date: string
  year: number
}

const SAMPLE: Tournament[] = [
  { id: 1, name: 'NAGGA Spring Open', date: '2025-04-12', year: 2025 },
  { id: 2, name: 'NAGGA Summer Classic', date: '2025-07-20', year: 2025 },
  { id: 3, name: 'NAGGA Fall Invitational', date: '2024-10-05', year: 2024 }
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { year } = req.query
  if (year) {
    const n = Number(Array.isArray(year) ? year[0] : year)
    const filtered = SAMPLE.filter((t) => t.year === n)
    return res.status(200).json(filtered)
  }
  return res.status(200).json(SAMPLE)
}
