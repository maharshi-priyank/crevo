import { prisma } from '@creator-os/db'
import { DEFAULT_MAX_DOWNLOADS, SIGNED_URL_TTL_HOURS } from '@creator-os/config'
import { generateDownloadUrl } from '../lib/r2.js'

const TTL_SECONDS = SIGNED_URL_TTL_HOURS * 60 * 60

export async function createDelivery(orderId: string, r2Key: string) {
  const signedUrl = await generateDownloadUrl(r2Key, TTL_SECONDS)
  const urlExpiresAt = new Date(Date.now() + TTL_SECONDS * 1000)

  return prisma.delivery.create({
    data: {
      orderId,
      signedUrl,
      urlExpiresAt,
      maxDownloads: DEFAULT_MAX_DOWNLOADS,
    },
  })
}

export async function consumeDownload(orderId: string) {
  const delivery = await prisma.delivery.findUnique({
    where: { orderId },
    include: {
      order: {
        include: {
          product: { include: { files: { orderBy: { sortOrder: 'asc' } } } },
        },
      },
    },
  })

  if (!delivery) {
    throw Object.assign(new Error('Delivery not found'), { statusCode: 404, code: 'NOT_FOUND' })
  }

  if (delivery.downloadCount >= delivery.maxDownloads) {
    throw Object.assign(
      new Error('Download limit reached'),
      { statusCode: 403, code: 'DOWNLOAD_LIMIT_REACHED' },
    )
  }

  let { signedUrl } = delivery

  // Regenerate URL if expired
  if (delivery.urlExpiresAt < new Date()) {
    const firstFile = delivery.order.product.files[0]
    if (!firstFile) throw Object.assign(new Error('No file available'), { statusCode: 404, code: 'NOT_FOUND' })

    signedUrl = await generateDownloadUrl(firstFile.r2Key, TTL_SECONDS)
    const urlExpiresAt = new Date(Date.now() + TTL_SECONDS * 1000)

    await prisma.delivery.update({
      where: { id: delivery.id },
      data: { signedUrl, urlExpiresAt },
    })
  }

  const updated = await prisma.delivery.update({
    where: { id: delivery.id },
    data: {
      downloadCount: { increment: 1 },
      firstAccessedAt: delivery.firstAccessedAt ?? new Date(),
    },
  })

  return {
    signedUrl,
    downloadsRemaining: updated.maxDownloads - updated.downloadCount,
    productTitle: delivery.order.product.title,
    buyerEmail: delivery.order.buyerEmail,
  }
}
