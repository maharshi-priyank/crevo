'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SignUp } from '@clerk/nextjs'

const isStub = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'pk_test_stub'

function StubSignUpForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    router.push('/onboarding/profile')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5 font-sans">Full name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Sharma" required
          className="w-full px-3.5 py-3 text-sm text-white bg-white/[0.06] border border-white/[0.12] rounded-xl placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/60 transition-all font-sans" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5 font-sans">Phone number</label>
        <div className="flex">
          <div className="flex items-center px-3.5 bg-white/[0.04] border border-r-0 border-white/[0.12] rounded-l-xl text-white/50 text-sm font-medium shrink-0 font-sans">+91</div>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="98765 43210" required
            className="flex-1 px-3.5 py-3 text-sm text-white bg-white/[0.06] border border-white/[0.12] rounded-r-xl placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/60 transition-all font-sans" />
        </div>
      </div>
      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-brand text-white rounded-xl py-3 text-sm font-display font-bold transition-all hover:-translate-y-0.5 shadow-violet-glow disabled:opacity-60">
        {loading ? 'Creating...' : 'Continue'}
      </button>
    </form>
  )
}

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: '#07070f' }}>
      <div className="absolute pointer-events-none" style={{ top: '33%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', background: 'rgba(124,58,237,0.10)', filter: 'blur(100px)' }} />
      <div className="absolute pointer-events-none" style={{ top: '25%', left: '25%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(249,115,22,0.06)', filter: 'blur(80px)' }} />

      <div className="relative z-10 w-full max-w-sm animate-page-enter">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-violet-glow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span className="font-display font-bold text-white text-lg">Creator OS</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-extrabold text-white mb-2">Start selling today</h1>
          <p className="text-white/40 text-sm font-sans">No credit card needed. Free forever plan.</p>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.10] rounded-2xl overflow-hidden backdrop-blur-sm">
          {isStub ? (
            <div className="p-7">
              <StubSignUpForm />
              <div className="mt-5 pt-5 border-t border-white/[0.08] text-center">
                <p className="text-sm text-white/40 font-sans">Already have an account?{' '}
                  <Link href="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">Log in</Link>
                </p>
              </div>
            </div>
          ) : (
            <SignUp
              routing="path"
              path="/signup"
              appearance={{
                variables: {
                  colorPrimary: '#7C3AED',
                  colorBackground: 'transparent',
                  colorText: '#ffffff',
                  colorTextSecondary: 'rgba(255,255,255,0.5)',
                  colorInputBackground: 'rgba(255,255,255,0.06)',
                  colorInputText: '#ffffff',
                  borderRadius: '12px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                },
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none bg-transparent border-0 p-7',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 'border border-white/10 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 bg-white/5',
                  formButtonPrimary: 'bg-gradient-to-r from-violet-600 to-violet-700 rounded-xl text-sm font-bold',
                  formFieldInput: 'rounded-xl border-white/10 bg-white/5 text-white text-sm',
                  formFieldLabel: 'text-white/50 text-xs font-semibold uppercase tracking-wider',
                  footerActionLink: 'text-violet-400 font-semibold',
                  dividerLine: 'bg-white/10',
                  dividerText: 'text-white/30',
                },
              }}
            />
          )}
        </div>

        <p className="text-center text-xs text-white/20 mt-6 font-sans">
          By continuing, you agree to our{' '}
          <span className="underline cursor-pointer hover:text-white/40 transition-colors">Terms</span>
          {' '}and{' '}
          <span className="underline cursor-pointer hover:text-white/40 transition-colors">Privacy Policy</span>.
        </p>
      </div>
    </main>
  )
}
