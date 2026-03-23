import { Redis } from 'ioredis'
import { getEnv } from '@creator-os/config'

let _redis: Redis | undefined

/**
 * Singleton Upstash Redis client.
 * Used for: rate limiting, AI response cache, BullMQ, real-time pub/sub.
 */
export function getRedis(): Redis {
  if (!_redis) {
    const env = getEnv()
    const url = new URL(env.REDIS_URL)
    const isSecure = url.protocol === 'rediss:'
    _redis = new Redis(env.REDIS_URL, {
      ...(isSecure ? { tls: { rejectUnauthorized: false } } : {}),
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true,
    })
    _redis.on('error', (err) => {
      if (process.env['NODE_ENV'] !== 'production') return // suppress noise in dev
      console.error('[Redis]', err)
    })
  }
  return _redis
}
