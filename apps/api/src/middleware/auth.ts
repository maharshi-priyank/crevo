import type { FastifyRequest, FastifyReply } from 'fastify'
import { verifyToken, createClerkClient } from '@clerk/backend'
import { getEnv } from '@creator-os/config'
import { getOrCreateCreator } from '../services/creator.service.js'

let _clerk: ReturnType<typeof createClerkClient> | undefined

function getClerk() {
  if (!_clerk) {
    _clerk = createClerkClient({ secretKey: getEnv().CLERK_SECRET_KEY })
  }
  return _clerk
}

/**
 * Fastify preHandler — verifies Clerk JWT, auto-creates Creator row on first
 * login, and attaches `request.clerkUserId` to the request.
 */
export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    reply.status(401).send({ error: 'Missing authorization header', code: 'UNAUTHORIZED' })
    return
  }

  const token = authHeader.slice(7)
  try {
    const payload = await verifyToken(token, { secretKey: getEnv().CLERK_SECRET_KEY })
    const userId = payload.sub
    if (!userId) {
      reply.status(401).send({ error: 'Invalid token: missing sub', code: 'UNAUTHORIZED' })
      return
    }

    // Auto-create Creator row on first login
    try {
      const clerkUser = await getClerk().users.getUser(userId)
      const email =
        clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ??
        clerkUser.emailAddresses[0]?.emailAddress ??
        ''
      const creator = await getOrCreateCreator(userId, email)
      console.log(`[auth] creator ready: ${creator.id} (${creator.username})`)
    } catch (err) {
      console.error('[auth] getOrCreateCreator failed:', err)
    }

    ;(request as FastifyRequest & { clerkUserId: string }).clerkUserId = userId
  } catch {
    reply.status(401).send({ error: 'Invalid or expired token', code: 'UNAUTHORIZED' })
  }
}
