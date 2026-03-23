import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { consumeDownload } from '../services/delivery.service.js'

export async function deliveryRoutes(app: FastifyInstance) {
  /**
   * GET /delivery/:orderId — serve a purchased file download link
   * No auth — orderId acts as the access token (only buyer knows it from email)
   */
  app.get('/delivery/:orderId', async (request: FastifyRequest, reply: FastifyReply) => {
    const { orderId } = request.params as { orderId: string }

    const result = await consumeDownload(orderId)

    return reply.send({
      signedUrl: result.signedUrl,
      downloadsRemaining: result.downloadsRemaining,
      productTitle: result.productTitle,
    })
  })
}
