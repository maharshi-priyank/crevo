import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { createHmac } from 'crypto'
import { getEnv } from '@creator-os/config'
import { processWebhookPayment } from '../services/order.service.js'

export async function webhookRoutes(app: FastifyInstance) {
  /**
   * POST /webhooks/razorpay — receive Razorpay payment events
   * Requires raw body for signature verification — add addContentTypeParser for 'application/json'
   */
  app.post(
    '/webhooks/razorpay',
    { config: { rawBody: true } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const env = getEnv()
      const signature = request.headers['x-razorpay-signature'] as string | undefined

      if (!signature) {
        return reply.status(400).send({ error: 'Missing signature header' })
      }

      // Verify HMAC-SHA256 signature using raw body
      const rawBody = (request as FastifyRequest & { rawBody?: Buffer }).rawBody
      if (!rawBody) {
        return reply.status(400).send({ error: 'Raw body unavailable' })
      }

      const expectedSig = createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex')

      if (expectedSig !== signature) {
        app.log.warn('Razorpay webhook signature mismatch')
        return reply.status(400).send({ error: 'Invalid signature' })
      }

      // Parse and handle event
      const event = request.body as {
        event?: string
        payload?: {
          payment?: {
            entity?: {
              order_id?: string
              id?: string
            }
          }
        }
      }

      // Respond 200 immediately — do not await async processing
      reply.status(200).send({ received: true })

      if (event.event === 'payment.captured') {
        const entity = event.payload?.payment?.entity
        if (entity?.order_id && entity?.id) {
          await processWebhookPayment(entity.order_id, entity.id).catch((err) =>
            app.log.error({ err }, 'webhook payment processing failed'),
          )
        }
      }
    },
  )
}
