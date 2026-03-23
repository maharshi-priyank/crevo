export type OrderStatus = 'created' | 'paid' | 'delivered' | 'refunded' | 'disputed'

export interface Order {
  id: string
  productId: string
  creatorId: string
  buyerEmail: string
  buyerPhoneHash: string | null
  buyerName: string
  amountInr: number
  platformFeeInr: number
  gstAmountInr: number
  razorpayOrderId: string
  razorpayPaymentId: string | null
  status: OrderStatus
  utmSource: string | null
  utmMedium: string | null
  paidAt: Date | null
  createdAt: Date
}

export interface Delivery {
  id: string
  orderId: string
  signedUrl: string
  urlExpiresAt: Date
  downloadCount: number
  maxDownloads: number
  firstAccessedAt: Date | null
}

export interface Invoice {
  id: string
  orderId: string
  invoiceNumber: string
  pdfR2Key: string
  subtotalInr: number
  cgstInr: number
  sgstInr: number
  igstInr: number
  totalInr: number
  buyerGstin: string | null
  issuedAt: Date
}
