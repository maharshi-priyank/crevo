'use client'

import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const STEPS = [
  { label: 'Profile created', done: true },
  { label: 'Username chosen', done: true },
  { label: 'KYC submitted', done: true },
]

const FEATURES = [
  { icon: '🛒', title: 'Create your first product', desc: 'Upload an eBook, course, or template.', href: '/dashboard/products/add', cta: 'Add product' },
  { icon: '📱', title: 'Customize your storefront', desc: 'Edit your public page layout and style.', href: '/dashboard/page-builder', cta: 'Open builder' },
  { icon: '💬', title: 'Enable WhatsApp selling', desc: 'Connect your business number in minutes.', href: '/dashboard/whatsapp', cta: 'Connect' },
]

function CompletionContent() {
  const params = useSearchParams()
  const slug = params.get('slug') ?? 'your-store'

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative" style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', padding: '32px 24px' }}>
      {/* Ambient glow */}
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,164,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s, transform 0.6s' }}>
        {/* Animated checkmark */}
        <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 28px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(168,164,255,0.2), rgba(108,92,231,0.1))', border: '2px solid rgba(168,164,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          {/* Orbit rings */}
          {[0, 1].map(i => (
            <div key={i} style={{ position: 'absolute', inset: -(i + 1) * 12, borderRadius: '50%', border: `1px solid rgba(168,164,255,${0.12 - i * 0.04})`, animation: `pulse ${1.8 + i * 0.4}s ease-out infinite`, animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>

        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 10px', letterSpacing: '-0.03em' }}>You&apos;re all set! 🎉</h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(227,226,224,0.5)', margin: '0 0 32px', lineHeight: 1.6 }}>
          Your Crevo store is live at{' '}
          <a href={`https://crevo.in/${slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#a8a4ff', fontWeight: 700, textDecoration: 'none' }}>crevo.in/{slug}</a>
        </p>

        {/* Completion checklist */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px', marginBottom: 28, textAlign: 'left' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: i < STEPS.length - 1 ? '10px 0' : '10px 0 0', borderBottom: i < STEPS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#e3e2e0', fontWeight: 600 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Next steps */}
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, textAlign: 'left' }}>NEXT STEPS</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'left' }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>{f.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 2px' }}>{f.title}</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.45)', margin: 0 }}>{f.desc}</p>
              </div>
              <Link href={f.href} style={{ padding: '7px 14px', borderRadius: 9, background: 'rgba(168,164,255,0.1)', border: '1px solid rgba(168,164,255,0.2)', color: '#a8a4ff', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>{f.cta}</Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '16px 24px', borderRadius: 16, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '17px', textDecoration: 'none', boxShadow: '0 8px 28px rgba(108,92,231,0.35)' }}>
          Go to Dashboard
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </Link>
      </div>

      <style>{`@keyframes pulse{0%{opacity:0.6;transform:scale(1)}100%{opacity:0;transform:scale(1.5)}}`}</style>
    </main>
  )
}

export default function OnboardingCompletePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0e0e10' }} />}>
      <CompletionContent />
    </Suspense>
  )
}
