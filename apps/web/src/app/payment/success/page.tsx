'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getDelivery } from '@/lib/api'

interface DeliveryData {
  signedUrl: string
  downloadsRemaining: number
  productTitle: string
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [confetti, setConfetti] = useState(false)
  const [delivery, setDelivery] = useState<DeliveryData | null>(null)
  const [loadingDelivery, setLoadingDelivery] = useState(true)

  useEffect(() => {
    setConfetti(true)
    const t = setTimeout(() => setConfetti(false), 3000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!orderId) { setLoadingDelivery(false); return }
    getDelivery(orderId)
      .then((data) => setDelivery(data as DeliveryData))
      .catch(() => {/* delivery may still be processing */})
      .finally(() => setLoadingDelivery(false))
  }, [orderId])

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', maxWidth: 420, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Top dark section */}
      <div style={{ width: '100%', padding: '56px 24px 40px', textAlign: 'center', background: '#0e0e10', position: 'relative', overflow: 'hidden' }}>
        {/* Confetti particles */}
        {confetti && [
          { color: '#a8a4ff', top: '10%', left: '15%', delay: '0s' },
          { color: '#f472b6', top: '20%', right: '20%', delay: '0.1s' },
          { color: '#34d399', top: '5%', right: '40%', delay: '0.2s' },
          { color: '#fbbf24', top: '25%', left: '35%', delay: '0.15s' },
        ].map((p, i) => (
          <div key={i} style={{ position: 'absolute', top: p.top, left: p.left, right: p.right, width: 8, height: 8, borderRadius: 2, background: p.color, animation: `fall 2s ease-in forwards`, animationDelay: p.delay }} />
        ))}

        {/* Success icon */}
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(16,185,129,0.2)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>

        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 8px', lineHeight: 1.15 }}>Payment successful! 🎉</h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px' }}>TRANSACTION ID: #CRV-882910</p>

        <div style={{ marginBottom: 6 }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '3rem', fontWeight: 700, color: '#e3e2e0' }}>₹499</span>
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.4)' }}>Credited to Priya Sharma</p>
      </div>

      {/* White/light card section */}
      <div style={{ width: '100%', flex: 1, background: '#e3e2e0', borderRadius: '28px 28px 0 0', padding: '28px 24px' }}>
        {/* Product download card */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '18px', marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #fde68a, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: 700, color: '#0e0e10', margin: 0 }}>
              {loadingDelivery ? '...' : (delivery?.productTitle ?? 'Your Purchase')}
            </p>
          </div>
          {delivery?.signedUrl ? (
            <a href={delivery.signedUrl} download style={{ width: '100%', padding: '13px', borderRadius: 14, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14, boxShadow: '0 6px 20px rgba(108,92,231,0.3)', textDecoration: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download ({delivery.downloadsRemaining} left)
            </a>
          ) : (
            <button type="button" disabled style={{ width: '100%', padding: '13px', borderRadius: 14, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '15px', border: 'none', cursor: loadingDelivery ? 'wait' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14, boxShadow: '0 6px 20px rgba(108,92,231,0.3)', opacity: 0.7 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {loadingDelivery ? 'Preparing download...' : 'Check your email for the download link'}
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(14,14,16,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>ALSO DELIVERED TO</p>
            {[
              { label: 'WhatsApp', color: '#25d366', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.996 0C5.372 0 0 5.373 0 12c0 2.123.56 4.128 1.542 5.867L0 24l6.337-1.524A11.945 11.945 0 0 0 12 24c6.624 0 12-5.373 12-12S18.62 0 11.996 0z"/></svg> },
              { label: 'Email', color: '#3b82f6', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
            ].map(d => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 100, background: d.color + '20', border: `1px solid ${d.color}40` }}>
                {d.icon}
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: '#0e0e10' }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Creator message */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)" stroke="none"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
          </div>
          <blockquote style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontStyle: 'italic', color: '#0e0e10', lineHeight: 1.6, margin: '0 0 8px' }}>
            &ldquo;I&apos;m so excited for you to start this journey. Consistency is key, and I&apos;m right here with you!&rdquo;
          </blockquote>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(14,14,16,0.5)', fontWeight: 600 }}>— Priya Sharma</p>
        </div>

        {/* Share section */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(14,14,16,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 12 }}>SHARE YOUR PROGRESS</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#fff', border: '1.5px solid rgba(14,14,16,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25d366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#0e0e10' }}>WhatsApp</span>
            </button>
            <button type="button" style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#fff', border: '1.5px solid rgba(14,14,16,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e1306c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#0e0e10' }}>Instagram</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(14,14,16,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>© 2024 CREVO TECHNOLOGIES. BUILT FOR THE NEW BHARAT.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <Link href="/terms" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(14,14,16,0.35)', textDecoration: 'none' }}>TERMS OF SERVICE</Link>
            <Link href="/privacy" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(14,14,16,0.35)', textDecoration: 'none' }}>PRIVACY POLICY</Link>
            <Link href="/gst" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(14,14,16,0.35)', textDecoration: 'none' }}>GST COMPLIANCE</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
