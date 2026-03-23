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

    const allBlocks = (creator.storefrontBlocks as unknown as StorefrontBlock[]) ?? []
    const sorted = [...allBlocks].filter(b => (b as unknown as { type: string }).type !== '__settings__').sort((a, b) => a.sortOrder - b.sortOrder)

    // Extract page settings stored in the hidden __settings__ entry
    const settingsEntry = (allBlocks as unknown as { type: string; config?: Record<string, string> }[])
      .find(b => b.type === '__settings__')
    const pageSettings = settingsEntry?.config
      ? {
          accent:        settingsEntry.config.accent        ?? '#a8a4ff',
          bgStyle:       settingsEntry.config.bgStyle        ?? 'dark',
          buttonStyle:   settingsEntry.config.buttonStyle   ?? 'filled',
          cornerRadius:  settingsEntry.config.cornerRadius  ?? 'medium',
          fontPair:      settingsEntry.config.fontPair       ?? 'default',
          productLayout: settingsEntry.config.productLayout ?? 'list',
        }
      : null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products = ((creator.products ?? []) as any[]).map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug ?? p.id,
      description: p.description ?? '',
      coverImageUrl: p.coverImageUrl,
      productType: p.productType,
      priceInr: Number(p.priceInr),
      comparePriceInr: p.comparePriceInr ? Number(p.comparePriceInr) : null,
      isFree: p.isFree,
    }))

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
      products,
      socialLinks: [],
      pageSettings,
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
