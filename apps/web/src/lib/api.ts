'use client'

/**
 * Centralized API client for the Crevo web app.
 * All functions require a Clerk session token passed from the calling component.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiFetch<T>(
  path: string,
  token: string | null,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.error ?? res.statusText, body.code)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

// ─── Creator / Profile ────────────────────────────────────────────────────────

export async function getMyProfile(token: string) {
  return apiFetch('/creators/me', token)
}

export async function claimUsername(token: string, username: string, email: string) {
  return apiFetch('/creators/me', token, {
    method: 'POST',
    body: JSON.stringify({ username, email }),
  })
}

export async function updateProfile(
  token: string,
  data: {
    displayName?: string
    bio?: string
    category?: string
    avatarUrl?: string
    email?: string
  },
) {
  return apiFetch('/creators/me', token, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function getOnboardingStatus(token: string) {
  return apiFetch<{ onboardingStatus: string }>('/creators/me/onboarding', token)
}

export async function advanceOnboarding(token: string, status: string) {
  return apiFetch('/creators/me/onboarding', token, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getMyProducts(token: string) {
  return apiFetch('/products/me', token)
}

export async function getPublicProduct(productId: string) {
  return apiFetch(`/products/${productId}/public`, null)
}

export async function createProduct(
  token: string,
  data: {
    title: string
    productType: string
    priceInr: number
    description?: string
    comparePriceInr?: number
    isFree?: boolean
  },
) {
  return apiFetch('/products', token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateProduct(
  token: string,
  productId: string,
  data: {
    title?: string
    description?: string
    priceInr?: number
    comparePriceInr?: number
    isFree?: boolean
    isPublished?: boolean
    coverImageUrl?: string
    downloadLimit?: number
    metadata?: Record<string, unknown>
  },
) {
  return apiFetch(`/products/${productId}`, token, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteProduct(token: string, productId: string) {
  return apiFetch(`/products/${productId}`, token, { method: 'DELETE' })
}

export async function getUploadUrl(
  token: string,
  productId: string,
  filename: string,
  contentType: string,
  type?: 'cover',
): Promise<{ uploadUrl: string; r2Key: string; publicUrl?: string }> {
  const qs = type ? `?type=${type}` : ''
  return apiFetch(`/products/${productId}/upload-url${qs}`, token, {
    method: 'POST',
    body: JSON.stringify({ filename, contentType }),
  })
}

export async function finalizeFileUpload(
  token: string,
  productId: string,
  data: { r2Key: string; filename: string; fileSizeBytes: number; mimeType: string },
) {
  return apiFetch(`/products/${productId}/files`, token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function deleteProductFile(token: string, productId: string, fileId: string) {
  return apiFetch(`/products/${productId}/files/${fileId}`, token, { method: 'DELETE' })
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export async function createCheckout(data: {
  productId: string
  buyerEmail: string
  buyerName: string
  utmSource?: string
  utmMedium?: string
}): Promise<{ orderId: string; razorpayOrderId: string; amount: number; currency: string; keyId: string }> {
  return apiFetch('/checkout/create', null, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function verifyPayment(data: {
  razorpayOrderId: string
  razorpayPaymentId: string
  signature: string
}): Promise<{ orderId: string; status: string }> {
  return apiFetch('/checkout/verify', null, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getOrders(
  token: string,
  params: { page?: number; limit?: number; status?: string } = {},
) {
  const q = new URLSearchParams()
  if (params.page) q.set('page', String(params.page))
  if (params.limit) q.set('limit', String(params.limit))
  if (params.status) q.set('status', params.status)
  return apiFetch(`/orders?${q.toString()}`, token)
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getAnalyticsOverview(
  token: string,
): Promise<{
  totalRevenue: number
  revenueThisMonth: number
  totalOrders: number
  ordersThisMonth: number
  activeProducts: number
}> {
  return apiFetch('/analytics/overview', token)
}

export async function getRevenueChart(token: string, days = 30) {
  return apiFetch<{ date: string; revenue: number }[]>(`/analytics/revenue?days=${days}`, token)
}

// ─── Storefront blocks ───────────────────────────────────────────────────────

export async function saveStorefrontBlocks(token: string, blocks: unknown[]) {
  return apiFetch('/storefront/blocks', token, {
    method: 'PATCH',
    body: JSON.stringify({ blocks }),
  })
}

// ─── Delivery ─────────────────────────────────────────────────────────────────

export async function getDelivery(
  orderId: string,
): Promise<{ signedUrl: string; downloadsRemaining: number; productTitle: string }> {
  return apiFetch(`/delivery/${orderId}`, null)
}

export { ApiError }
