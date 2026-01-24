# Deploying to Vercel

Since you are using Next.js + Prisma + Neon (Postgres), follow these steps to deploy successfully.

## 1. Prepare Code (Done)
I have added the `"postinstall": "prisma generate"` script to your `package.json`. This ensures Vercel generates the Prisma Client during the build process.

## 2. Push to GitHub
Run the following commands in your terminal to safe-keep your changes:
```bash
git add .
git commit -m "Prepare for deployment"
git push
```

## 3. Configure Vercel Project
1. Go to your Vercel Dashboard and import the project from GitHub.
2. **Environment Variables**: You MUST add the following variables in the Vercel Project Settings:
   - `DATABASE_URL`: Your full Neon Postgres connection string (same as in your local .env).
   - `JWT_SECRET`: Generate a random long string (e.g., use `openssl rand -hex 32` or just mash your keyboard).

## 4. Database Schema Update (Important)
Vercel builds do NOT automatically push your schema changes to the database. You must apply them manually to your *Production* database.

**Option A: Run from Local (Easiest)**
If your `DATABASE_URL` in your local `.env` is pointing to the same database you want to use in production (Neon), simply run:
```bash
npm run db:push
```
*Note: If you have a separate "Production" database, change the URL in your .env temporarily to the Prod URL, run the command, and change it back.*

**Option B: Build Command Override**
In Vercel Settings > General > Build & Development Settings, you can change the **Build Command** to:
```bash
npx prisma db push && next build
```
*This will automatically sync the schema every time you deploy.*

## 5. Seed Admin User (First Time Only)
To create the Admin user in production:
1. Ensure your local `.env` points to the Production Database.
2. Run:
   ```bash
   npm run db:seed
   ```
3. This creates the Admin user (`9998887777` / `00000`).
