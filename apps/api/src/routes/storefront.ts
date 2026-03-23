import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { requireAuth } from '../middleware/auth.js'
import { getCreatorByUsername, getCreatorByClerkId } from '../services/creator.service.js'
import { prisma } from '@creator-os/db'
import type { StorefrontBlock } from '@creator-os/types'

type AuthRequest = FastifyRequest & { clerkUserId: string }

export async function storefrontRoutes(app: FastifyInstance) {
  /**
   * GET /storefront/:username — public, return creator profile + ordered blocks
   */
  app.get('/storefront/:username', async (request: FastifyRequest, reply: FastifyReply) => {
    const { username } = request.params as { username: string }
    const creator = await getCreatorByUsername(username)
    if (!creator) {
      return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })
    }

    const blocks = (creator.storefrontBlocks as unknown as StorefrontBlock[]) ?? []
    const sorted = [...blocks].sort((a, b) => a.sortOrder - b.sortOrder)

    return reply.send({
      username: creator.username,
      displayName: creator.displayName,
      bio: creator.bio,
      avatarUrl: creator.avatarUrl,
      category: creator.category,
      credilinkScore: creator.credilinkScore,
      isVerified: creator.isVerified,
      themeId: creator.themeId,
      blocks: sorted,
    })
  })

  /**
   * PATCH /storefront/blocks — authenticated, persist block order
   * Requirement 2.2: persist new block order immediately
   */
  app.patch(
    '/storefront/blocks',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const body = request.body as { blocks?: StorefrontBlock[] }

      if (!Array.isArray(body.blocks)) {
        return reply.status(400).send({ error: 'blocks array is required', code: 'VALIDATION_ERROR' })
      }

      const creator = await getCreatorByClerkId(clerkUserId)
      if (!creator) {
        return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })
      }

      // Re-assign sortOrder based on array position
      const blocks: StorefrontBlock[] = body.blocks.map((block, index) => ({
        ...block,
        sortOrder: index,
      }))

      await prisma.creator.update({
        where: { id: creator.id },
        data: { storefrontBlocks: blocks as object[] },
      })

      return reply.send({ blocks })
    },
  )
}
