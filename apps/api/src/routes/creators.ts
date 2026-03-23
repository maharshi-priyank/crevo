import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { requireAuth } from '../middleware/auth.js'
import {
  getCreatorByUsername,
  getCreatorByClerkId,
  updateCreator,
  getOrCreateCreator,
  claimUsername,
  advanceOnboarding,
} from '../services/creator.service.js'
import type { OnboardingStatus, CreatorCategory } from '@creator-os/types'

type AuthRequest = FastifyRequest & { clerkUserId: string }

const USERNAME_REGEX = /^[a-zA-Z0-9]{3,30}$/

export async function creatorRoutes(app: FastifyInstance) {
  /**
   * GET /creators/:username — public profile lookup (no auth)
   */
  app.get('/creators/:username', async (request: FastifyRequest, reply: FastifyReply) => {
    const { username } = request.params as { username: string }
    const creator = await getCreatorByUsername(username)
    if (!creator) {
      return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })
    }
    // Return public fields only
    return reply.send({
      id: creator.id,
      username: creator.username,
      displayName: creator.displayName,
      bio: creator.bio,
      avatarUrl: creator.avatarUrl,
      category: creator.category,
      credilinkScore: creator.credilinkScore,
      isVerified: creator.isVerified,
      storefrontBlocks: creator.storefrontBlocks,
      themeId: creator.themeId,
    })
  })

  /**
   * GET /creators/me — authenticated, return own profile
   */
  app.get(
    '/creators/me',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const creator = await getCreatorByClerkId(clerkUserId)
      if (!creator) {
        return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })
      }
      return reply.send(creator)
    },
  )

  /**
   * POST /creators/me — claim username (first-time setup)
   * Requirement 1.5, 1.6: validate username, return suggestions on conflict
   */
  app.post(
    '/creators/me',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const body = request.body as { username?: string; email?: string }

      // Ensure creator record exists (upsert on first login)
      const email = body.email ?? ''
      await getOrCreateCreator(clerkUserId, email)

      if (!body.username) {
        return reply.status(400).send({ error: 'username is required', code: 'VALIDATION_ERROR' })
      }

      if (!USERNAME_REGEX.test(body.username)) {
        return reply.status(400).send({
          error: 'Username must be 3–30 alphanumeric characters only',
          code: 'VALIDATION_ERROR',
        })
      }

      const result = await claimUsername(clerkUserId, body.username)
      if (!result.success) {
        return reply.status(409).send({
          error: 'Username already taken',
          code: 'USERNAME_CONFLICT',
          suggestions: result.suggestions,
        })
      }

      const creator = await getCreatorByClerkId(clerkUserId)
      return reply.status(201).send(creator)
    },
  )

  /**
   * PATCH /creators/me — authenticated, update profile fields
   * Requirement 1.7: advance onboarding to `kyc` after profile setup
   */
  app.patch(
    '/creators/me',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const body = request.body as {
        displayName?: string
        bio?: string
        category?: CreatorCategory
        avatarUrl?: string
        email?: string
      }

      // Ensure creator exists
      const email = body.email ?? ''
      await getOrCreateCreator(clerkUserId, email)

      const updated = await updateCreator(clerkUserId, {
        displayName: body.displayName,
        bio: body.bio,
        category: body.category,
        avatarUrl: body.avatarUrl,
      })

      // Advance onboarding if profile fields are now set
      if (updated.displayName && updated.onboardingStatus === 'profile') {
        await advanceOnboarding(updated.id, 'kyc')
      }

      return reply.send(updated)
    },
  )

  /**
   * GET /creators/me/onboarding — authenticated, return onboarding status
   */
  app.get(
    '/creators/me/onboarding',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const creator = await getCreatorByClerkId(clerkUserId)
      if (!creator) {
        return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })
      }
      return reply.send({ onboardingStatus: creator.onboardingStatus })
    },
  )

  /**
   * PATCH /creators/me/onboarding — authenticated, advance onboarding step
   */
  app.patch(
    '/creators/me/onboarding',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const body = request.body as { status?: OnboardingStatus }

      if (!body.status) {
        return reply.status(400).send({ error: 'status is required', code: 'VALIDATION_ERROR' })
      }

      const creator = await getCreatorByClerkId(clerkUserId)
      if (!creator) {
        return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })
      }

      const updated = await advanceOnboarding(creator.id, body.status)
      return reply.send({ onboardingStatus: updated.onboardingStatus })
    },
  )
}
