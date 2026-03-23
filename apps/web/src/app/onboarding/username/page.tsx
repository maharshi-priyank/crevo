'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth, useUser } from '@clerk/nextjs'
import { claimUsername } from '@/lib/api'

function validate(v: string) {
  if (v.length < 3 || v.length > 30) return false
  if (!/^[a-zA-Z]/.test(v)) return false
  return /^[a-zA-Z0-9._]+$/.test(v)
}

export default function UsernamePickerPage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const { user } = useUser()
  const [slug, setSlug] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) { setStatus('idle'); return }
    if (!validate(slug)) { setStatus('taken'); return }
    setStatus('available')
  }, [slug])

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault()
    if (status !== 'available' || loading) return
    setLoading(true)
    setError('')
    setSuggestions([])
    try {
      const token = await getToken()
      const email = user?.primaryEmailAddress?.emailAddress ?? ''
      await claimUsername(token ?? '', slug, email)
      router.push(`/onboarding/complete?slug=${encodeURIComponent(slug)}`)
    } catch (err: unknown) {
      setLoading(false)
      if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'USERNAME_CONFLICT') {
        setStatus('taken')
        const apiErr = err as { suggestions?: string[] }
        if (apiErr.suggestions) setSuggestions(apiErr.suggestions)
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
  }

  const rules = [
    { ok: slug.length >= 3 && slug.length <= 30, text: '3–30 characters long' },
    { ok: /^[a-zA-Z0-9._]+$/.test(slug) && slug.length > 0, text: 'Letters, numbers, dots, or underscores' },
    { ok: /^[a-zA-Z]/.test(slug) && slug.length > 0, text: 'Must start with a letter' },
  ]

  return (
    <main className="min-h-screen flex flex-col px-6 py-6" style={{ background: '#0e0e10' }}>
      {/* Glow */}
      <div className="absolute pointer-events-none inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(108,92,231,0.12) 0%, transparent 70%)' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, position: 'relative', zIndex: 10 }}>
        <Link href="/onboarding/profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.07)', textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e3e2e0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </Link>
        <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '18px', color: '#e3e2e0' }}>Crevo</span>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.6rem', fontWeight: 700, color: '#e3e2e0', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 10 }}>
          Your Unique<br />Horizon
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.5)', marginBottom: 28, lineHeight: 1.5 }}>
          Design your digital footprint with a custom URL that feels as premium as your craft.
        </p>

        {/* Live preview */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 16px', marginBottom: 24 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>LIVE PREVIEW</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '22px', fontWeight: 700, color: '#a8a4ff', margin: 0 }}>
            <span style={{ color: 'rgba(227,226,224,0.35)', fontWeight: 400 }}>crevo.in/</span>
            <span style={{ borderBottom: '2px solid #a8a4ff', paddingBottom: 2 }}>{slug || '_'}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleConfirm}>
          <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Choose your slug</label>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="your_slug"
              style={{ width: '100%', padding: '14px 16px', paddingRight: 110, borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${status === 'available' ? 'rgba(16,185,129,0.5)' : status === 'taken' ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`, color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '16px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
            />
            {/* Status badge */}
            <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 4 }}>
              {status === 'available' && (
                <>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>Available</span>
                </>
              )}
              {status === 'taken' && (
                <>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>Taken</span>
                </>
              )}
              {status === 'checking' && (
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.4)" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              )}
            </div>
          </div>

          {/* Rules */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
            {rules.map(r => (
              <div key={r.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={r.ok ? '#10b981' : 'rgba(227,226,224,0.3)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: r.ok ? 'rgba(227,226,224,0.8)' : 'rgba(227,226,224,0.35)' }}>{r.text}</span>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={status !== 'available' || loading}
            style={{ width: '100%', padding: '16px', borderRadius: 16, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '17px', border: 'none', cursor: status !== 'available' ? 'not-allowed' : 'pointer', opacity: status !== 'available' ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(108,92,231,0.3)', marginBottom: 12 }}
          >
            {loading ? (
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            ) : (
              <>Confirm this URL <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
            )}
          </button>

          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.3)', textAlign: 'center' }}>
            ⓘ Note: Slugs can only be changed once every 365 days.
          </p>

          {error && (
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#ef4444', textAlign: 'center', marginTop: 8 }}>
              {error}
            </p>
          )}

          {suggestions.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.5)', marginBottom: 8 }}>
                Try one of these:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setSlug(s); setSuggestions([]); setStatus('available') }}
                    style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(168,164,255,0.15)', border: '1px solid rgba(168,164,255,0.3)', color: '#a8a4ff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Profile preview card */}
        <div style={{ marginTop: 28, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)" stroke="none"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
              </div>
              <div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>{slug || 'your_slug'}</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>Digital Craftsman</p>
              </div>
            </div>
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.4)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.6)', marginBottom: 10, lineHeight: 1.5 }}>
            Curating the future of Sovereign Sophistication. 🏺<br />Based in New Bharat.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#a8a4ff' }}>crevo.in/{slug || 'your_slug'}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Follow', 'Message', '+'].map(btn => (
              <button key={btn} type="button" style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#e3e2e0', cursor: 'pointer', fontWeight: 500 }}>{btn}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 20, paddingBottom: 8, borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 20 }}>
        {[
          <svg key="home" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
          <svg key="explore" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
          <div key="add" style={{ width: 44, height: 44, borderRadius: '50%', background: '#a8a4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -10, boxShadow: '0 4px 16px rgba(168,164,255,0.4)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0e0e10" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>,
          <svg key="profile" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
        ].map((icon, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44 }}>{icon}</div>
        ))}
      </div>
    </main>
  )
}
