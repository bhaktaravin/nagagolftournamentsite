# NAGGA Version 2

**North American Gujarati Golf Association** — membership, events, and community.

## Features

- **Login** — Phone number + zipcode (matches [nagga.net](https://nagga.net))
- **Join** — New member registration (phone, zipcode, name, email)
- **Dashboard** — Overview, your event registrations, upcoming events
- **Events** — List, detail, register/unregister, capacity limits
- **Members** — Member directory (name, region, year, handicap)
- **Profile** — Update name, email, zipcode, handicap
- **Leaderboard** — Members by handicap (lowest first)
- **About & Contact** — Public association pages

## Tech

- **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**
- **Prisma** + **Neon Postgres**
- **JWT** in httpOnly cookies for sessions

## Setup

1. **Copy env file and add your Neon URL:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env`: set **DATABASE_URL** to your Neon Postgres connection string.

2. **Install, generate Prisma, push schema, seed, and run:**

   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run db:seed
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

   **Demo login:** `5551234567` / `07030`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to Neon |
| `npm run db:seed` | Seed demo member + events |
| `npm run db:studio` | Open Prisma Studio |

## Env

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon (or other Postgres) connection string. |
| `JWT_SECRET` | No | Override for production (default: dev-only secret). |

---

© NAGGA · An offering by Anand Systems Inc
