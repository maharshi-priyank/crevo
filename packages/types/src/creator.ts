export type CreatorCategory =
  | 'education'
  | 'music'
  | 'fitness'
  | 'art'
  | 'photography'
  | 'cooking'
  | 'finance'
  | 'tech'
  | 'other'

export type OnboardingStatus =
  | 'profile'
  | 'kyc'
  | 'bank_account'
  | 'first_product'
  | 'complete'

export type PlanTier = 'free' | 'starter' | 'pro' | 'business'

export interface Creator {
  id: string
  username: string
  email: string
  phoneHash: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  category: CreatorCategory
  customDomain: string | null
  razorpayAccountId: string | null
  clerkUserId: string
  credilinkScore: number
  onboardingStatus: OnboardingStatus
  planTier: PlanTier
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface StorefrontBlock {
  id: string
  type: 'hero' | 'product_grid' | 'text' | 'social_links' | 'testimonials' | 'whatsapp_cta' | 'link'
  sortOrder: number
  config: Record<string, unknown>
}
