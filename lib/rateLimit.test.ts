import { describe, expect, it } from "vitest";
import { rateLimitMemory } from "./rateLimit";

describe("rateLimitMemory", () => {
  it("allows requests under the cap", () => {
    const key = `t-${Math.random()}`;
    const windowMs = 60_000;
    expect(rateLimitMemory(key, 3, windowMs)).toEqual({ ok: true });
    expect(rateLimitMemory(key, 3, windowMs)).toEqual({ ok: true });
    expect(rateLimitMemory(key, 3, windowMs)).toEqual({ ok: true });
  });

  it("blocks after the cap and returns retry-after", () => {
    const key = `t-${Math.random()}`;
    const windowMs = 60_000;
    rateLimitMemory(key, 2, windowMs);
    rateLimitMemory(key, 2, windowMs);
    const blocked = rateLimitMemory(key, 2, windowMs);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.retryAfterSec).toBeGreaterThan(0);
    }
  });
});
