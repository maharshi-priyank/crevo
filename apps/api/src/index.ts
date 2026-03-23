// Load .env file in development (tsx doesn't auto-load env files)
import { config } from 'dotenv'
config()

import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import { getEnv } from '@creator-os/config'
import { creatorRoutes } from './routes/creators.js'
import { storefrontRoutes } from './routes/storefront.js'
import { productRoutes } from './routes/products.js'
import { checkoutRoutes } from './routes/checkout.js'
import { webhookRoutes } from './routes/webhooks.js'
import { deliveryRoutes } from './routes/delivery.js'
import { orderRoutes } from './routes/orders.js'
import { analyticsRoutes } from './routes/analytics.js'
import { rateLimiter } from './middleware/rateLimiter.js'
import { startEmailWorker } from './queues/workers/email.worker.js'

// Validate env at startup — fail fast
const env = getEnv()

const app = Fastify({
  logger: env.NODE_ENV !== 'production'
    ? { level: 'debug', transport: { target: 'pino-pretty' } }
    : { level: 'info' },
  // Prisma returns BigInt for fileSizeBytes — serialize as number
  serializerOpts: {
    bigint: true,
  },
})

// JSON replacer: convert BigInt → number everywhere
app.addHook('preSerialization', async (_req, _reply, payload) => {
  return JSON.parse(JSON.stringify(payload, (_key, val) =>
    typeof val === 'bigint' ? Number(val) : val
  ))
})

async function start() {
  // ─── Plugins ────────────────────────────────────────────────────────────────

  await app.register(helmet)

  await app.register(cors, {
    origin: (origin, cb) => {
      const allowed = [
        'https://creatorosbharat.com',
        'https://www.creatorosbharat.com',
        ...(env.NODE_ENV !== 'production' ? ['http://localhost:3000'] : []),
      ]
      if (!origin || allowed.includes(origin)) {
        cb(null, true)
      } else {
        cb(new Error('Not allowed by CORS'), false)
      }
    },
    credentials: true,
  })

  // ─── Rate limiting (all routes) ─────────────────────────────────────────────

  app.addHook('preHandler', rateLimiter)

  // ─── Routes ─────────────────────────────────────────────────────────────────

  await app.register(creatorRoutes)
  await app.register(storefrontRoutes)
  await app.register(productRoutes)
  await app.register(checkoutRoutes)
  await app.register(webhookRoutes)
  await app.register(deliveryRoutes)
  await app.register(orderRoutes)
  await app.register(analyticsRoutes)

  // ─── Health check ──────────────────────────────────────────────────────────

  app.get('/health', async () => ({ status: 'ok', ts: new Date().toISOString() }))

  // ─── Global error handler ──────────────────────────────────────────────────

  app.setErrorHandler((error, _req, reply) => {
    app.log.error(error)
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500
    const err = error as { message?: string; code?: string }
    reply.status(statusCode).send({
      error: err.message ?? 'Internal Server Error',
      code: err.code ?? 'INTERNAL_ERROR',
    })
  })

  // ─── Background workers ─────────────────────────────────────────────────────

  startEmailWorker()
  app.log.info('Email dispatch worker started')

  // ─── Start ─────────────────────────────────────────────────────────────────

  const PORT = parseInt(process.env['PORT'] ?? '4000', 10)
  await app.listen({ port: PORT, host: '0.0.0.0' })
  app.log.info(`API running on port ${PORT}`)
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
