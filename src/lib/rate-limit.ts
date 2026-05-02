import { randomUUID } from 'crypto'
import { createClient } from '@vercel/kv'

type Bucket = {
  count: number
  resetAt: number
}

type RateLimitResult = {
  allowed: boolean
  retryAfter: number
}

const globalForRateLimit = globalThis as typeof globalThis & {
  agendaRateLimits?: Map<string, Bucket>
  agendaRateLimitFallbackWarned?: boolean
  agendaRateLimitKvWarned?: boolean
}

const buckets = globalForRateLimit.agendaRateLimits ?? new Map<string, Bucket>()
globalForRateLimit.agendaRateLimits = buckets

let kvClient: ReturnType<typeof createClient> | null = null

function getKvClient() {
  const url = process.env.KV_REST_API_URL || process.env.KV_URL
  const token = process.env.KV_REST_API_TOKEN

  if (!url || !token) {
    warnFallbackOnce('Vercel KV env vars are not set; using in-memory rate limits.')
    return null
  }

  kvClient ??= createClient({ url, token })
  return kvClient
}

function warnFallbackOnce(message: string) {
  if (globalForRateLimit.agendaRateLimitFallbackWarned) return
  console.warn(`[rate-limit] ${message}`)
  globalForRateLimit.agendaRateLimitFallbackWarned = true
}

function warnKvOnce(message: string) {
  if (globalForRateLimit.agendaRateLimitKvWarned) return
  console.warn(`[rate-limit] ${message}`)
  globalForRateLimit.agendaRateLimitKvWarned = true
}

function checkInMemoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
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

export async function checkRateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const client = getKvClient()
  if (!client) return checkInMemoryRateLimit(key, limit, windowMs)

  const now = Date.now()
  const windowStart = now - windowMs
  const ttlSeconds = Math.max(1, Math.ceil(windowMs / 1000))
  const kvKey = `rate-limit:${key}`

  try {
    await client.zremrangebyscore(kvKey, 0, windowStart)

    const count = await client.zcard(kvKey)
    if (count >= limit) {
      const oldest = await client.zrange<(string | number)[]>(kvKey, 0, 0, { withScores: true })
      const oldestScore = Number(oldest[1])
      const retryAfter = Number.isFinite(oldestScore)
        ? Math.max(1, Math.ceil((oldestScore + windowMs - now) / 1000))
        : ttlSeconds

      return { allowed: false, retryAfter }
    }

    await client.zadd(kvKey, { score: now, member: `${now}:${randomUUID()}` })
    await client.expire(kvKey, ttlSeconds)

    return { allowed: true, retryAfter: 0 }
  } catch (error) {
    warnKvOnce(
      `Vercel KV rate limit failed; using in-memory fallback for this process. ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    )
    return checkInMemoryRateLimit(key, limit, windowMs)
  }
}

export function getClientIp(headers: Headers) {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}
