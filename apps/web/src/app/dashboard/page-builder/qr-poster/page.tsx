'use client'

import { useState } from 'react'
import Link from 'next/link'

const TEMPLATES = [
  { id: 'home-baker', label: 'Home Baker', preview: 'bg-amber' },
  { id: 'yoga-studio', label: 'Yoga Studio', preview: 'bg-slate' },
  { id: 'interior-decor', label: 'Interior Decor', preview: 'bg-stone' },
  { id: 'artisanal', label: 'Artisanal Craft', preview: 'bg-purple' },
  { id: 'fine-dining', label: 'Fine Dining', preview: 'bg-dark' },
  { id: 'custom', label: 'Custom Blank', preview: 'bg-blank' },
]

const LANGUAGES = ['English', 'हिन्दी', 'मराठी', 'বাংলা', 'தமிழ்']
const SIZES = ['A4 Vertical', 'A5 Horizontal', 'Square 1:1']
const COLORS = ['#a8a4ff', '#ec4899', '#f472b6', '#f87171', '#e5e7eb', '#111111']

const TEMPLATE_GRADIENTS: Record<string, string> = {
  'bg-amber': 'linear-gradient(135deg, #92400e, #d97706)',
  'bg-slate': 'linear-gradient(135deg, #1e293b, #475569)',
  'bg-stone': 'linear-gradient(135deg, #292524, #57534e)',
  'bg-purple': 'linear-gradient(135deg, #4c1d95, #7c3aed)',
  'bg-dark': 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
  'bg-blank': 'linear-gradient(135deg, #1f2937, #374151)',
}

export default function QrPosterPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('home-baker')
  const [selectedLang, setSelectedLang] = useState('English')
  const [selectedSize, setSelectedSize] = useState('A4 Vertical')
  const [selectedColor, setSelectedColor] = useState('#a8a4ff')
  const [downloading, setDownloading] = useState(false)

  async function handleDownload(type: 'pdf' | 'png') {
    setDownloading(true)
    await new Promise(r => setTimeout(r, 1000))
    setDownloading(false)
  }

  const templateObj = TEMPLATES.find(t => t.id === selectedTemplate)!

  return (
    <div style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Builder topbar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', height: 52, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0, position: 'sticky', top: 0, background: '#0e0e10', zIndex: 10 }}>
        <Link href="/dashboard/page-builder" style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: 700, color: '#e3e2e0', textDecoration: 'none', letterSpacing: '-0.02em' }}>DigitalAtelier Builder</Link>
        <div style={{ display: 'flex', gap: 2, marginLeft: 8 }}>
          {[
            { label: 'Dashboard', href: '/dashboard/page-builder' },
            { label: 'Assets', href: '/dashboard/page-builder/qr-poster', active: true },
            { label: 'Analytics', href: '#' },
          ].map(t => (
            <Link key={t.label} href={t.href} style={{ padding: '5px 14px', borderRadius: 8, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: t.active ? '#a8a4ff' : 'rgba(227,226,224,0.5)', borderBottom: t.active ? '2px solid #a8a4ff' : 'none', fontWeight: t.active ? 600 : 400 }}>{t.label}</Link>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Save/share/export icons */}
          {[
            <svg key="save" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
            <svg key="download" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
            <svg key="more" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>,
          ].map((icon, i) => (
            <button key={i} type="button" style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{icon}</button>
          ))}
          <button type="button" style={{ padding: '7px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Preview</button>
          <button type="button" style={{ padding: '7px 16px', borderRadius: 10, background: 'linear-gradient(135deg,#6c5ce7,#a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Publish</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '440px 1fr', overflow: 'hidden' }}>
        {/* Left: Controls */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.07)', padding: '32px 28px', overflowY: 'auto' }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 8px', letterSpacing: '-0.03em' }}>QR Poster Generator</h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)', margin: '0 0 32px' }}>Create professional print-ready marketing materials for your brand.</p>

          {/* Step 1: Template */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#a8a4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: '#0e0e10' }}>1</span>
              </div>
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Select Template</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {TEMPLATES.map(t => (
                <button key={t.id} type="button" onClick={() => setSelectedTemplate(t.id)}
                  style={{ borderRadius: 12, border: selectedTemplate === t.id ? '2px solid #a8a4ff' : '2px solid rgba(255,255,255,0.08)', cursor: 'pointer', overflow: 'hidden', background: 'none', padding: 0 }}>
                  <div style={{ height: 80, background: TEMPLATE_GRADIENTS[t.preview], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t.id === 'custom' ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.15)' }} />
                    )}
                  </div>
                  <div style={{ padding: '8px', background: 'rgba(0,0,0,0.5)' }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, color: selectedTemplate === t.id ? '#a8a4ff' : 'rgba(227,226,224,0.7)', margin: 0, textAlign: 'center' }}>{t.label}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Language */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.6)' }}>2</span>
              </div>
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Language Selection</h2>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {LANGUAGES.map(l => (
                <button key={l} type="button" onClick={() => setSelectedLang(l)} style={{ padding: '7px 16px', borderRadius: 100, background: selectedLang === l ? '#a8a4ff' : 'rgba(255,255,255,0.07)', border: selectedLang === l ? 'none' : '1px solid rgba(255,255,255,0.1)', color: selectedLang === l ? '#0e0e10' : 'rgba(227,226,224,0.7)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: selectedLang === l ? 700 : 400, cursor: 'pointer' }}>{l}</button>
              ))}
            </div>
          </div>

          {/* Step 3: Size */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.6)' }}>3</span>
              </div>
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Poster Size</h2>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {SIZES.map((s, i) => (
                <button key={s} type="button" onClick={() => setSelectedSize(s)} style={{ flex: 1, padding: '12px 8px', borderRadius: 12, border: selectedSize === s ? '2px solid #a8a4ff' : '2px solid rgba(255,255,255,0.1)', background: selectedSize === s ? 'rgba(168,164,255,0.1)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  {/* Size icon */}
                  <div style={{ width: i === 0 ? 26 : i === 1 ? 36 : 28, height: i === 0 ? 36 : i === 1 ? 26 : 28, border: `2px solid ${selectedSize === s ? '#a8a4ff' : 'rgba(227,226,224,0.3)'}`, borderRadius: 4 }} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 600, color: selectedSize === s ? '#a8a4ff' : 'rgba(227,226,224,0.5)', textAlign: 'center' }}>{s}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Brand Accent */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.6)' }}>4</span>
              </div>
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Brand Accent</h2>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setSelectedColor(c)} style={{ width: 36, height: 36, borderRadius: '50%', background: c, border: selectedColor === c ? '3px solid white' : '3px solid transparent', cursor: 'pointer', outline: selectedColor === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }} />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div style={{ padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            LIVEPRINT PREVIEW
          </p>

          {/* Poster preview */}
          <div style={{ width: 280, background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', marginBottom: 24 }}>
            {/* Header */}
            <div style={{ padding: '24px 20px 20px', background: selectedColor }}>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.8rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', lineHeight: 1.2 }}>Handcrafted<br/>Delights</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>BY ANITA&apos;S KITCHEN</p>
              <div style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            </div>

            {/* QR section */}
            <div style={{ padding: '24px 20px' }}>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 700, color: '#111', margin: '0 0 6px', textAlign: 'center' }}>Scan to shop</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#666', margin: '0 0 20px', textAlign: 'center' }}>Browse the fresh menu & order via WhatsApp</p>

              {/* QR code placeholder */}
              <div style={{ width: 160, height: 160, margin: '0 auto 20px', background: '#111', borderRadius: 12, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 3, padding: 12, boxSizing: 'border-box' }}>
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} style={{ borderRadius: 2, background: i === 12 ? '#fff' : Math.random() > 0.4 ? '#fff' : '#111', height: '100%' }} />
                ))}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 24, height: 24, borderRadius: '50%', background: selectedColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg>
                </div>
              </div>

              {/* Phone number */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 20px', borderRadius: 100, background: '#f0f0f0' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25d366" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#111' }}>+91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Download buttons */}
          <div style={{ display: 'flex', gap: 12, width: 280 }}>
            <button type="button" onClick={() => handleDownload('pdf')} style={{ flex: 1, padding: '12px', borderRadius: 14, background: selectedColor, border: 'none', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, cursor: downloading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: downloading ? 0.7 : 1 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
              {downloading ? 'Generating...' : 'Download PDF (Print-ready)'}
            </button>
            <button type="button" onClick={() => handleDownload('png')} style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              PNG
            </button>
          </div>

          {/* Magic button */}
          <button type="button" style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12, boxShadow: '0 4px 16px rgba(108,92,231,0.4)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
