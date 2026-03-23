'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { getPublicProduct, createCheckout, verifyPayment } from '@/lib/api'

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/></svg> },
  { id: 'card', label: 'CARD', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id: 'bank', label: 'BANK', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { id: 'wallet', label: 'WALLET', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg> },
]

interface PublicProduct {
  id: string
  title: string
  priceInr: number
  comparePriceInr: number | null
  isFree: boolean
  description: string
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void }
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.productId as string

  const [product, setProduct] = useState<PublicProduct | null>(null)
  const [payMethod, setPayMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!productId) return
    getPublicProduct(productId).then((data) => setProduct(data as PublicProduct)).catch(() => {
      setError('Product not found.')
    })
  }, [productId])

  const gstRate = 0.18
  const basePrice = product?.priceInr ?? 0
  const gstAmount = +(basePrice * gstRate).toFixed(2)
  const totalAmount = +(basePrice + gstAmount).toFixed(2)
  const discountPct = product?.comparePriceInr
    ? Math.round((1 - basePrice / product.comparePriceInr) * 100)
    : 0

  async function handlePay() {
    if (!product || !buyerEmail || !buyerName) {
      setError('Please enter your name and email to continue.')
      return
    }
    setError('')
    setPaying(true)

    try {
      const order = await createCheckout({ productId: product.id, buyerEmail, buyerName })

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: 'Crevo',
        description: product.title,
        prefill: { name: buyerName, email: buyerEmail },
        theme: { color: '#a8a4ff' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            })
            router.push(`/payment/success?orderId=${order.orderId}`)
          } catch {
            router.push('/payment/failed')
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      })

      rzp.open()
    } catch {
      setError('Failed to initiate payment. Please try again.')
      setPaying(false)
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div style={{ minHeight: '100vh', background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', maxWidth: 420, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#7b76e8,#a8a4ff)' }} />
            <div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>Secure Checkout</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Crevo</p>
            </div>
          </div>
          <Link href="/" style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e3e2e0" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </Link>
        </div>

        {/* Product + price header */}
        {product && (
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 10px', lineHeight: 1.2 }}>{product.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 700, color: '#e3e2e0' }}>₹{basePrice.toLocaleString('en-IN')}</span>
              {product.comparePriceInr && (
                <>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(227,226,224,0.4)', textDecoration: 'line-through' }}>₹{product.comparePriceInr.toLocaleString('en-IN')}</span>
                  <span style={{ padding: '3px 10px', borderRadius: 8, background: 'rgba(168,164,255,0.15)', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: '#a8a4ff' }}>{discountPct}% OFF</span>
                </>
              )}
            </div>
          </div>
        )}

        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>

          {/* Buyer details */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>YOUR DETAILS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input type="text" value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Your full name"
                style={{ width: '100%', padding: '13px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              <input type="email" value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} placeholder="Email for delivery"
                style={{ width: '100%', padding: '13px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* Order summary */}
          {product && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>ORDER SUMMARY</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.6)' }}>Product Base</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#e3e2e0' }}>₹{basePrice.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.6)' }}>GST (18%)</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#e3e2e0' }}>₹{gstAmount.toFixed(2)}</span>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 700, color: '#e3e2e0' }}>Total Amount</span>
                  <span style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: '#e3e2e0' }}>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment method selector */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>PAYMENT METHOD</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {PAYMENT_METHODS.map(m => (
                <button key={m.id} type="button" onClick={() => setPayMethod(m.id)} style={{ flex: 1, padding: '12px 4px', borderRadius: 12, border: `2px solid ${payMethod === m.id ? '#a8a4ff' : 'rgba(255,255,255,0.1)'}`, background: payMethod === m.id ? 'rgba(168,164,255,0.12)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, color: payMethod === m.id ? '#a8a4ff' : 'rgba(227,226,224,0.5)', transition: 'all 0.15s' }}>
                  {m.icon}
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em' }}>{m.label}</span>
                </button>
              ))}
            </div>

            {payMethod === 'upi' && (
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', display: 'block', marginBottom: 8 }}>Enter UPI ID</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@okicici"
                    style={{ width: '100%', padding: '13px 40px 13px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                  {upiId && (
                    <button type="button" onClick={() => setUpiId('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.4)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  )}
                </div>
              </div>
            )}
            {payMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input type="text" placeholder="1234 5678 9012 3456" style={{ width: '100%', padding: '13px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input type="text" placeholder="MM/YY" style={{ padding: '13px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', outline: 'none' }} />
                  <input type="text" placeholder="CVV" style={{ padding: '13px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', outline: 'none' }} />
                </div>
              </div>
            )}
          </div>

          {error && (
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#ef4444', marginBottom: 12 }}>
              {error}
            </p>
          )}

          {/* Pay button */}
          <button type="button" onClick={handlePay} disabled={paying || !product}
            style={{ width: '100%', padding: '16px', borderRadius: 16, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '17px', border: 'none', cursor: paying ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(108,92,231,0.4)', marginBottom: 14, opacity: (!product || paying) ? 0.7 : 1 }}>
            {paying ? (
              <><svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Processing...</>
            ) : (
              <>Pay ₹{totalAmount.toFixed(2)} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
            )}
          </button>

          {/* Trust indicators */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 16 }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: 'Secured by Razorpay' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>, label: 'GST Invoice Included' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, label: 'Instant delivery' },
            ].map(t => (
              <div key={t.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                {t.icon}
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.4)', textAlign: 'center' }}>{t.label}</span>
              </div>
            ))}
          </div>

          {/* Money back */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '11px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.68-6"/></svg>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.6)', fontWeight: 500 }}>100% money back if not satisfied</span>
          </div>
        </div>
      </div>
    </>
  )
}
