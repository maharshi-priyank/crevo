import type { FastifyRequest, FastifyReply } from 'fastify'
import { getRedis } from '../lib/redis.js'
import { RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW_SECONDS } from '@creator-os/config/constants'

/**
 * Sliding window rate limiter — 100 req/min per IP.
 * Requirement 14.5: Redis sliding window rate limiting on all public endpoints.
 * Property 15: Rate Limiting Enforcement.
 */
export async function rateLimiter(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const ip = request.ip
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW_SECONDS * 1000
  const key = `rl:${ip}`

  const redis = getRedis()
  const pipeline = redis.pipeline()
  pipeline.zremrangebyscore(key, '-inf', windowStart)
  pipeline.zadd(key, now, `${now}-${Math.random()}`)
  pipeline.zcard(key)
  pipeline.expire(key, RATE_LIMIT_WINDOW_SECONDS)

  const results = await pipeline.exec()
  const count = (results?.[2]?.[1] as number) ?? 0

  if (count > RATE_LIMIT_REQUESTS) {
    reply
      .status(429)
      .header('Retry-After', String(RATE_LIMIT_WINDOW_SECONDS))
      .send({ error: 'Too many requests', code: 'RATE_LIMITED' })
  }
}
