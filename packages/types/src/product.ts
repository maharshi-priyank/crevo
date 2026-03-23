export type ProductType =
  | 'digital_download'
  | 'course'
  | 'session_1on1'
  | 'membership'
  | 'bundle'
  | 'webinar'

export interface Product {
  id: string
  creatorId: string
  title: string
  slug: string
  description: string
  coverImageUrl: string | null
  productType: ProductType
  priceInr: number
  comparePriceInr: number | null
  isFree: boolean
  isPublished: boolean
  downloadLimit: number
  maxStudents: number | null
  metadata: Record<string, unknown>
  createdAt: Date
}

export interface ProductFile {
  id: string
  productId: string
  r2Key: string
  filename: string
  fileSizeBytes: number
  mimeType: string
  sortOrder: number
}
