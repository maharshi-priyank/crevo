import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { requireAuth } from '../middleware/auth.js'
import { getCreatorByClerkId } from '../services/creator.service.js'
import { prisma } from '@creator-os/db'

type AuthRequest = FastifyRequest & { clerkUserId: string }

export async function analyticsRoutes(app: FastifyInstance) {
  /**
   * GET /analytics/overview — dashboard summary stats
   */
  app.get(
    '/analytics/overview',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const creator = await getCreatorByClerkId(clerkUserId)
      if (!creator) return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const [allTimePaid, thisMonthPaid, totalOrders, ordersThisMonth, activeProducts] =
        await Promise.all([
          prisma.order.aggregate({
            where: { creatorId: creator.id, status: { in: ['paid', 'delivered'] } },
            _sum: { amountInr: true },
            _count: true,
          }),
          prisma.order.aggregate({
            where: {
              creatorId: creator.id,
              status: { in: ['paid', 'delivered'] },
              paidAt: { gte: startOfMonth },
            },
            _sum: { amountInr: true },
            _count: true,
          }),
          prisma.order.count({ where: { creatorId: creator.id } }),
          prisma.order.count({
            where: { creatorId: creator.id, createdAt: { gte: startOfMonth } },
          }),
          prisma.product.count({ where: { creatorId: creator.id, isPublished: true, deletedAt: null } }),
        ])

      return reply.send({
        totalRevenue: Number(allTimePaid._sum.amountInr ?? 0),
        revenueThisMonth: Number(thisMonthPaid._sum.amountInr ?? 0),
        totalOrders,
        ordersThisMonth,
        activeProducts,
      })
    },
  )

  /**
   * GET /analytics/revenue — daily revenue for the past N days
   */
  app.get(
    '/analytics/revenue',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const creator = await getCreatorByClerkId(clerkUserId)
      if (!creator) return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })

      const query = request.query as { days?: string }
      const days = Math.min(90, Math.max(7, parseInt(query.days ?? '30', 10)))
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

      const orders = await prisma.order.findMany({
        where: {
          creatorId: creator.id,
          status: { in: ['paid', 'delivered'] },
          paidAt: { gte: since },
        },
        select: { paidAt: true, amountInr: true },
        orderBy: { paidAt: 'asc' },
      })

      // Group by day (YYYY-MM-DD)
      const byDay: Record<string, number> = {}
      for (const order of orders) {
        if (!order.paidAt) continue
        const day = order.paidAt.toISOString().slice(0, 10)
        byDay[day] = (byDay[day] ?? 0) + Number(order.amountInr)
      }

      // Fill in missing days with 0
      const result: { date: string; revenue: number }[] = []
      for (let i = 0; i < days; i++) {
        const d = new Date(since.getTime() + i * 24 * 60 * 60 * 1000)
        const date = d.toISOString().slice(0, 10)
        result.push({ date, revenue: byDay[date] ?? 0 })
      }

      return reply.send(result)
    },
  )
}
