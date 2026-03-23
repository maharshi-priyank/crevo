// Load .env file in development (tsx doesn't auto-load env files)
import { config } from 'dotenv'
config()

import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import { getEnv } from '@creator-os/config'
import { creatorRoutes } from './routes/creators.js'
import { storefrontRoutes } from './routes/storefront.js'

// Validate env at startup — fail fast
const env = getEnv()

const app = Fastify({
  logger: env.NODE_ENV !== 'production'
    ? { level: 'debug', transport: { target: 'pino-pretty' } }
    : { level: 'info' },
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

  // ─── Routes ─────────────────────────────────────────────────────────────────

  await app.register(creatorRoutes)
  await app.register(storefrontRoutes)

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

  // ─── Start ─────────────────────────────────────────────────────────────────

  const PORT = parseInt(process.env['PORT'] ?? '4000', 10)
  await app.listen({ port: PORT, host: '0.0.0.0' })
  app.log.info(`API running on port ${PORT}`)
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
