'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const MODULES = [
  { title: '01. Fundamentals of Nutrition', type: 'VIDEO', duration: '12:45 MINS' },
  { title: '02. Calculating Caloric Deficit', type: 'VIDEO', duration: '24:10 MINS' },
  { title: '03. Meal Timing & Composition', type: 'VIDEO', duration: '18:30 MINS' },
  { title: '04. Exercise & Fat Loss Synergy', type: 'VIDEO', duration: '32:05 MINS' },
]

export default function EditProductPage() {
  const router = useRouter()
  const [title, setTitle] = useState('Fat Loss Course')
  const [price, setPrice] = useState('2,999')
  const [inclusive, setInclusive] = useState(true)
  const [emi, setEmi] = useState(false)
  const [modules, setModules] = useState(MODULES)
  const [showDelete, setShowDelete] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSave(publish: boolean) {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    router.push('/dashboard/products')
  }

  async function handleDelete() {
    setDeleting(true)
    await new Promise(r => setTimeout(r, 800))
    router.push('/dashboard/products')
  }

  function addModule() {
    setModules(prev => [...prev, { title: `0${prev.length + 1}. New Module`, type: 'VIDEO', duration: '0:00 MINS' }])
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Topbar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: 52, display: 'flex', alignItems: 'center', gap: 16 }}>
        <button type="button" onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.5)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Edit Product</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button type="button" style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(227,226,224,0.5)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <button type="button" style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(227,226,224,0.5)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M5.34 5.34L3.93 6.75M21 12h-2M5 12H3M19.07 19.07l-1.41-1.41M5.34 18.66l-1.41 1.41M12 21v-2M12 5V3"/></svg>
          </button>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)', cursor: 'pointer' }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 0 }}>
        {/* Left: Edit form */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.07)', padding: '32px 40px', overflowY: 'auto' }}>

          {/* Basic info */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 4, height: 20, borderRadius: 2, background: '#a8a4ff' }} />
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Basic Info</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>PRODUCT TITLE</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>THUMBNAIL</label>
                <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.35)' }}>Click to upload image</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 4, height: 20, borderRadius: 2, background: '#a8a4ff' }} />
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Pricing</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>SALE PRICE</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: 'rgba(227,226,224,0.6)' }}>₹</span>
                  <input type="text" value={price} onChange={e => setPrice(e.target.value)}
                    style={{ width: '100%', padding: '14px 16px', paddingLeft: 32, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>CURRENCY</label>
                <div style={{ padding: '14px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 700, height: 52, display: 'flex', alignItems: 'center' }}>INR</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Inclusive of GST', sublabel: 'Automatic tax breakdown', value: inclusive, set: setInclusive },
                { label: 'Enable EMI', sublabel: 'Affordability for students', value: emi, set: setEmi },
              ].map(t => (
                <div key={t.label} onClick={() => t.set(!t.value)} style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#e3e2e0', margin: 0 }}>{t.label}</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>{t.sublabel}</p>
                  </div>
                  <div style={{ width: 40, height: 22, borderRadius: 11, background: t.value ? '#a8a4ff' : 'rgba(255,255,255,0.12)', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
                    <div style={{ position: 'absolute', top: 2, left: t.value ? 18 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delete + Save row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, paddingTop: 4 }}>
            <button type="button" onClick={() => setShowDelete(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              Delete Product
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => handleSave(false)} style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Save as Draft</button>
              <button type="button" onClick={() => handleSave(true)} disabled={saving} style={{ padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(108,92,231,0.3)' }}>
                {saving ? 'Saving...' : 'Save & Publish'}
              </button>
            </div>
          </div>

          {/* Course content */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 4, height: 20, borderRadius: 2, background: '#a8a4ff' }} />
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Course Content</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.4)', fontWeight: 600 }}>MODULES ({modules.length})</span>
              <button type="button" onClick={addModule} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#a8a4ff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Module
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {modules.map((mod, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.3)" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#e3e2e0', margin: 0 }}>{mod.title}</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>{mod.type} • {mod.duration}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Drop zone */}
            <div style={{ borderRadius: 12, border: '1.5px dashed rgba(255,255,255,0.12)', padding: '24px', textAlign: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px', display: 'block' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.35)' }}>Drag and drop more videos or curriculum PDFs</p>
            </div>
          </div>
        </div>

        {/* Right: Live preview */}
        <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>LIVE STOREFRONT PREVIEW</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.35)', margin: 0 }}>Simulated mobile experience</p>
          </div>
          {/* Phone frame */}
          <div style={{ borderRadius: 28, background: '#1a1a2e', border: '6px solid #2a2a40', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            {/* Cover image */}
            <div style={{ height: 160, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <div style={{ position: 'absolute', top: 10, left: 10, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              </div>
              <div style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </div>
            </div>
            {/* Content */}
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ padding: '2px 8px', borderRadius: 5, background: 'rgba(168,164,255,0.15)', fontFamily: 'DM Sans, sans-serif', fontSize: '9px', fontWeight: 700, color: '#a8a4ff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>COURSE</span>
                <div style={{ display: 'flex', gap: 1 }}>
                  {[1,2,3,4,5].map(s => <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill={s <= 4 ? '#fbbf24' : 'rgba(255,255,255,0.2)' } stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                </div>
              </div>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 6px' }}>{title}</h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.5)', margin: '0 0 12px', lineHeight: 1.5 }}>Master the art of sustainable weight loss with scientifically proven methods and custom meal plans.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: -4 }}>
                  {['#a8a4ff', '#f472b6', '#34d399'].map(c => <div key={c} style={{ width: 20, height: 20, borderRadius: '50%', background: c, border: '2px solid #1a1a2e', marginLeft: -4 }} />)}
                </div>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.5)' }}>Joined by 1.2k+ creators</span>
              </div>
              <div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>INCLUDED IN THIS COURSE</p>
                {modules.slice(0, 2).map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.5)' }}>{m.title}</span>
                  </div>
                ))}
                {modules.length > 2 && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: '#a8a4ff', margin: '4px 0 0' }}>+{modules.length - 2} more modules</p>}
              </div>
            </div>
          </div>

          {/* Pro plan indicator */}
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          <div style={{ background: 'rgba(168,164,255,0.08)', border: '1px solid rgba(168,164,255,0.2)', borderRadius: 12, padding: '12px 14px' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: '#a8a4ff', margin: '0 0 2px' }}>PRO PLAN ACTIVE</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>Accessing Digital Atelier Tools</p>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e1e28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '40px 32px', maxWidth: 400, width: '90%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Red top accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #ef4444, #f87171)' }} />
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 16px' }}>Delete this product?</h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.55)', lineHeight: 1.6, margin: '0 0 28px' }}>
              Are you sure you want to delete <strong style={{ color: '#e3e2e0' }}>&ldquo;{title}&rdquo;</strong>? This action cannot be undone and will remove it from your storefront and all marketing links.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" onClick={handleDelete} disabled={deleting} style={{ flex: 1, padding: '13px', borderRadius: 100, background: 'linear-gradient(135deg, #ef4444, #f87171)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                {deleting ? 'Deleting...' : 'Yes, Delete Product'}
              </button>
              <button type="button" onClick={() => setShowDelete(false)} style={{ flex: 1, padding: '13px', borderRadius: 100, background: 'none', border: 'none', color: 'rgba(227,226,224,0.6)', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
            </div>
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(227,226,224,0.25)" stroke="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ACTION LOGGED IN CREATOROS PORTAL</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
