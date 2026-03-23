import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { requireAuth } from '../middleware/auth.js'
import {
  createProduct,
  getProductsByCreator,
  getProductById,
  getPublicProduct,
  updateProduct,
  softDeleteProduct,
  generateProductUploadUrl,
  finalizeFileUpload,
  deleteProductFile,
} from '../services/product.service.js'
import { getCreatorByClerkId } from '../services/creator.service.js'
import type { ProductType } from '@creator-os/types'

type AuthRequest = FastifyRequest & { clerkUserId: string }

export async function productRoutes(app: FastifyInstance) {
  /**
   * POST /products — create a new product
   */
  app.post(
    '/products',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const creator = await getCreatorByClerkId(clerkUserId)
      if (!creator) return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })

      const body = request.body as {
        title?: string
        productType?: ProductType
        priceInr?: number
        description?: string
        comparePriceInr?: number
        isFree?: boolean
      }

      if (!body.title || typeof body.title !== 'string') {
        return reply.status(400).send({ error: 'title is required', code: 'VALIDATION_ERROR' })
      }
      if (!body.productType) {
        return reply.status(400).send({ error: 'productType is required', code: 'VALIDATION_ERROR' })
      }
      if (body.priceInr === undefined || typeof body.priceInr !== 'number') {
        return reply.status(400).send({ error: 'priceInr is required', code: 'VALIDATION_ERROR' })
      }

      const product = await createProduct(creator.id, {
        title: body.title,
        productType: body.productType,
        priceInr: body.priceInr,
        description: body.description,
        comparePriceInr: body.comparePriceInr,
        isFree: body.isFree,
      })

      return reply.status(201).send(product)
    },
  )

  /**
   * GET /products/me — list authenticated creator's products
   */
  app.get(
    '/products/me',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const creator = await getCreatorByClerkId(clerkUserId)
      if (!creator) return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })

      const products = await getProductsByCreator(creator.id)
      return reply.send(products)
    },
  )

  /**
   * GET /products/:id/public — public product detail (for checkout page, no auth)
   */
  app.get('/products/:id/public', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const product = await getPublicProduct(id)
    // Return public fields only (no internal r2Keys)
    return reply.send({
      id: product.id,
      title: product.title,
      description: product.description,
      productType: product.productType,
      priceInr: Number(product.priceInr),
      comparePriceInr: product.comparePriceInr ? Number(product.comparePriceInr) : null,
      isFree: product.isFree,
      coverImageUrl: product.coverImageUrl,
      downloadLimit: product.downloadLimit,
      fileCount: product.files.length,
    })
  })

  /**
   * GET /products/:id — get single product for authenticated creator
   */
  app.get(
    '/products/:id',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const { id } = request.params as { id: string }
      const creator = await getCreatorByClerkId(clerkUserId)
      if (!creator) return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })
      const product = await getProductById(id, creator.id)
      return reply.send(product)
    },
  )

  /**
   * PATCH /products/:id — update product fields
   */
  app.patch(
    '/products/:id',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const { id } = request.params as { id: string }
      const creator = await getCreatorByClerkId(clerkUserId)
      if (!creator) return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })

      const body = request.body as {
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

      const product = await updateProduct(id, creator.id, body)
      return reply.send(product)
    },
  )

  /**
   * DELETE /products/:id — soft delete
   */
  app.delete(
    '/products/:id',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const { id } = request.params as { id: string }
      const creator = await getCreatorByClerkId(clerkUserId)
      if (!creator) return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })

      await softDeleteProduct(id, creator.id)
      return reply.status(204).send()
    },
  )

  /**
   * POST /products/:id/upload-url — get R2 presigned PUT URL for direct browser upload
   */
  app.post(
    '/products/:id/upload-url',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const { id } = request.params as { id: string }
      const creator = await getCreatorByClerkId(clerkUserId)
      if (!creator) return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })

      const body = request.body as { filename?: string; contentType?: string }
      if (!body.filename || !body.contentType) {
        return reply.status(400).send({ error: 'filename and contentType are required', code: 'VALIDATION_ERROR' })
      }

      const query = request.query as { type?: string }
      const isCover = query.type === 'cover'
      const { uploadUrl, r2Key, publicUrl } = await generateProductUploadUrl(id, creator.id, body.filename, body.contentType, isCover)
      return reply.send({ uploadUrl, r2Key, publicUrl })
    },
  )

  /**
   * POST /products/:id/files — finalize file upload after direct R2 upload
   */
  app.post(
    '/products/:id/files',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const { id } = request.params as { id: string }
      const creator = await getCreatorByClerkId(clerkUserId)
      if (!creator) return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })

      const body = request.body as {
        r2Key?: string
        filename?: string
        fileSizeBytes?: number
        mimeType?: string
      }

      if (!body.r2Key || !body.filename || body.fileSizeBytes === undefined || !body.mimeType) {
        return reply.status(400).send({ error: 'r2Key, filename, fileSizeBytes, mimeType are required', code: 'VALIDATION_ERROR' })
      }

      const file = await finalizeFileUpload(id, creator.id, {
        r2Key: body.r2Key,
        filename: body.filename,
        fileSizeBytes: body.fileSizeBytes,
        mimeType: body.mimeType,
      })

      return reply.status(201).send(file)
    },
  )

  /**
   * DELETE /products/:id/files/:fileId — delete a product file
   */
  app.delete(
    '/products/:id/files/:fileId',
    { preHandler: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { clerkUserId } = request as AuthRequest
      const { id, fileId } = request.params as { id: string; fileId: string }
      const creator = await getCreatorByClerkId(clerkUserId)
      if (!creator) return reply.status(404).send({ error: 'Creator not found', code: 'NOT_FOUND' })

      await deleteProductFile(fileId, id, creator.id)
      return reply.status(204).send()
    },
  )
}
