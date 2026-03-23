'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const THEME_PRESETS = [
  { id: 'midnight', label: 'Midnight', bg: 'linear-gradient(135deg, #111, #1a1a2e)', selected: true },
  { id: 'bloom', label: 'Bloom', bg: 'linear-gradient(135deg, #e8e0d8, #d4c9bf)', selected: false },
  { id: 'sand', label: 'Sand', bg: 'linear-gradient(135deg, #c8b89a, #b5a48a)', selected: false },
  { id: 'forest', label: 'Forest', bg: 'linear-gradient(135deg, #1a2e1a, #2d4a2d)', selected: false },
  { id: 'fire', label: 'Fire', bg: 'linear-gradient(135deg, #4a1010, #8b1a1a)', selected: false },
  { id: 'slate', label: 'Slate', bg: 'linear-gradient(135deg, #1a1f2e, #253047)', selected: false },
]

const FONT_PAIRS = [
  { id: 'noto', display: 'Noto Serif', sub: 'paired with Plus Jakarta', selected: true },
  { id: 'inter', display: 'Inter Black', sub: 'paired with Roboto', selected: false },
]

export default function ThemePickerPage() {
  const router = useRouter()
  const [selectedTheme, setSelectedTheme] = useState('midnight')
  const [selectedFont, setSelectedFont] = useState('noto')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('mobile')
  const [saving, setSaving] = useState(false)

  async function handleApply() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    router.push('/dashboard/page-builder')
  }

  const theme = THEME_PRESETS.find(t => t.id === selectedTheme)!

  return (
    <div style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Builder topbar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', height: 52, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0, position: 'sticky', top: 0, background: '#0e0e10', zIndex: 10 }}>
        <Link href="/dashboard/page-builder" style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: 700, color: '#e3e2e0', textDecoration: 'none', letterSpacing: '-0.02em' }}>DigitalAtelier Builder</Link>
        <div style={{ display: 'flex', gap: 2, marginLeft: 8 }}>
          {['Dashboard', 'Assets', 'Analytics'].map((t, i) => (
            <Link key={t} href={i === 0 ? '/dashboard/page-builder' : '#'} style={{ padding: '5px 14px', borderRadius: 8, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)' }}>{t}</Link>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <button type="button" style={{ padding: '7px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Preview</button>
          <button type="button" style={{ padding: '7px 16px', borderRadius: 10, background: 'linear-gradient(135deg,#6c5ce7,#a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Publish</button>
        </div>
      </div>

      {/* Full-page modal feel */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '460px 1fr', overflow: 'hidden' }}>
        {/* Left: Theme options */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.07)', padding: '32px 28px', overflowY: 'auto' }}>
          {/* Close / heading */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.8rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Theme Picker</h1>
            <Link href="/dashboard/page-builder" style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'rgba(227,226,224,0.6)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </Link>
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)', margin: '0 0 28px' }}>Customize the aesthetic personality of your storefront.</p>

          {/* Theme presets */}
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>THEME PRESETS</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
            {THEME_PRESETS.map(t => (
              <button key={t.id} type="button" onClick={() => setSelectedTheme(t.id)}
                style={{ borderRadius: 12, border: selectedTheme === t.id ? '2px solid #a8a4ff' : '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', overflow: 'hidden', background: 'none', padding: 0 }}>
                <div style={{ height: 64, background: t.bg }} />
                <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', textAlign: 'left' }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: selectedTheme === t.id ? '#a8a4ff' : 'rgba(227,226,224,0.7)', margin: 0 }}>{t.label}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Typography */}
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>TYPOGRAPHY PAIRING</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
            {FONT_PAIRS.map(f => (
              <button key={f.id} type="button" onClick={() => setSelectedFont(f.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, border: selectedFont === f.id ? '1px solid rgba(168,164,255,0.4)' : '1px solid rgba(255,255,255,0.1)', background: selectedFont === f.id ? 'rgba(168,164,255,0.08)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left' }}>
                <div>
                  <p style={{ fontFamily: f.id === 'noto' ? 'Fraunces, serif' : 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 2px' }}>{f.display}</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>{f.sub}</p>
                </div>
                {selectedFont === f.id ? (
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#a8a4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0e0e10" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                ) : (
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', flexShrink: 0 }} />
                )}
              </button>
            ))}
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.5)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.68-6"/></svg>
              Reset to Default
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Save Draft</button>
              <button type="button" onClick={handleApply} style={{ padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', border: 'none', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? 'Applying...' : 'Apply Theme'}</button>
            </div>
          </div>
        </div>

        {/* Right: Live preview */}
        <div style={{ padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 400, marginBottom: 20 }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>LIVE PREVIEW</p>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" onClick={() => setPreviewMode('desktop')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, border: previewMode === 'desktop' ? '1px solid rgba(168,164,255,0.3)' : '1px solid rgba(255,255,255,0.1)', background: previewMode === 'desktop' ? 'rgba(168,164,255,0.1)' : 'none', color: previewMode === 'desktop' ? '#a8a4ff' : 'rgba(227,226,224,0.4)', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', cursor: 'pointer' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                Desktop
              </button>
              <button type="button" onClick={() => setPreviewMode('mobile')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, border: previewMode === 'mobile' ? '1px solid rgba(168,164,255,0.3)' : '1px solid rgba(255,255,255,0.1)', background: previewMode === 'mobile' ? 'rgba(168,164,255,0.1)' : 'none', color: previewMode === 'mobile' ? '#a8a4ff' : 'rgba(227,226,224,0.4)', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', cursor: 'pointer' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                Mobile
              </button>
            </div>
          </div>

          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: 'rgba(227,226,224,0.6)', marginBottom: 16 }}>Priya&apos;s Storefront</p>

          {/* Phone preview */}
          <div style={{ width: 220, borderRadius: 24, border: '2px solid rgba(255,255,255,0.15)', overflow: 'hidden', background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
            {/* Phone chrome top */}
            <div style={{ height: 8, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 40, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
            </div>

            {/* Storefront */}
            <div style={{ background: selectedTheme === 'bloom' ? '#e8e0d8' : selectedTheme === 'sand' ? '#c8b89a' : '#111', padding: '16px' }}>
              {/* Avatar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)' }} />
              </div>
              {/* Name */}
              <p style={{ fontFamily: selectedFont === 'noto' ? 'Fraunces, serif' : 'DM Sans, sans-serif', fontSize: '18px', fontWeight: 700, color: selectedTheme === 'bloom' || selectedTheme === 'sand' ? '#111' : '#fff', textAlign: 'center', margin: '0 0 2px' }}>The Digital Atelier</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: selectedTheme === 'bloom' || selectedTheme === 'sand' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', textAlign: 'center', margin: '0 0 8px' }}>by Priya Sharma</p>
              {/* Tags */}
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 12 }}>
                {['CURATOR', 'ARTISAN'].map(tag => (
                  <span key={tag} style={{ padding: '3px 10px', borderRadius: 6, background: 'rgba(168,164,255,0.2)', fontFamily: 'DM Sans, sans-serif', fontSize: '8px', fontWeight: 700, color: '#a8a4ff', letterSpacing: '0.06em' }}>{tag}</span>
                ))}
              </div>
              {/* Bio lines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 12 }}>
                {[70, 90, 60].map((w, i) => (
                  <div key={i} style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)', width: `${w}%`, margin: '0 auto' }} />
                ))}
              </div>
              {/* Product thumbnails */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ height: 70, borderRadius: 10, background: 'linear-gradient(135deg,#92400e,#d97706)' }} />
                <div style={{ height: 70, borderRadius: 10, background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }} />
              </div>
              {/* CTA */}
              <button type="button" style={{ width: '100%', marginTop: 10, padding: '10px', borderRadius: 10, background: '#a8a4ff', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: '#0e0e10', cursor: 'pointer' }}>Subscribe to Collection</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
