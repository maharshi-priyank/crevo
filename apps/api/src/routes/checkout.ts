import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { createRazorpayOrder, verifyAndMarkPaid } from '../services/order.service.js'

export async function checkoutRoutes(app: FastifyInstance) {
  /**
   * POST /checkout/create — create a Razorpay order for a product (buyer-facing, no auth)
   */
  app.post('/checkout/create', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as {
      productId?: string
      buyerEmail?: string
      buyerName?: string
      utmSource?: string
      utmMedium?: string
    }

    if (!body.productId || !body.buyerEmail || !body.buyerName) {
      return reply.status(400).send({
        error: 'productId, buyerEmail, and buyerName are required',
        code: 'VALIDATION_ERROR',
      })
    }

    const result = await createRazorpayOrder({
      productId: body.productId,
      buyerEmail: body.buyerEmail,
      buyerName: body.buyerName,
      utmSource: body.utmSource,
      utmMedium: body.utmMedium,
    })

    return reply.status(201).send(result)
  })

  /**
   * POST /checkout/verify — verify Razorpay payment signature after checkout (buyer-facing, no auth)
   */
  app.post('/checkout/verify', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as {
      razorpayOrderId?: string
      razorpayPaymentId?: string
      signature?: string
    }

    if (!body.razorpayOrderId || !body.razorpayPaymentId || !body.signature) {
      return reply.status(400).send({
        error: 'razorpayOrderId, razorpayPaymentId, and signature are required',
        code: 'VALIDATION_ERROR',
      })
    }

    const order = await verifyAndMarkPaid(
      body.razorpayOrderId,
      body.razorpayPaymentId,
      body.signature,
    )

    return reply.send({ orderId: order.id, status: order.status })
  })
}
