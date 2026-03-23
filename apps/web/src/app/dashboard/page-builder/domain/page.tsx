'use client'

import { useState } from 'react'
import Link from 'next/link'

const STEPS = [
  { id: 1, label: 'Select Domain', status: 'in-progress' },
  { id: 2, label: 'DNS Configuration', status: 'pending' },
  { id: 3, label: 'Verification', status: 'pending' },
]

export default function CustomDomainPage() {
  const [domain, setDomain] = useState('')
  const [validated, setValidated] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle')
  const [checking, setChecking] = useState(false)

  async function handleValidate() {
    if (!domain.trim()) return
    setValidated('checking')
    setChecking(true)
    await new Promise(r => setTimeout(r, 1400))
    setChecking(false)
    setValidated(domain.includes('.') ? 'valid' : 'invalid')
  }

  return (
    <div style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', minHeight: '100%' }}>
      {/* Builder topbar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', height: 52, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, position: 'sticky', top: 0, background: '#0e0e10', zIndex: 10 }}>
        <Link href="/dashboard/page-builder" style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: 700, color: '#e3e2e0', textDecoration: 'none', letterSpacing: '-0.02em' }}>DigitalAtelier Builder</Link>
        <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          {['Dashboard', 'Assets', 'Analytics'].map((t, i) => (
            <Link key={t} href={i === 0 ? '/dashboard/page-builder' : '#'} style={{ padding: '5px 14px', borderRadius: 8, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)' }}>{t}</Link>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <button type="button" style={{ padding: '7px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Preview</button>
          <button type="button" style={{ padding: '7px 16px', borderRadius: 10, background: 'linear-gradient(135deg,#6c5ce7,#a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Publish</button>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px' }}>
        {/* Page title */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 10px', letterSpacing: '-0.03em' }}>Custom Domain Setup</h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(227,226,224,0.5)', margin: 0, lineHeight: 1.6 }}>Personalize your atelier&apos;s digital presence. Connect a professional domain to build trust and elevate your brand identity.</p>
        </div>

        {/* Current URL banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(168,164,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>CURRENT ACTIVE URL</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>crevo.in/priyafitness</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.12)', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: '#10b981' }}>● ACTIVE</span>
            <span style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(168,164,255,0.12)', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: '#a8a4ff' }}>🔒 SECURED</span>
          </div>
        </div>

        {/* Steps + Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32 }}>
          {/* Step list */}
          <div>
            {STEPS.map((step, i) => (
              <div key={step.id} style={{ display: 'flex', gap: 12, marginBottom: i < STEPS.length - 1 ? 0 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: step.status === 'in-progress' ? '#a8a4ff' : 'rgba(255,255,255,0.08)', border: step.status === 'in-progress' ? 'none' : '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: step.status === 'in-progress' ? '#0e0e10' : 'rgba(227,226,224,0.4)' }}>{step.id}</span>
                  </div>
                  {i < STEPS.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 40, background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />}
                </div>
                <div style={{ paddingTop: 6, paddingBottom: i < STEPS.length - 1 ? 32 : 0 }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: step.status === 'in-progress' ? 700 : 400, color: step.status === 'in-progress' ? '#e3e2e0' : 'rgba(227,226,224,0.4)', margin: 0 }}>{step.label}</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: step.status === 'in-progress' ? '#a8a4ff' : 'rgba(227,226,224,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '2px 0 0' }}>{step.status === 'in-progress' ? 'IN PROGRESS' : 'PENDING'}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Step content */}
          <div>
            {/* Step 1 */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 16px' }}>Step 1: Choose your domain name</h2>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px' }}>
                  <input value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleValidate()} placeholder="e.g. priyasharma.in" style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#e3e2e0' }} />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <button type="button" onClick={handleValidate} disabled={checking} style={{ padding: '12px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#6c5ce7,#a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, border: 'none', cursor: checking ? 'wait' : 'pointer', flexShrink: 0, opacity: checking ? 0.7 : 1 }}>
                  {checking ? 'Checking...' : 'Validate Domain'}
                </button>
              </div>
              {validated === 'valid' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#10b981', fontWeight: 600 }}>{domain} is available! Proceed to DNS setup.</span>
                </div>
              )}
              {validated === 'invalid' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#ef4444', fontWeight: 600 }}>Please enter a valid domain name (e.g. example.com)</span>
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Step 2: Update DNS Records</h2>
                <span style={{ padding: '4px 10px', borderRadius: 7, background: 'rgba(239,68,68,0.12)', fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.06em' }}>HIGH PRIORITY</span>
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.55)', marginBottom: 16, lineHeight: 1.7 }}>
                Login to your domain registrar (GoDaddy, Namecheap, etc.) and add the following CNAME record to your DNS settings.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 100px 1fr', padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['TYPE', 'NAME', 'VALUE'].map(h => <span key={h} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 100px 1fr', padding: '14px 20px', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#a8a4ff' }}>CNAME</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#e3e2e0' }}>@ #</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0' }}>cname.crevo.in #</span>
                    <button type="button" style={{ padding: '4px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.6)', cursor: 'pointer' }}>Copy</button>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.4)' }}>Direct registrar links:</span>
                {['GoDaddy', 'Google Domains', 'Namecheap', 'Cloudflare'].map(r => (
                  <a key={r} href="#" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#a8a4ff', textDecoration: 'none', fontWeight: 600 }}>{r}</a>
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 20px' }}>Step 3: Verification Status</h2>
              <div style={{ textAlign: 'center', padding: '36px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(168,164,255,0.1)', border: '2px solid rgba(168,164,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.68-6"/></svg>
                </div>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 8px' }}>Propagating Changes</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)', margin: '0 0 20px', lineHeight: 1.6 }}>DNS changes can take up to 24–48 hours to propagate worldwide, but usually happen within minutes.</p>
                <button type="button" style={{ padding: '10px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Check Again</button>
              </div>
            </div>

            {/* Trouble section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 8px' }}>Having trouble?</h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)', margin: '0 0 16px', lineHeight: 1.6 }}>Our team is here to help you navigate the technicalities of custom domains. Browse our guide or chat with an expert.</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  <a href="#" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#a8a4ff', textDecoration: 'none' }}>Read Guide →</a>
                  <a href="/dashboard/support" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: 'rgba(227,226,224,0.6)', textDecoration: 'none' }}>Talk to Support</a>
                </div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, rgba(108,92,231,0.15), rgba(168,164,255,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(168,164,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(168,164,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
