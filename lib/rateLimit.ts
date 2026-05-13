import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitPolicy = "login-ip" | "login-phone" | "join-ip";

const POLICY = {
  "login-ip": { max: 25, windowMs: 15 * 60 * 1000, upstashWindow: "15 m" as const },
  "login-phone": { max: 10, windowMs: 15 * 60 * 1000, upstashWindow: "15 m" as const },
  "join-ip": { max: 8, windowMs: 60 * 60 * 1000, upstashWindow: "1 h" as const },
};

function upstashConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL?.length &&
    process.env.UPSTASH_REDIS_REST_TOKEN?.length
  );
}

let redisSingleton: Redis | null = null;

function getRedis(): Redis | null {
  if (!upstashConfigured()) return null;
  if (!redisSingleton) {
    redisSingleton = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redisSingleton;
}

const ratelimiters = new Map<RateLimitPolicy, Ratelimit>();

function getRatelimit(policy: RateLimitPolicy): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  let rl = ratelimiters.get(policy);
  if (!rl) {
    const p = POLICY[policy];
    rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(p.max, p.upstashWindow),
      prefix: `nagga:${policy}`,
    });
    ratelimiters.set(policy, rl);
  }
  return rl;
}

/**
 * In-memory sliding-window rate limiter (per Node process).
 * Used when Upstash env is unset, or as a fallback if the Redis request fails.
 */
const hits = new Map<string, number[]>();

const MAX_KEYS = 5000;

function pruneStaleKeys(now: number, windowMs: number) {
  if (hits.size <= MAX_KEYS) return;
  for (const [key, stamps] of hits) {
    const fresh = stamps.filter((t) => now - t < windowMs);
    if (fresh.length === 0) hits.delete(key);
    else hits.set(key, fresh);
  }
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

export function rateLimitMemory(key: string, max: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  pruneStaleKeys(now, windowMs);

  const stamps = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (stamps.length >= max) {
    const oldest = stamps[0]!;
    const retryAfterSec = Math.ceil((oldest + windowMs - now) / 1000);
    return { ok: false, retryAfterSec: Math.max(1, retryAfterSec) };
  }
  stamps.push(now);
  hits.set(key, stamps);
  return { ok: true };
}

/**
 * Distributed rate limit when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
 * are set; otherwise in-memory (single-instance) limits.
 */
export async function checkRateLimit(
  policy: RateLimitPolicy,
  identifier: string
): Promise<RateLimitResult> {
  const cfg = POLICY[policy];
  const rl = getRatelimit(policy);
  if (rl) {
    try {
      const { success, reset } = await rl.limit(identifier);
      if (!success) {
        const retryAfterSec = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
        return { ok: false, retryAfterSec };
      }
      return { ok: true };
    } catch (e) {
      console.error("[rateLimit] Upstash error, using in-memory fallback:", e);
    }
  }
  return rateLimitMemory(`${policy}:${identifier}`, cfg.max, cfg.windowMs);
}
