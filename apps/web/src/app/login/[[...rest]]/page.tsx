'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhone(v)
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    if (phone.length < 10) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    router.push(`/login/otp?phone=${phone}`)
  }

  const formatted = phone.replace(/(\d{5})(\d{0,5})/, '$1 $2').trim()

  return (
    <main className="min-h-screen flex flex-col items-center justify-between px-6 py-10 relative" style={{ background: '#0e0e10' }}>
      {/* Glow */}
      <div className="absolute pointer-events-none" style={{ top: '25%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, borderRadius: '50%', background: 'rgba(108,92,231,0.12)', filter: 'blur(80px)' }} />

      {/* Logo top center */}
      <div className="w-full flex flex-col items-center pt-8 z-10">
        <Link href="/welcome">
          <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(168,164,255,0.2)', border: '1px solid rgba(168,164,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '22px', color: '#a8a4ff' }}>C</span>
          </div>
        </Link>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '24px', color: '#e3e2e0', letterSpacing: '-0.01em' }}>Crevo</h2>
      </div>

      {/* Form section */}
      <div className="w-full max-w-sm z-10">
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', fontWeight: 700, color: '#e3e2e0', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 10 }}>
          Enter your mobile<br />number
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(227,226,224,0.5)', marginBottom: 32, lineHeight: 1.5 }}>
          We&apos;ll send you a 6-digit OTP on WhatsApp or SMS
        </p>

        <form onSubmit={handleSendOtp}>
          {/* Phone input */}
          <div style={{ borderBottom: '1.5px solid rgba(168,164,255,0.4)', marginBottom: 32, paddingBottom: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* India flag + code */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 12px', flexShrink: 0 }}>
              <span style={{ fontSize: '18px' }}>🇮🇳</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, color: '#e3e2e0', fontSize: '15px' }}>+91</span>
            </div>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="00000 00000"
              value={formatted}
              onChange={handleInput}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '18px', color: '#e3e2e0', letterSpacing: '0.05em' }}
            />
          </div>

          <button
            type="submit"
            disabled={phone.length < 10 || loading}
            style={{ width: '100%', padding: '16px', borderRadius: 16, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '17px', border: 'none', cursor: phone.length < 10 ? 'not-allowed' : 'pointer', opacity: phone.length < 10 ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(108,92,231,0.3)', transition: 'all 0.2s' }}
          >
            {loading ? (
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            ) : (
              <>Send OTP <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.3)', marginTop: 20, lineHeight: 1.6 }}>
          By continuing, you agree to our{' '}
          <Link href="/terms" style={{ color: '#a8a4ff', textDecoration: 'none' }}>Terms</Link> &amp;{' '}
          <Link href="/privacy" style={{ color: '#a8a4ff', textDecoration: 'none' }}>Privacy Policy</Link>
        </p>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, z: 10 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.3)' }}>Secured by Crevo · No spam</span>
      </div>
    </main>
  )
}
