'use client'

import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between px-6 py-10 relative" style={{ background: '#0e0e10' }}>
      {/* Glow */}
      <div className="absolute pointer-events-none" style={{ top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 420, height: 420, borderRadius: '50%', background: 'rgba(108,92,231,0.10)', filter: 'blur(90px)' }} />

      {/* Logo */}
      <div className="w-full flex flex-col items-center pt-8 z-10">
        <Link href="/">
          <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(168,164,255,0.2)', border: '1px solid rgba(168,164,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '22px', color: '#a8a4ff' }}>C</span>
          </div>
        </Link>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '24px', color: '#e3e2e0', letterSpacing: '-0.01em' }}>Crevo</h2>
      </div>

      {/* Clerk SignUp */}
      <div className="w-full max-w-sm z-10">
        <SignUp
          routing="path"
          path="/signup"
          signInUrl="/login"
          appearance={{
            variables: {
              colorPrimary: '#6c5ce7',
              colorBackground: '#161618',
              colorText: '#e3e2e0',
              colorTextSecondary: 'rgba(227,226,224,0.5)',
              colorInputBackground: 'rgba(255,255,255,0.05)',
              colorInputText: '#e3e2e0',
              borderRadius: '12px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '15px',
            },
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none border border-white/[0.08] bg-[#161618] rounded-2xl',
              headerTitle: 'font-display text-2xl font-bold text-[#e3e2e0]',
              headerSubtitle: 'text-sm text-white/40',
              socialButtonsBlockButton: 'border border-white/10 rounded-xl text-sm font-medium text-white/70 hover:bg-white/[0.07] bg-white/[0.04] transition-all',
              socialButtonsBlockButtonText: 'font-medium',
              dividerLine: 'bg-white/[0.08]',
              dividerText: 'text-white/25 text-xs',
              formFieldInput: 'rounded-xl border-white/[0.1] bg-white/[0.05] text-[#e3e2e0] text-sm focus:border-[#a8a4ff]/60 focus:ring-[#a8a4ff]/20',
              formFieldLabel: 'text-white/50 text-xs font-semibold uppercase tracking-wider',
              formButtonPrimary: 'bg-gradient-to-br from-[#6c5ce7] to-[#a8a4ff] rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-lg',
              footerActionLink: 'text-[#a8a4ff] font-semibold hover:text-[#c4c0ff] transition-colors',
              footerActionText: 'text-white/40 text-sm',
              identityPreviewText: 'text-white/70',
              identityPreviewEditButton: 'text-[#a8a4ff]',
              formResendCodeLink: 'text-[#a8a4ff]',
              alertText: 'text-sm',
              formFieldInputShowPasswordButton: 'text-white/40',
            },
          }}
        />
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.3)' }}>Secured by Crevo · No spam</span>
      </div>
    </main>
  )
}
