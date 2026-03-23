'use client'

import Link from 'next/link'

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-end relative overflow-hidden" style={{ background: '#0e0e10' }}>

      {/* Phone mockup illustration */}
      <div className="flex-1 w-full flex items-center justify-center pt-16 pb-4 relative">
        {/* Floating feature icons */}
        <div className="absolute" style={{ top: '15%', left: '12%', width: 52, height: 52, borderRadius: 16, background: 'rgba(124,58,237,0.6)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div className="absolute" style={{ top: '28%', left: '6%', width: 44, height: 44, borderRadius: 14, background: 'rgba(16,185,129,0.7)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div className="absolute" style={{ top: '12%', right: '14%', width: 52, height: 52, borderRadius: 16, background: 'rgba(59,130,246,0.65)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>

        {/* Phone frame */}
        <div style={{ width: 200, height: 340, borderRadius: 32, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
          {/* Phone notch */}
          <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 60, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.15)' }} />
          {/* Avatar circle at top center */}
          <div style={{ position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #e8a87c, #c67b4a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
          </div>
          {/* Screen content lines */}
          <div style={{ position: 'absolute', top: 82, left: 20, right: 20 }}>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.12)', marginBottom: 6 }} />
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)', width: '70%', marginBottom: 20 }} />
            {/* Two stat blocks */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, height: 64, borderRadius: 12, background: 'rgba(168,164,255,0.15)', border: '1px solid rgba(168,164,255,0.2)' }} />
              <div style={{ flex: 1, height: 64, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom sheet */}
      <div style={{ width: '100%', maxWidth: 480, borderRadius: '28px 28px 0 0', background: '#e3e2e0', padding: '20px 28px 40px' }}>
        {/* Drag indicator */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.15)', margin: '0 auto 24px' }} />

        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#0e0e10', marginBottom: 10, letterSpacing: '-0.02em' }}>
          Welcome to Crevo
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(14,14,16,0.55)', marginBottom: 28, lineHeight: 1.5 }}>
          India&apos;s first creator store with UPI payments, WhatsApp selling, and AI coaching.
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
          {[
            { icon: '💸', label: 'UPI Payments' },
            { icon: '💬', label: 'WhatsApp Store' },
            { icon: '🤖', label: 'AI Coach' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', borderRadius: 100, padding: '8px 16px', border: '1px solid rgba(0,0,0,0.08)' }}>
              <span style={{ fontSize: '15px' }}>{item.icon}</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, color: '#0e0e10' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <Link href="/onboarding/profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '16px 24px', borderRadius: 16, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '17px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(108,92,231,0.35)', marginBottom: 18 }}>
          Create your free store
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </Link>

        {/* Login link */}
        <p style={{ textAlign: 'center', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(14,14,16,0.5)' }}>
          I already have an account —{' '}
          <Link href="/login" style={{ color: '#0e0e10', fontWeight: 700, textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </main>
  )
}
