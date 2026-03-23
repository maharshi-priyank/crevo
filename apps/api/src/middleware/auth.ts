import type { FastifyRequest, FastifyReply } from 'fastify'
import { verifyToken } from '@clerk/backend'
import { getEnv } from '@creator-os/config'

/**
 * Fastify preHandler — verifies Clerk JWT and attaches `request.clerkUserId`.
 * Requirement 14.6: validate Clerk JWT on all authenticated routes.
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
    ;(request as FastifyRequest & { clerkUserId: string }).clerkUserId = userId
  } catch {
    reply.status(401).send({ error: 'Invalid or expired token', code: 'UNAUTHORIZED' })
  }
}
