'use client'

import Link from 'next/link'

export default function PaymentFailedPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', maxWidth: 420, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px 40px' }}>

      {/* Warning icon */}
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(245,158,11,0.12)', border: '2px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, boxShadow: '0 0 40px rgba(245,158,11,0.1)' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>

      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 14px', textAlign: 'center', lineHeight: 1.15 }}>
        Payment didn&apos;t go<br />through
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(227,226,224,0.55)', textAlign: 'center', lineHeight: 1.6, margin: '0 0 32px' }}>
        Don&apos;t worry, <strong style={{ color: '#e3e2e0' }}>no money was deducted</strong> from your account. You can safely try again.
      </p>

      {/* Product info card */}
      <div style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, background: 'linear-gradient(135deg, #fde68a, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>RESERVING YOUR SPOT</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 2px' }}>21-Day Fat Loss Meal Plan</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)', margin: 0 }}>Amount: <strong style={{ color: '#e3e2e0' }}>₹499</strong></p>
        </div>
      </div>

      {/* Failure reason */}
      <div style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1, flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>FAILURE REASON</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.7)', margin: 0, lineHeight: 1.5 }}>UPI timeout: Connection with bank app was lost.</p>
          </div>
        </div>
      </div>

      {/* Try again CTA */}
      <Link href="/checkout/1" style={{ width: '100%', padding: '15px', borderRadius: 16, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '16px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14, boxShadow: '0 8px 24px rgba(108,92,231,0.35)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.68-6"/></svg>
        Try again with UPI
      </Link>

      {/* Alternative methods */}
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
        {[
          { label: 'Card', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
          { label: 'Net Banking', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
        ].map(m => (
          <button key={m.label} type="button" style={{ padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'rgba(227,226,224,0.7)' }}>
            {m.icon}
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600 }}>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Chat with creator */}
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.4)', marginBottom: 12 }}>Still having trouble?</p>
      <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 100, background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)', color: '#25d366', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginBottom: 40 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#25d366', flexShrink: 0 }} />
        Chat with Creator
      </button>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 8 }}>
          <Link href="/terms" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.2)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.06em' }}>TERMS OF SERVICE</Link>
          <Link href="/privacy" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.2)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.06em' }}>PRIVACY POLICY</Link>
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.15)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>© 2024 CREVO TECHNOLOGIES. BUILT FOR THE NEW BHARAT.</p>
      </div>
    </div>
  )
}
