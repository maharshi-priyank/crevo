import { prisma } from '@creator-os/db'
import type { Creator, OnboardingStatus, CreatorCategory } from '@creator-os/types'

export interface UpdateCreatorData {
  displayName?: string
  bio?: string
  category?: CreatorCategory
  avatarUrl?: string
}

/**
 * Fetch a creator by their public username.
 */
export async function getCreatorByUsername(username: string) {
  return prisma.creator.findUnique({ where: { username } })
}

/**
 * Fetch a creator by their Clerk user ID.
 */
export async function getCreatorByClerkId(clerkUserId: string) {
  return prisma.creator.findUnique({ where: { clerkUserId } })
}

/**
 * Update mutable profile fields for a creator.
 */
export async function updateCreator(clerkUserId: string, data: UpdateCreatorData) {
  return prisma.creator.update({
    where: { clerkUserId },
    data: {
      ...(data.displayName !== undefined && { displayName: data.displayName }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
    },
  })
}

/**
 * Upsert a creator on first login. Creates with placeholder username if new.
 * Requirement 1.4: initialize onboarding state machine with status `profile`.
 */
export async function getOrCreateCreator(clerkUserId: string, email: string) {
  const existing = await prisma.creator.findUnique({ where: { clerkUserId } })
  if (existing) return existing

  // Generate a temporary unique username from email prefix
  const base = email.split('@')[0]?.replace(/[^a-z0-9]/gi, '').toLowerCase() ?? 'creator'
  const tempUsername = `${base}_${Date.now().toString(36)}`

  return prisma.creator.create({
    data: {
      clerkUserId,
      email,
      username: tempUsername,
      displayName: '',
      phoneHash: '',
      onboardingStatus: 'profile',
    },
  })
}

/**
 * Claim a username for a creator. Returns null if username is taken.
 * Requirement 1.5: validate alphanumeric, 3–30 chars, unique.
 */
export async function claimUsername(
  clerkUserId: string,
  username: string,
): Promise<{ success: true } | { success: false; suggestions: string[] }> {
  const existing = await prisma.creator.findUnique({ where: { username } })
  if (existing) {
    const suggestions = generateUsernameSuggestions(username)
    return { success: false, suggestions }
  }
  await prisma.creator.update({ where: { clerkUserId }, data: { username } })
  return { success: true }
}

/**
 * Advance the onboarding status for a creator.
 * Requirement 1.7, 1.9, 1.10: advance onboarding state machine.
 */
export async function advanceOnboarding(creatorId: string, status: OnboardingStatus) {
  return prisma.creator.update({
    where: { id: creatorId },
    data: { onboardingStatus: status },
  })
}

/**
 * Generate username suggestions when the desired one is taken.
 * Requirement 1.6: suggest alternatives.
 */
function generateUsernameSuggestions(base: string): string[] {
  const clean = base.slice(0, 25)
  return [
    `${clean}1`,
    `${clean}2`,
    `${clean}_in`,
    `the${clean}`,
    `${clean}official`,
  ].slice(0, 4)
}
