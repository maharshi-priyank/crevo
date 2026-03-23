'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

function OtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || '9876543210'
  const maskedPhone = `+91 ${phone.slice(0, 5)} xxxxx`

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(28)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (timeLeft <= 0) return
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft])

  function handleInput(idx: number, val: string) {
    const char = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[idx] = char
    setDigits(next)
    setError('')
    if (char && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    const otp = digits.join('')
    if (otp.length < 6) return
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 800))
    if (otp === '123456') {
      router.push('/onboarding/profile')
    } else {
      setError('Invalid OTP. Please try again.')
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
      setLoading(false)
    }
  }

  const isError = !!error
  const otp = digits.join('')

  return (
    <main className="min-h-screen flex flex-col px-6 py-6" style={{ background: '#0e0e10' }}>
      {/* Glow */}
      <div className="absolute pointer-events-none" style={{ top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 350, height: 350, borderRadius: '50%', background: 'rgba(108,92,231,0.10)', filter: 'blur(80px)' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48 }}>
        <Link href="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.07)', textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e3e2e0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </Link>
        <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '18px', color: '#e3e2e0' }}>Crevo</span>
        <div style={{ width: 36 }} />
      </div>

      {/* Content */}
      <div className="flex-1 relative z-10">
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.4rem', fontWeight: 700, color: '#e3e2e0', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 12 }}>
          Verify your<br />number
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.5)', marginBottom: 40 }}>
          OTP sent to <strong style={{ color: '#e3e2e0' }}>{maskedPhone}</strong>
        </p>

        <form onSubmit={handleVerify}>
          {/* OTP boxes */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleInput(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                style={{
                  flex: 1,
                  height: 56,
                  borderRadius: 12,
                  border: isError ? '2px solid rgba(239,68,68,0.6)' : d ? '2px solid rgba(168,164,255,0.8)' : '1.5px solid rgba(255,255,255,0.12)',
                  background: isError ? 'rgba(239,68,68,0.08)' : d ? 'rgba(168,164,255,0.08)' : 'rgba(255,255,255,0.05)',
                  color: isError ? '#f87171' : '#e3e2e0',
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: 700,
                  fontFamily: 'DM Sans, sans-serif',
                  outline: 'none',
                }}
              />
            ))}
          </div>

          {/* Error message */}
          {isError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '10px 14px', marginBottom: 20 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="rgba(239,68,68,0.9)"/><line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#f87171' }}>{error}</span>
            </div>
          )}

          {/* Resend / Change */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {timeLeft > 0 ? `RESEND IN 0:${String(timeLeft).padStart(2, '0')}` : (
                <button type="button" onClick={() => setTimeLeft(28)} style={{ background: 'none', border: 'none', color: '#a8a4ff', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, padding: 0 }}>RESEND OTP</button>
              )}
            </span>
            <Link href="/login" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)', textDecoration: 'none' }}>Change number</Link>
          </div>

          <button
            type="submit"
            disabled={otp.length < 6 || loading}
            style={{ width: '100%', padding: '16px', borderRadius: 16, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '17px', border: 'none', cursor: otp.length < 6 ? 'not-allowed' : 'pointer', opacity: otp.length < 6 ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(108,92,231,0.3)' }}
          >
            {loading ? (
              <><svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Verifying OTP...</>
            ) : 'Verify & Continue'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function OtpPage() {
  return (
    <Suspense>
      <OtpForm />
    </Suspense>
  )
}
