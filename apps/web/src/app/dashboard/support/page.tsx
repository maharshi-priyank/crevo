'use client'

import { useState } from 'react'
import Link from 'next/link'

const FAQS = [
  {
    q: 'How do I set up UPI payouts?',
    a: 'Go to Settings → Payments and add your UPI ID. Payouts are processed within 1 business day after a successful sale, once your KYC is complete.',
  },
  {
    q: 'How does the WhatsApp Store work?',
    a: 'Crevo connects to your WhatsApp Business number and automates product discovery, catalog browsing, and UPI payment links — all within a chat window.',
  },
  {
    q: 'What is the Credilink Score?',
    a: 'Your Credilink Score is a 0–1000 trust metric calculated from your sales volume, payout history, product quality ratings, and profile completeness. A higher score unlocks faster payouts and credit access.',
  },
  {
    q: 'How do I create a collab with another creator?',
    a: 'Navigate to Collabs in your dashboard, click "Create a Collab", invite the other creator by their @username, set the revenue split, and publish the joint product.',
  },
  {
    q: 'Can I sell physical products?',
    a: 'Currently Crevo focuses on digital products (eBooks, courses, templates, memberships). Physical product support is on the roadmap for Q3 2026.',
  },
  {
    q: 'What are the platform fees?',
    a: 'Crevo charges 5% on each sale + Razorpay payment processing fees (~2%). There are no monthly subscription costs for the free tier.',
  },
]

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [chatMsg, setChatMsg] = useState('')
  const [chatSent, setChatSent] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Top bar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'rgba(227,226,224,0.45)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Dashboard
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#e3e2e0' }}>Help & Support</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)', cursor: 'pointer' }} />
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(168,164,255,0.12)', border: '1px solid rgba(168,164,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.8rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 12px', letterSpacing: '-0.03em' }}>How can we help?</h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(227,226,224,0.5)', margin: 0 }}>Browse FAQs or reach our support team directly.</p>
        </div>

        {/* Quick links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 48 }}>
          {[
            { label: 'KYC & Payments', icon: '💳', href: '/dashboard/settings' },
            { label: 'Product Setup', icon: '📦', href: '/dashboard/products' },
            { label: 'WhatsApp Store', icon: '💬', href: '/dashboard/whatsapp' },
          ].map(c => (
            <Link key={c.label} href={c.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', textDecoration: 'none', transition: 'border 0.15s' }}>
              <span style={{ fontSize: '20px' }}>{c.icon}</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#e3e2e0' }}>{c.label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
          {/* FAQs */}
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 700, color: '#e3e2e0', marginBottom: 16 }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#e3e2e0' }}>{faq.q}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: 12, transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 20px 16px' }}>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.55)', margin: 0, lineHeight: 1.7 }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px' }}>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 6px' }}>Talk to Support</h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.45)', margin: '0 0 20px' }}>Our team typically replies within 4 hours on business days.</p>

              {!chatSent ? (
                <>
                  <textarea
                    value={chatMsg}
                    onChange={e => setChatMsg(e.target.value)}
                    placeholder="Describe your issue..."
                    rows={4}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', outline: 'none', resize: 'none', marginBottom: 12, boxSizing: 'border-box' }}
                  />
                  <button
                    type="button"
                    onClick={() => { if (chatMsg.trim()) setChatSent(true) }}
                    style={{ width: '100%', padding: '12px', borderRadius: 12, background: chatMsg.trim() ? 'linear-gradient(135deg, #6c5ce7, #a8a4ff)' : 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', cursor: chatMsg.trim() ? 'pointer' : 'not-allowed', opacity: chatMsg.trim() ? 1 : 0.4 }}
                  >
                    Send Message
                  </button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 6px' }}>Message sent!</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.45)', margin: 0 }}>We&apos;ll reply to your registered email within 4 hours.</p>
                </div>
              )}
            </div>

            {/* Contact options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="mailto:support@crevo.in" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', textDecoration: 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(168,164,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>support@crevo.in</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>Email support</p>
                </div>
              </a>

              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', textDecoration: 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37,211,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25d366" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                </div>
                <div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Chat on WhatsApp</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>9am – 6pm, Mon–Sat</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
