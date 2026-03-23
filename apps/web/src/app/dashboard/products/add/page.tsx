'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type ProductType = 'digital_download' | 'course' | 'coaching' | 'community' | 'pre_sell' | 'bundle' | null

const PRODUCT_TYPES = [
  {
    type: 'digital_download' as const,
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    label: 'Digital Download',
    desc: 'PDFs, templates, presets, or assets for your followers to use.',
    color: '#a8a4ff',
  },
  {
    type: 'course' as const,
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    label: 'Course',
    desc: 'Structured learning with video modules, quizzes, and tracking.',
    color: '#f472b6',
  },
  {
    type: 'coaching' as const,
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    label: 'Coaching',
    desc: '1:1 or group sessions with automated calendar booking.',
    color: '#34d399',
  },
  {
    type: 'community' as const,
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    label: 'Community',
    desc: 'Subscription-based access to your private Discord or portal.',
    color: '#fb923c',
  },
  {
    type: 'pre_sell' as const,
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/></svg>,
    label: 'Pre-Sell',
    desc: 'Validate your idea and collect payments before launching.',
    color: '#60a5fa',
  },
  {
    type: 'bundle' as const,
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
    label: 'Bundle',
    desc: 'Combine multiple products into a single high-value offer.',
    color: '#a78bfa',
  },
]

const STEPS = ['Product Type', 'Basic Details', 'Pricing', 'Content', 'Cover Art', 'Publish']

const SIDEBAR_NAV = [
  { label: 'Home', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, href: '/dashboard' },
  { label: 'My Page', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, href: '/dashboard/page-builder' },
  { label: 'Products', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg>, href: '/dashboard/products', active: true },
  { label: 'Analytics', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, href: '/dashboard/analytics' },
  { label: 'Earnings', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, href: '/dashboard/earnings' },
  { label: 'AI Coach', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 9h8"/><path d="M8 13h6"/></svg>, href: '/dashboard/ai-coach' },
  { label: 'WhatsApp Store', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, href: '/dashboard/whatsapp' },
  { label: 'Collabs', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, href: '/dashboard/collabs' },
  { label: 'Settings', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M5.34 5.34L3.93 6.75M21 12h-2M5 12H3M19.07 19.07l-1.41-1.41M5.34 18.66l-1.41 1.41M12 21v-2M12 5V3"/></svg>, href: '/dashboard/settings' },
]

export default function AddProductPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState<ProductType>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [inclusive, setInclusive] = useState(true)
  const [emi, setEmi] = useState(false)
  const [loading, setLoading] = useState(false)

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100

  function handleNext() {
    if (step < STEPS.length) setStep(s => s + 1)
    else handlePublish()
  }

  async function handlePublish() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    router.push('/dashboard/products')
  }

  const canNext = step === 1 ? !!selectedType : step === 2 ? title.trim().length > 0 : true

  return (
    <div className="min-h-screen flex" style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: 200, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
        <div style={{ padding: '0 16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>CreatorOS</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.4)', margin: '2px 0 0' }}>Priya Sharma</p>
        </div>
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {SIDEBAR_NAV.map(item => (
            <Link key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', textDecoration: 'none', color: item.active ? '#a8a4ff' : 'rgba(227,226,224,0.5)', background: item.active ? 'rgba(168,164,255,0.1)' : 'transparent', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: item.active ? 600 : 400, borderLeft: item.active ? '2px solid #a8a4ff' : '2px solid transparent' }}>
              <span style={{ opacity: item.active ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        {/* User profile */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)', flexShrink: 0 }} />
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Priya Sharma</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: '#a8a4ff', margin: 0 }}>PREMIUM CREATOR</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', display: 'flex', alignItems: 'center', height: 52 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '7px 14px', maxWidth: 320 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search..." style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#e3e2e0', flex: 1 }} />
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button type="button" style={{ padding: '8px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,92,231,0.3)' }}>Add Product</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: '#a8a4ff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>STEP {String(step).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}</span>
          </div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '3rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 8px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {step === 1 ? 'What are you selling?' :
             step === 2 ? 'Basic Details' :
             step === 3 ? 'Set your price' :
             step === 4 ? 'Add content' :
             step === 5 ? 'Upload cover art' : 'Ready to publish?'}
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(227,226,224,0.5)', marginBottom: 24, lineHeight: 1.6 }}>
            {step === 1 ? 'Choose the product type that best fits your creative offering.' :
             step === 2 ? "Give your product a memorable name and describe what you're offering." :
             step === 3 ? 'Price your work with confidence. You can change this anytime.' :
             step === 4 ? 'Upload your files, videos, or course modules.' :
             step === 5 ? 'A great cover image can increase your sales by 40%.' : "Your product will go live on your storefront. Let's do this!"}
          </p>

          {/* Progress bar */}
          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 40, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #6c5ce7, #a8a4ff)', borderRadius: 2, transition: 'width 0.4s ease' }} />
            {STEPS.map((_, i) => (
              <div key={i} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: `${(i / (STEPS.length - 1)) * 100}%`, width: 8, height: 8, borderRadius: '50%', background: i < step ? '#a8a4ff' : 'rgba(255,255,255,0.15)', transition: 'background 0.3s', marginLeft: i === 0 ? 0 : i === STEPS.length - 1 ? -8 : -4 }} />
            ))}
          </div>

          {/* Step content */}
          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 800 }}>
              {PRODUCT_TYPES.map(pt => (
                <button key={pt.type} type="button" onClick={() => setSelectedType(pt.type)}
                  style={{ padding: '28px 24px', borderRadius: 16, border: selectedType === pt.type ? `2px solid ${pt.color}` : '1.5px solid rgba(255,255,255,0.08)', background: selectedType === pt.type ? `rgba(${pt.color === '#a8a4ff' ? '168,164,255' : pt.color === '#f472b6' ? '244,114,182' : pt.color === '#34d399' ? '52,211,153' : pt.color === '#fb923c' ? '251,146,60' : pt.color === '#60a5fa' ? '96,165,250' : '167,139,250'},0.1)` : 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `rgba(${pt.color === '#a8a4ff' ? '168,164,255' : pt.color === '#f472b6' ? '244,114,182' : pt.color === '#34d399' ? '52,211,153' : pt.color === '#fb923c' ? '251,146,60' : pt.color === '#60a5fa' ? '96,165,250' : '167,139,250'},0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: pt.color }}>
                    {pt.icon}
                  </div>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 6px' }}>{pt.label}</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)', margin: 0, lineHeight: 1.5 }}>{pt.desc}</p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Product Title *</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. 21-Day Fat Loss Meal Plan" autoFocus
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what your buyers will get..." rows={4}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', outline: 'none', boxSizing: 'border-box', resize: 'none', lineHeight: 1.6 }} />
              </div>
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Category Tags</label>
                <input type="text" placeholder="fitness, nutrition, diet (comma-separated)"
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
                <div>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Sale Price</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontFamily: 'DM Sans, sans-serif', fontSize: '18px', fontWeight: 700, color: 'rgba(227,226,224,0.5)' }}>₹</span>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="2,999"
                      style={{ width: '100%', padding: '14px 16px', paddingLeft: 32, borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Currency</label>
                  <div style={{ padding: '14px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 700 }}>INR</div>
                </div>
              </div>
              {/* Toggles */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Inclusive of GST', sublabel: 'Automatic tax breakdown', value: inclusive, set: setInclusive },
                  { label: 'Enable EMI', sublabel: 'Affordability for students', value: emi, set: setEmi },
                ].map(t => (
                  <div key={t.label} style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => t.set(!t.value)}>
                    <div>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#e3e2e0', margin: 0 }}>{t.label}</p>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>{t.sublabel}</p>
                    </div>
                    <div style={{ width: 42, height: 24, borderRadius: 12, background: t.value ? '#a8a4ff' : 'rgba(255,255,255,0.12)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', top: 3, left: t.value ? 20 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ maxWidth: 560 }}>
              <div style={{ borderRadius: 16, border: '2px dashed rgba(168,164,255,0.3)', background: 'rgba(168,164,255,0.04)', padding: '60px 40px', textAlign: 'center', cursor: 'pointer', marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(168,164,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#a8a4ff' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 6px' }}>Drag & drop your files here</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.4)', margin: '0 0 20px' }}>PDF, MP4, ZIP, DOCX up to 500MB</p>
                <button type="button" style={{ padding: '10px 24px', borderRadius: 10, background: 'rgba(168,164,255,0.12)', border: '1px solid rgba(168,164,255,0.3)', color: '#a8a4ff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Browse Files</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ maxWidth: 560 }}>
              <div style={{ borderRadius: 16, border: '2px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)', padding: '80px 40px', textAlign: 'center', cursor: 'pointer', aspectRatio: '16/9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600, color: 'rgba(227,226,224,0.5)' }}>Click to upload cover image</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.3)' }}>Recommended: 1200×800px, JPG or PNG</p>
              </div>
            </div>
          )}

          {step === 6 && (
            <div style={{ maxWidth: 480 }}>
              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: '24px', marginBottom: 24 }}>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 8px' }}>{title || 'Your Product'}</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)', margin: '0 0 16px' }}>Type: {selectedType?.replace('_', ' ')}</p>
                <div style={{ display: 'flex', gap: 20 }}>
                  {[
                    { label: 'Price', value: price ? `₹${price}` : 'Free' },
                    { label: 'GST', value: inclusive ? 'Inclusive' : 'Exclusive' },
                    { label: 'EMI', value: emi ? 'Enabled' : 'Disabled' },
                  ].map(s => (
                    <div key={s.label}>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>{s.label}</p>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button type="button" onClick={() => router.push('/dashboard/products')} style={{ padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Save as Draft</button>
                <button type="button" onClick={handlePublish} disabled={loading} style={{ padding: '14px', borderRadius: 14, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(108,92,231,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {loading ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> : '🚀 Publish Product'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
          <button type="button" onClick={() => router.push('/dashboard/products')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.5)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Exit Wizard
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {step > 1 && <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.4)' }}>UP NEXT <strong style={{ color: '#e3e2e0' }}>{STEPS[step]}</strong></span>}
            <button type="button" onClick={handleNext} disabled={!canNext} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 14, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '15px', border: 'none', cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : 0.5, boxShadow: '0 6px 20px rgba(108,92,231,0.3)' }}>
              {step === STEPS.length ? 'Publish' : 'Next'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
