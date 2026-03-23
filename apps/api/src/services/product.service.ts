import { prisma } from '@creator-os/db'
import { PLAN_LIMITS } from '@creator-os/config/constants'
import type { ProductType } from '@creator-os/types'
import { generateUploadUrl, removeObject } from '../lib/r2.js'
import { getEnv } from '@creator-os/config'
import { randomUUID } from 'crypto'

export interface CreateProductData {
  title: string
  productType: ProductType
  priceInr: number
  description?: string
  comparePriceInr?: number
  isFree?: boolean
}

export interface UpdateProductData {
  title?: string
  description?: string
  priceInr?: number
  comparePriceInr?: number
  isFree?: boolean
  isPublished?: boolean
  coverImageUrl?: string
  downloadLimit?: number
  maxStudents?: number
  metadata?: Record<string, unknown>
}

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
  return `${base}-${Date.now().toString(36)}`
}

export async function createProduct(creatorId: string, data: CreateProductData) {
  // Enforce plan product limits
  const creator = await prisma.creator.findUnique({ where: { id: creatorId } })
  if (!creator) throw Object.assign(new Error('Creator not found'), { statusCode: 404, code: 'NOT_FOUND' })

  const limit = PLAN_LIMITS[creator.planTier as keyof typeof PLAN_LIMITS]?.products ?? 3
  const existingCount = await prisma.product.count({
    where: { creatorId, deletedAt: null },
  })
  if (existingCount >= limit) {
    throw Object.assign(
      new Error(`Plan limit reached. Upgrade to add more than ${limit} products.`),
      { statusCode: 403, code: 'PLAN_LIMIT_REACHED' },
    )
  }

  const product = await prisma.product.create({
    data: {
      creatorId,
      title: data.title,
      slug: generateSlug(data.title),
      description: data.description ?? '',
      productType: data.productType,
      priceInr: data.priceInr,
      comparePriceInr: data.comparePriceInr ?? null,
      isFree: data.isFree ?? false,
      isPublished: false,
    },
    include: { files: true },
  })

  // Advance onboarding to first_product if still at an earlier stage
  if (['profile', 'kyc', 'bank_account'].includes(creator.onboardingStatus)) {
    await prisma.creator.update({
      where: { id: creatorId },
      data: { onboardingStatus: 'first_product' },
    })
  }

  return product
}

export async function getProductsByCreator(creatorId: string) {
  return prisma.product.findMany({
    where: { creatorId, deletedAt: null },
    include: { files: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProductById(productId: string, creatorId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, creatorId, deletedAt: null },
    include: { files: { orderBy: { sortOrder: 'asc' } } },
  })
  if (!product) throw Object.assign(new Error('Product not found'), { statusCode: 404, code: 'NOT_FOUND' })
  return product
}

export async function getPublicProduct(productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, isPublished: true, deletedAt: null },
    include: { files: { orderBy: { sortOrder: 'asc' } } },
  })
  if (!product) throw Object.assign(new Error('Product not found'), { statusCode: 404, code: 'NOT_FOUND' })
  return product
}

export async function updateProduct(productId: string, creatorId: string, data: UpdateProductData) {
  const existing = await prisma.product.findFirst({ where: { id: productId, creatorId, deletedAt: null } })
  if (!existing) throw Object.assign(new Error('Product not found'), { statusCode: 404, code: 'NOT_FOUND' })

  return prisma.product.update({
    where: { id: productId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.priceInr !== undefined && { priceInr: data.priceInr }),
      ...(data.comparePriceInr !== undefined && { comparePriceInr: data.comparePriceInr }),
      ...(data.isFree !== undefined && { isFree: data.isFree }),
      ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      ...(data.coverImageUrl !== undefined && { coverImageUrl: data.coverImageUrl }),
      ...(data.downloadLimit !== undefined && { downloadLimit: data.downloadLimit }),
      ...(data.maxStudents !== undefined && { maxStudents: data.maxStudents }),
      ...(data.metadata !== undefined && { metadata: data.metadata }),
    },
    include: { files: { orderBy: { sortOrder: 'asc' } } },
  })
}

export async function softDeleteProduct(productId: string, creatorId: string) {
  const existing = await prisma.product.findFirst({ where: { id: productId, creatorId, deletedAt: null } })
  if (!existing) throw Object.assign(new Error('Product not found'), { statusCode: 404, code: 'NOT_FOUND' })

  // Delete all associated files from R2
  const files = await prisma.productFile.findMany({ where: { productId } })
  await Promise.all(files.map((f) => removeObject(f.r2Key).catch(() => null)))

  await prisma.product.update({
    where: { id: productId },
    data: { deletedAt: new Date() },
  })
}

export async function generateProductUploadUrl(
  productId: string,
  creatorId: string,
  filename: string,
  contentType: string,
  isCover = false,
): Promise<{ uploadUrl: string; r2Key: string; publicUrl?: string }> {
  // Confirm product belongs to creator
  const product = await prisma.product.findFirst({ where: { id: productId, creatorId, deletedAt: null } })
  if (!product) throw Object.assign(new Error('Product not found'), { statusCode: 404, code: 'NOT_FOUND' })

  const ext = filename.split('.').pop() ?? 'bin'
  const r2Key = isCover
    ? `covers/${productId}/cover.${ext}`
    : `products/${productId}/${randomUUID()}.${ext}`
  const uploadUrl = await generateUploadUrl(r2Key, contentType)

  const r2PublicBase = getEnv().R2_PUBLIC_URL
  const publicUrl = r2PublicBase && r2PublicBase !== 'http://localhost'
    ? `${r2PublicBase}/${r2Key}`
    : undefined

  return { uploadUrl, r2Key, publicUrl }
}

export interface FinalizeFileData {
  r2Key: string
  filename: string
  fileSizeBytes: number
  mimeType: string
}

export async function finalizeFileUpload(productId: string, creatorId: string, data: FinalizeFileData) {
  // Confirm product belongs to creator
  const product = await prisma.product.findFirst({ where: { id: productId, creatorId, deletedAt: null } })
  if (!product) throw Object.assign(new Error('Product not found'), { statusCode: 404, code: 'NOT_FOUND' })

  // Count existing files to set sortOrder
  const existingCount = await prisma.productFile.count({ where: { productId } })

  return prisma.productFile.create({
    data: {
      productId,
      r2Key: data.r2Key,
      filename: data.filename,
      fileSizeBytes: data.fileSizeBytes,
      mimeType: data.mimeType,
      sortOrder: existingCount,
    },
  })
}

export async function deleteProductFile(fileId: string, productId: string, creatorId: string) {
  const product = await prisma.product.findFirst({ where: { id: productId, creatorId, deletedAt: null } })
  if (!product) throw Object.assign(new Error('Product not found'), { statusCode: 404, code: 'NOT_FOUND' })

  const file = await prisma.productFile.findFirst({ where: { id: fileId, productId } })
  if (!file) throw Object.assign(new Error('File not found'), { statusCode: 404, code: 'NOT_FOUND' })

  await removeObject(file.r2Key).catch(() => null) // best-effort R2 delete
  await prisma.productFile.delete({ where: { id: fileId } })
}
