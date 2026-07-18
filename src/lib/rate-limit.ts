import "server-only";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const LIMIT = 30;
const MAX_BUCKETS = 1_000;

export function consumeRateLimit(key: string, now = Date.now()): { allowed: boolean; remaining: number; resetAt: number } {
  const existing = buckets.get(key);
  const bucket = !existing || existing.resetAt <= now ? { count: 0, resetAt: now + WINDOW_MS } : existing;
  bucket.count += 1;
  buckets.delete(key);
  buckets.set(key, bucket);

  if (buckets.size > MAX_BUCKETS) {
    for (const [bucketKey, value] of buckets) {
      if (value.resetAt <= now) buckets.delete(bucketKey);
    }
    while (buckets.size > MAX_BUCKETS) {
      const oldestKey = buckets.keys().next().value as string | undefined;
      if (!oldestKey) break;
      buckets.delete(oldestKey);
    }
  }

  return {
    allowed: bucket.count <= LIMIT,
    remaining: Math.max(0, LIMIT - bucket.count),
    resetAt: bucket.resetAt,
  };
}
