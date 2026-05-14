import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import type { PoolConfig } from "pg";

/**
 * pg v8 maps `sslmode=require` (common on Supabase/Vercel URLs) to strict certificate
 * verification. `ssl: { rejectUnauthorized: false }` alone is not enough — set `no-verify`
 * unless the app opts into strict TLS via DATABASE_SSL_REJECT_UNAUTHORIZED=true.
 */
function connectionStringForAdapter(raw: string): string {
  if (process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true") {
    return raw;
  }
  try {
    const u = new URL(raw);
    const mode = u.searchParams.get("sslmode");
    if (
      !mode ||
      mode === "require" ||
      mode === "prefer" ||
      mode === "verify-ca" ||
      mode === "verify-full"
    ) {
      u.searchParams.set("sslmode", "no-verify");
    }
    return u.toString();
  } catch {
    const sep = raw.includes("?") ? "&" : "?";
    return raw.includes("sslmode=") ? raw : `${raw}${sep}sslmode=no-verify`;
  }
}

/**
 * Reuse one PrismaClient per runtime (including production on Vercel).
 * Creating a new client per request exhausts Supabase connection limits.
 *
 * Prisma 7 + adapter-pg: pass a PoolConfig (not a Pool instance) so the adapter’s
 * internal Pool always gets TLS options — avoids instanceof / duplicate-bundling issues.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const poolConfig: PoolConfig = {
    connectionString: connectionStringForAdapter(connectionString),
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    ssl:
      process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true"
        ? undefined
        : { rejectUnauthorized: false },
  };

  const adapter = new PrismaPg(poolConfig);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
