import { prisma } from '@creator-os/db'
import { GST_RATE, PLATFORM_FEE_PERCENT } from '@creator-os/config'
import { getRazorpay } from '../lib/razorpay.js'
import { emailDispatchQueue } from '../queues/index.js'
import { createDelivery } from './delivery.service.js'
import { createHmac } from 'crypto'
import { getEnv } from '@creator-os/config'

export interface CreateOrderInput {
  productId: string
  buyerEmail: string
  buyerName: string
  utmSource?: string
  utmMedium?: string
}

export async function createRazorpayOrder(input: CreateOrderInput) {
  const product = await prisma.product.findFirst({
    where: { id: input.productId, isPublished: true, deletedAt: null },
  })
  if (!product) {
    throw Object.assign(new Error('Product not found or unavailable'), { statusCode: 404, code: 'NOT_FOUND' })
  }

  const priceInr = Number(product.priceInr)
  const platformFeeInr = parseFloat((priceInr * PLATFORM_FEE_PERCENT).toFixed(2))
  const gstAmountInr = parseFloat((priceInr * GST_RATE).toFixed(2))
  const totalInr = parseFloat((priceInr + gstAmountInr).toFixed(2))
  const amountPaise = Math.round(totalInr * 100)

  const razorpay = getRazorpay()
  const rzpOrder = await razorpay.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  })

  const order = await prisma.order.create({
    data: {
      productId: input.productId,
      creatorId: product.creatorId,
      buyerEmail: input.buyerEmail,
      buyerName: input.buyerName,
      amountInr: totalInr,
      platformFeeInr,
      gstAmountInr,
      razorpayOrderId: rzpOrder.id,
      status: 'created',
      utmSource: input.utmSource ?? null,
      utmMedium: input.utmMedium ?? null,
    },
  })

  return {
    orderId: order.id,
    razorpayOrderId: rzpOrder.id,
    amount: amountPaise,
    currency: 'INR',
    keyId: getEnv().RAZORPAY_KEY_ID,
  }
}

export async function verifyAndMarkPaid(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string,
) {
  const env = getEnv()
  const expectedSig = createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')

  if (expectedSig !== signature) {
    throw Object.assign(new Error('Invalid payment signature'), { statusCode: 400, code: 'INVALID_SIGNATURE' })
  }

  const order = await prisma.order.findUnique({ where: { razorpayOrderId } })
  if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404, code: 'NOT_FOUND' })
  if (order.status !== 'created') {
    // Already processed — idempotent
    return order
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'paid',
      razorpayPaymentId,
      paidAt: new Date(),
    },
  })

  // Generate delivery and enqueue email
  await _triggerDelivery(updated.id)

  return updated
}

export async function processWebhookPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
) {
  const order = await prisma.order.findUnique({ where: { razorpayOrderId } })
  if (!order) return // webhook for unknown order — ignore

  // Idempotency: skip if already paid
  if (order.razorpayPaymentId) return

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'paid',
      razorpayPaymentId,
      paidAt: new Date(),
    },
  })

  await _triggerDelivery(order.id)
}

async function _triggerDelivery(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: { include: { files: { orderBy: { sortOrder: 'asc' } } } } },
  })
  if (!order) return

  const firstFile = order.product.files[0]
  if (!firstFile) return // no files to deliver (e.g. coaching slot)

  const delivery = await createDelivery(orderId, firstFile.r2Key)

  await emailDispatchQueue.add('send-delivery-email', {
    orderId,
    buyerEmail: order.buyerEmail,
    signedUrl: delivery.signedUrl,
  })
}

export async function getOrdersByCreator(
  creatorId: string,
  page = 1,
  limit = 20,
  status?: string,
) {
  const where = {
    creatorId,
    ...(status ? { status: status as 'created' | 'paid' | 'delivered' | 'refunded' | 'disputed' } : {}),
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { product: { select: { title: true, productType: true } } },
    }),
    prisma.order.count({ where }),
  ])

  return { orders, total, page, limit }
}
