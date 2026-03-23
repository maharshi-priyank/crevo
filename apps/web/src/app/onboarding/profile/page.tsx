'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { updateProfile } from '@/lib/api'

const STEPS = ['Welcome', 'Category', 'Claim Link', 'Profile Photo', 'Bank & KYC']
const CATEGORIES = [
  { value: 'education', label: 'Education', emoji: '📚' },
  { value: 'music', label: 'Music', emoji: '🎵' },
  { value: 'fitness', label: 'Fitness', emoji: '💪' },
  { value: 'art', label: 'Art & Design', emoji: '🎨' },
  { value: 'photography', label: 'Photography', emoji: '📸' },
  { value: 'cooking', label: 'Cooking', emoji: '🍳' },
  { value: 'finance', label: 'Finance', emoji: '💰' },
  { value: 'tech', label: 'Tech', emoji: '💻' },
  { value: 'lifestyle', label: 'Lifestyle', emoji: '✨' },
  { value: 'other', label: 'Other', emoji: '🌟' },
]

export default function OnboardingProfilePage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [step, setStep] = useState(1)
  const [displayName, setDisplayName] = useState('')
  const [category, setCategory] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const progress = ((step - 1) / (STEPS.length - 1)) * 100

  async function handleContinue() {
    if (step < STEPS.length) {
      setStep(s => s + 1)
    } else {
      setLoading(true)
      setError('')
      try {
        const token = await getToken()
        if (token) {
          await updateProfile(token, { displayName, bio, category: category || undefined })
        }
        router.push('/onboarding/username')
      } catch {
        setError('Something went wrong. Please try again.')
        setLoading(false)
      }
    }
  }

  function handleBack() {
    if (step > 1) setStep(s => s - 1)
    else router.push('/welcome')
  }

  const canContinue = step === 1 ? displayName.trim().length > 0 : step === 2 ? !!category : true

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#e3e2e0' }}>
      {/* Top header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 0' }}>
        <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '18px', color: '#0e0e10' }}>Crevo</span>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(14,14,16,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>STEP {step} OF {STEPS.length}</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'rgba(14,14,16,0.12)', margin: '12px 0 0' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#6c5ce7', borderRadius: 2, transition: 'width 0.4s ease' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '32px 24px 24px', display: 'flex', flexDirection: 'column' }}>

        {step === 1 && (
          <>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', fontWeight: 700, color: '#0e0e10', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 8 }}>
              What&apos;s your name?
            </h1>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(14,14,16,0.5)', marginBottom: 32, lineHeight: 1.5 }}>
              This will be your creator identity on Crevo.
            </p>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(14,14,16,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Riya Designs"
                autoFocus
                style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: '1.5px solid rgba(14,14,16,0.15)', background: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#0e0e10', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(14,14,16,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Short Bio <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value.slice(0, 160))}
                placeholder="Tell your audience about yourself..."
                rows={3}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: '1.5px solid rgba(14,14,16,0.15)', background: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#0e0e10', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5 }}
              />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(14,14,16,0.3)', float: 'right' }}>{bio.length}/160</span>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', fontWeight: 700, color: '#0e0e10', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 8 }}>
              What do you create?
            </h1>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(14,14,16,0.5)', marginBottom: 28, lineHeight: 1.5 }}>
              This helps us personalise your experience.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {CATEGORIES.map(c => (
                <button key={c.value} type="button" onClick={() => setCategory(c.value)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderRadius: 14, border: category === c.value ? '2px solid #6c5ce7' : '1.5px solid rgba(14,14,16,0.12)', background: category === c.value ? 'rgba(108,92,231,0.08)' : '#fff', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}>
                  <span style={{ fontSize: '20px' }}>{c.emoji}</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: category === c.value ? 700 : 500, color: category === c.value ? '#6c5ce7' : '#0e0e10' }}>{c.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', fontWeight: 700, color: '#0e0e10', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 8 }}>
              Claim your link
            </h1>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(14,14,16,0.5)', marginBottom: 28, lineHeight: 1.5 }}>
              This will be your home on the internet. Make it memorable.
            </p>
            <div style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid rgba(14,14,16,0.12)' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(14,14,16,0.35)' }}>crevo.in/</span>
              <input
                type="text"
                defaultValue="riya_designs"
                style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#0e0e10', fontWeight: 600, background: 'transparent' }}
              />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#10b981', fontWeight: 600 }}>Username is available</span>
            </div>
            {/* Suggestions */}
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(14,14,16,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>SUGGESTED FOR YOU</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {['@riya.creates', '@crevoriya', '@riyadesignhouse'].map(s => (
                <button key={s} type="button" style={{ padding: '8px 14px', borderRadius: 100, border: '1.5px solid rgba(14,14,16,0.15)', background: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#0e0e10', cursor: 'pointer' }}>{s}</button>
              ))}
            </div>
            {/* Profile preview */}
            <div style={{ background: '#0e0e10', borderRadius: 16, padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)', flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Riya Designs</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#a8a4ff', margin: 0 }}>crevo.in/riya_designs</p>
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', fontWeight: 700, color: '#0e0e10', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 8 }}>
              Add a profile photo
            </h1>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(14,14,16,0.5)', marginBottom: 32, lineHeight: 1.5 }}>
              Creators with photos earn 3× more trust.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(14,14,16,0.08)', border: '2px dashed rgba(14,14,16,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(14,14,16,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              <button type="button" style={{ padding: '12px 24px', borderRadius: 100, border: '1.5px solid rgba(14,14,16,0.15)', background: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#0e0e10', cursor: 'pointer' }}>Upload Photo</button>
              <button type="button" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(14,14,16,0.4)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Skip for now</button>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', fontWeight: 700, color: '#0e0e10', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 8 }}>
              Almost done!
            </h1>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(14,14,16,0.5)', marginBottom: 28, lineHeight: 1.5 }}>
              Set up your bank account to receive payouts. You can skip this for now.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '✅', title: 'Profile Created', desc: 'Your Crevo profile is ready' },
                { icon: '✅', title: 'Store URL Claimed', desc: 'crevo.in/riya_designs' },
                { icon: '⏳', title: 'Bank & KYC', desc: 'Required to withdraw earnings' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1.5px solid rgba(14,14,16,0.08)' }}>
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  <div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#0e0e10', margin: 0 }}>{item.title}</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(14,14,16,0.45)', margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {error && (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#ef4444', textAlign: 'center', marginBottom: 8 }}>
            {error}
          </p>
        )}

        {/* Bottom navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 24 }}>
          <button type="button" onClick={handleBack} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, background: 'rgba(14,14,16,0.08)', border: 'none', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0e0e10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue && step <= 2}
            style={{ padding: '14px 32px', borderRadius: 14, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '16px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, opacity: (!canContinue && step <= 2) ? 0.5 : 1, boxShadow: '0 6px 20px rgba(108,92,231,0.3)' }}
          >
            {loading ? (
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            ) : step === STEPS.length ? 'Go to Dashboard' : 'Continue'}
          </button>
        </div>
      </div>
    </main>
  )
}
