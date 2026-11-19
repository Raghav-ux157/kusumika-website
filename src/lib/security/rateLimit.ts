import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window store keyed by `${prefix}:${ip}`
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired buckets every 2 minutes
const CLEANUP_INTERVAL_MS = 2 * 60 * 1000;
let lastCleanup = Date.now();

function purgeExpiredBuckets(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const threshold = now - windowMs;
  rateLimitStore.forEach((record, key) => {
    record.timestamps = record.timestamps.filter((ts: number) => ts > threshold);
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  });
}

export interface RateLimitOptions {
  limit: number; // Maximum allowed requests
  windowMs: number; // Time window in milliseconds
  prefix?: string; // Scope identifier (e.g., "checkout", "login")
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Timestamp when window expires (in seconds)
  retryAfter: number; // Seconds until next allowed request
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Checks and enforces sliding window rate limiting
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions
): RateLimitResult {
  const { limit, windowMs, prefix = "general" } = options;
  const ip = getClientIp(req);
  const key = `${prefix}:${ip}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  purgeExpiredBuckets(windowMs);

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  const resetSeconds = Math.ceil((now + windowMs) / 1000);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldestTimestamp + windowMs - now) / 1000)
    );

    return {
      success: false,
      limit,
      remaining: 0,
      reset: resetSeconds,
      retryAfter: retryAfterSeconds,
    };
  }

  record.timestamps.push(now);
  const remaining = Math.max(0, limit - record.timestamps.length);

  return {
    success: true,
    limit,
    remaining,
    reset: resetSeconds,
    retryAfter: 0,
  };
}

/**
 * Generates an HTTP 429 Too Many Requests response with standard rate limit headers
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: "Too many requests. Atelier safety protocols active. Please slow down and try again.",
      retryAfter: result.retryAfter,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.retryAfter),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.reset),
      },
    }
  );
}
