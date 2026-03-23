'use client'

import { useState } from 'react'
import Link from 'next/link'

const CONTENT_BLOCKS = [
  { id: 'credilink', label: 'Credilink Score', sublabel: 'Current: 847 (Elite)', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, enabled: true },
  { id: 'revenue', label: 'Revenue Stats', sublabel: null, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, enabled: true },
  { id: 'audience', label: 'Audience Demographics', sublabel: null, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, enabled: true },
  { id: 'catalog', label: 'Product Catalog', sublabel: null, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg>, enabled: false },
]

const VISUAL_COLORS = ['#a8a4ff', '#f472b6', '#e3e2e0']


export default function MediaKitPage() {
  const [blocks, setBlocks] = useState(CONTENT_BLOCKS)
  const [legalName, setLegalName] = useState('Priya Sharma')
  const [instagram, setInstagram] = useState('priyafitness')
  const [niche, setNiche] = useState('Health & Holistic Wellness')
  const [selectedColor, setSelectedColor] = useState(VISUAL_COLORS[0])
  const [generating, setGenerating] = useState(false)

  function toggleBlock(id: string) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, enabled: !b.enabled } : b))
  }

  async function handleDownload() {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1200))
    setGenerating(false)
  }

  return (
    <div style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', minHeight: '100%', display: 'flex' }}>
      {/* Middle: Editor */}
      <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.07)', padding: '32px 36px', overflowY: 'auto', maxWidth: 520 }}>
        {/* Top nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: '#a8a4ff' }}>Credilink</span>
          {['Dashboard', 'Analytics', 'Community'].map((t, i) => (
            <span key={t} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)', cursor: 'pointer' }}>{t}</span>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <button type="button" style={{ padding: '7px 16px', borderRadius: 10, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Create New</button>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)' }} />
          </div>
        </div>

        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 6px' }}>Build your kit</h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.5)', marginBottom: 28 }}>AI has generated a base draft from your social data.</p>

        {/* Profile details */}
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 20px' }}>Profile Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>LEGAL NAME</label>
            <input type="text" value={legalName} onChange={e => setLegalName(e.target.value)} style={{ width: '100%', padding: '11px 13px', borderRadius: 11, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>INSTAGRAM @</label>
            <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} style={{ width: '100%', padding: '11px 13px', borderRadius: 11, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#a8a4ff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>CONTENT NICHE</label>
          <input type="text" value={niche} onChange={e => setNiche(e.target.value)} style={{ width: '100%', padding: '11px 13px', borderRadius: 11, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        {/* Content blocks */}
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 16px' }}>Content Blocks</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {blocks.map(block => (
            <div key={block.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{block.icon}</div>
                <div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#e3e2e0', margin: 0 }}>{block.label}</p>
                  {block.sublabel && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#a8a4ff', margin: 0 }}>{block.sublabel}</p>}
                </div>
              </div>
              <div onClick={() => toggleBlock(block.id)} style={{ width: 42, height: 24, borderRadius: 12, background: block.enabled ? '#a8a4ff' : 'rgba(255,255,255,0.12)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 3, left: block.enabled ? 20 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Visual style */}
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 12px' }}>Visual Style</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          {VISUAL_COLORS.map(color => (
            <button key={color} type="button" onClick={() => setSelectedColor(color)} style={{ width: 40, height: 40, borderRadius: '50%', background: color, border: `3px solid ${selectedColor === color ? '#fff' : 'transparent'}`, cursor: 'pointer', transition: 'border 0.15s', boxShadow: selectedColor === color ? '0 0 0 2px rgba(255,255,255,0.3)' : 'none' }} />
          ))}
        </div>
      </div>

      {/* Right: Preview */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px' }}>
        {/* Kit preview card */}
        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', marginBottom: 20 }}>
          {/* Hero image placeholder */}
          <div style={{ height: 240, background: 'linear-gradient(135deg, #1a1a2e, #2d2d44)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)" stroke="none"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
            </div>
            <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: 10, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: '#a8a4ff' }}>CREDILINK SCORE 847</span>
            </div>
          </div>
          {/* Profile info */}
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '3rem', fontWeight: 700, color: '#0e0e10', margin: '0 0 12px', lineHeight: 1 }}>{legalName.split(' ')[0]}<br />{legalName.split(' ').slice(1).join(' ')}</h2>
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                { label: 'NICHE', value: niche.split(' & ')[0] + (niche.includes(' & ') ? '\n& ' + niche.split(' & ')[1] : '') },
                { label: 'FOLLOWERS', value: '82.4K+' },
                { label: 'HANDLE', value: `@${instagram}` },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', fontWeight: 700, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>{s.label}</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#0e0e10', margin: 0, whiteSpace: 'pre-line' }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview text card */}
        <div style={{ background: '#1a1a2e', borderRadius: 16, padding: '20px', marginBottom: 20 }}>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontStyle: 'italic', color: '#e3e2e0', margin: '0 0 8px', lineHeight: 1.5 }}>
            &ldquo;The ...&rdquo;
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)', margin: 0 }}>
            {legalName} is a leading voice in holistic fitness and sustainability.
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={handleDownload} disabled={generating} style={{ flex: 1, padding: '14px', borderRadius: 14, background: '#a8a4ff', color: '#0e0e10', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 20px rgba(168,164,255,0.3)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {generating ? 'Generating...' : 'Download PDF'}
          </button>
          <button type="button" style={{ flex: 1, padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Share link
          </button>
        </div>
      </div>
    </div>
  )
}
