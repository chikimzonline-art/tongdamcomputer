/**
 * Lightweight in-memory sliding-window rate limiter.
 *
 * Intended for long-running Next.js standalone processes where a
 * single Node.js instance handles all requests. Requires no external
 * services (Redis, Upstash, etc.).
 *
 * Usage:
 *   const result = rateLimit(ip, { limit: 5, windowMs: 60_000 });
 *   if (result.limited) return NextResponse.json({...}, { status: 429 });
 */

type RateLimitOptions = {
  /** Max number of requests allowed within the window. */
  limit: number;
  /** Window size in milliseconds. */
  windowMs: number;
};

type RateLimitResult = {
  /** True if the caller has exceeded the limit. */
  limited: boolean;
  /** Remaining requests in the current window. */
  remaining: number;
  /** Timestamp (ms) when the oldest request in the window expires. */
  resetAt: number;
};

// Map of ip -> array of request timestamps within the current window.
const store = new Map<string, number[]>();

// Prune the store when it grows beyond this many keys to prevent
// unbounded memory growth (e.g. from a flood of unique IPs).
const MAX_STORE_SIZE = 10_000;

/**
 * Check and record a request from `ip`.
 * Returns whether the request should be rate-limited.
 */
export function rateLimit(
  ip: string,
  options: RateLimitOptions,
): RateLimitResult {
  const { limit, windowMs } = options;
  const now = Date.now();
  const windowStart = now - windowMs;

  // Prune store if it's grown too large (evict oldest entries).
  if (store.size >= MAX_STORE_SIZE) {
    const keys = store.keys();
    for (const key of keys) {
      store.delete(key);
      if (store.size < MAX_STORE_SIZE * 0.8) break;
    }
  }

  // Get or create the list of timestamps for this IP.
  const timestamps = store.get(ip) ?? [];

  // Drop timestamps outside the sliding window.
  const fresh = timestamps.filter((t) => t > windowStart);

  // Determine result before recording this request.
  const limited = fresh.length >= limit;
  const remaining = Math.max(0, limit - fresh.length - (limited ? 0 : 1));
  const resetAt = fresh.length > 0 ? fresh[0] + windowMs : now + windowMs;

  if (!limited) {
    // Record this request.
    fresh.push(now);
  }

  store.set(ip, fresh);

  return { limited, remaining, resetAt };
}

/**
 * Extract the most-trusted client IP from an incoming Next.js Request.
 * Prefers X-Real-IP (set by Caddy), then the first entry of
 * X-Forwarded-For, then falls back to a placeholder for local dev.
 */
export function getClientIp(req: Request): string {
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  // Fallback — prevents crashes in local dev.
  return "unknown";
}
