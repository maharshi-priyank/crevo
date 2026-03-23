import { Queue } from 'bullmq'
import { getEnv } from '@creator-os/config'

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

// Retry config: 3 attempts with exponential backoff
// Requirement 4.7, 15.5: retry up to 3 times with exponential backoff
const defaultJobOptions = {
  attempts: 3,
  backoff: { type: 'exponential' as const, delay: 2000 },
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 },
}

export const gstInvoiceQueue = new Queue('gst-invoice', {
  connection: getConnectionConfig(),
  defaultJobOptions,
})

export const emailDispatchQueue = new Queue('email-dispatch', {
  connection: getConnectionConfig(),
  defaultJobOptions,
})

export const waDispatchQueue = new Queue('wa-dispatch', {
  connection: getConnectionConfig(),
  defaultJobOptions,
})

export type GstInvoiceJobData = {
  orderId: string
}

export type EmailDispatchJobData = {
  orderId: string
  buyerEmail: string
  signedUrl: string
}

export type WaDispatchJobData = {
  orderId: string
  buyerPhoneHash: string
  signedUrl: string
}
