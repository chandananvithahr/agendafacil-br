type Bucket = {
  count: number
  resetAt: number
}

const globalForRateLimit = globalThis as typeof globalThis & {
  agendaRateLimits?: Map<string, Bucket>
}

const buckets = globalForRateLimit.agendaRateLimits ?? new Map<string, Bucket>()
globalForRateLimit.agendaRateLimits = buckets

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfter: 0 }
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count += 1
  return { allowed: true, retryAfter: 0 }
}

export function getClientIp(headers: Headers) {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}
