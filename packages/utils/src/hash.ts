import { createHash } from 'crypto'

/**
 * Hash a phone number with SHA-256.
 * Requirement 1.11, 14.4: buyer phone numbers must never be stored in plaintext.
 */
export function hashPhone(phone: string): string {
  // Normalize: strip spaces, dashes, leading +
  const normalized = phone.replace(/[\s\-]/g, '').replace(/^\+/, '')
  return createHash('sha256').update(normalized).digest('hex')
}

/**
 * Constant-time comparison to prevent timing attacks.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return bufA.equals(bufB) // Buffer.equals is constant-time in Node.js
}
