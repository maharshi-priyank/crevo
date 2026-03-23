import { Queue } from 'bullmq'
import { getEnv } from '@creator-os/config'

function getConnectionConfig() {
  const env = getEnv()
  // Parse Upstash Redis URL for BullMQ connection
  const url = new URL(env.UPSTASH_REDIS_REST_URL)
  return {
    host: url.hostname,
    port: parseInt(url.port || '6379', 10),
    password: env.UPSTASH_REDIS_REST_TOKEN,
    tls: {},
    maxRetriesPerRequest: null,
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
