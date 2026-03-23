import { Worker } from 'bullmq'
import { prisma } from '@creator-os/db'
import { DEFAULT_MAX_DOWNLOADS } from '@creator-os/config'
import { getEnv } from '@creator-os/config'
import type { EmailDispatchJobData } from '../index.js'
import { sendDeliveryEmail } from '../../services/email.service.js'

function getConnectionConfig() {
  const env = getEnv()
  const url = new URL(env.REDIS_URL)
  const isSecure = url.protocol === 'rediss:'
  return {
    host: url.hostname,
    port: parseInt(url.port || '6379', 10),
    password: url.password || undefined,
    username: url.username || undefined,
    ...(isSecure ? { tls: { rejectUnauthorized: false } } : {}),
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  }
}

export function startEmailWorker() {
  const worker = new Worker<EmailDispatchJobData>(
    'email-dispatch',
    async (job) => {
      const { orderId, buyerEmail, signedUrl } = job.data

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          product: true,
          creator: true,
        },
      })

      if (!order) {
        throw new Error(`Order ${orderId} not found`)
      }

      await sendDeliveryEmail({
        to: buyerEmail,
        buyerName: order.buyerName,
        productTitle: order.product.title,
        creatorName: order.creator.displayName,
        deliveryUrl: signedUrl,
        downloadsRemaining: DEFAULT_MAX_DOWNLOADS,
      })

      // Mark order as delivered
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'delivered' },
      })
    },
    { connection: getConnectionConfig() },
  )

  worker.on('error', () => { /* suppress connection noise in dev */ })
  worker.on('failed', (job, err) => {
    console.error(`[email-worker] Job ${job?.id} failed:`, err.message)
  })

  worker.on('completed', (job) => {
    console.log(`[email-worker] Job ${job.id} completed for order ${job.data.orderId}`)
  })

  return worker
}
