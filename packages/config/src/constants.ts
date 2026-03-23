// Platform fee percentage (5%)
export const PLATFORM_FEE_PERCENT = 0.05

// GST rates
export const GST_RATE = 0.18
export const CGST_RATE = 0.09
export const SGST_RATE = 0.09
export const IGST_RATE = 0.18

// Download limits
export const DEFAULT_MAX_DOWNLOADS = 3
export const SIGNED_URL_TTL_HOURS = 24

// Rate limiting
export const RATE_LIMIT_REQUESTS = 100
export const RATE_LIMIT_WINDOW_SECONDS = 60

// AI cache TTL
export const AI_CACHE_TTL_SECONDS = 60 * 60 * 24 // 24 hours

// Plan product limits
export const PLAN_LIMITS = {
  free: { products: 3, commissionPercent: 10 },
  starter: { products: 10, commissionPercent: 7 },
  pro: { products: 50, commissionPercent: 5 },
  business: { products: Infinity, commissionPercent: 3 },
} as const

export type PlanTier = keyof typeof PLAN_LIMITS

// Plan pricing (INR/month)
export const PLAN_PRICES: Record<PlanTier, number> = {
  free: 0,
  starter: 199,
  pro: 499,
  business: 1299,
}
