import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { requireAuth } from '../middleware/auth.js'
import { getCreatorByClerkId } from '../services/creator.service.js'
import { getOrdersByCreator } from '../services/order.service.js'

type AuthRequest = FastifyRequest & { clerkUserId: string }

export async function orderRoutes(app: FastifyInstance) {
  /**
   * GET /orders — list creator's orders with pagination
   */
  app.get(
    '/orders',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const creator = await getCreatorByClerkId(clerkUserId)
      if (!creator) return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })

      const query = request.query as { page?: string; limit?: string; status?: string }
      const page = Math.max(1, parseInt(query.page ?? '1', 10))
      const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? '20', 10)))

      const result = await getOrdersByCreator(creator.id, page, limit, query.status)
      return reply.send(result)
    },
  )
}
