export type CredilinkBadge = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface CredilinkScore {
  creatorId: string
  total: number
  breakdown: {
    sales: number        // 30% weight
    rating: number       // 25% weight
    fulfillment: number  // 20% weight
    authenticity: number // 15% weight
    profile: number      // 10% weight
  }
  badge: CredilinkBadge
  lastCalculatedAt: Date
}

export interface CredilinkEvent {
  id: string
  creatorId: string
  eventType: 'order_completed' | 'rating_received' | 'kyc_completed' | 'refund_issued' | 'dispute_raised'
  scoreDelta: number
  scoreAfter: number
  reason: string
  createdAt: Date
}
