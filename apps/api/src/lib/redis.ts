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
    _redis = new Redis(env.UPSTASH_REDIS_REST_URL, {
      password: env.UPSTASH_REDIS_REST_TOKEN,
      tls: {},
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })
    _redis.on('error', (err) => console.error('[Redis]', err))
  }
  return _redis
}
