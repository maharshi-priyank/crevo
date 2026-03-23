'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SIDEBAR_ITEMS = [
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, label: 'Credilink Score', href: '/dashboard/credilink' },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, label: 'AI Media Kit', href: '/dashboard/media-kit' },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>, label: 'Bank & KYC', href: '/onboarding/bank-kyc', active: true },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, label: 'Billing & Payouts', href: '/dashboard/earnings' },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M5.34 5.34L3.93 6.75M21 12h-2M5 12H3M19.07 19.07l-1.41-1.41M5.34 18.66l-1.41 1.41M12 21v-2M12 5V3"/></svg>, label: 'Account Settings', href: '/dashboard/settings' },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, label: 'Support', href: '/dashboard/support' },
]

const PROGRESS_STEPS = [
  { label: 'Mobile', status: 'done' },
  { label: 'PAN', status: 'done' },
  { label: 'Bank', status: 'active' },
  { label: 'Video KYC', status: 'locked' },
]

export default function BankKycPage() {
  const router = useRouter()
  const [accountName, setAccountName] = useState('Arjun Malhotra')
  const [ifsc, setIfsc] = useState('HDFC0000124')
  const [accountNumber, setAccountNumber] = useState('••••••••••')
  const [accountType, setAccountType] = useState('Savings Account')
  const [schedule, setSchedule] = useState('weekly')
  const [threshold, setThreshold] = useState(500)
  const [loading, setLoading] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Creator Studio</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: '2px 0 0' }}>Pro Plan</p>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {SIDEBAR_ITEMS.map(item => (
            <Link key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', textDecoration: 'none', color: item.active ? '#a8a4ff' : 'rgba(227,226,224,0.5)', background: item.active ? 'rgba(168,164,255,0.1)' : 'transparent', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: item.active ? 600 : 400, transition: 'all 0.15s', borderLeft: item.active ? '2px solid #a8a4ff' : '2px solid transparent', marginLeft: 0 }}>
              <span style={{ opacity: item.active ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        {/* Upgrade card */}
        <div style={{ margin: '0 16px 16px', background: 'rgba(168,164,255,0.08)', border: '1px solid rgba(168,164,255,0.2)', borderRadius: 12, padding: '14px' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#a8a4ff', margin: '0 0 4px' }}>Upgrade to Elite</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.45)', margin: 0, lineHeight: 1.5 }}>Unlock custom domains &amp; lower commissions.</p>
        </div>
        <button type="button" onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.4)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Go to Dashboard
        </button>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Bank &amp; Payouts</h1>
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.4)" strokeWidth="2" style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Secured by Razorpay · RBI compliant
          </p>
        </div>

        {/* Warning banner */}
        <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 14, padding: '14px 18px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(251,191,36,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Add bank account to receive payouts</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.5)', margin: 0 }}>₹24,850 waiting in your creator wallet.</p>
            </div>
          </div>
          <button type="button" style={{ padding: '8px 18px', borderRadius: 10, background: '#fbbf24', color: '#0e0e10', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>Fix Now</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          {/* Left column */}
          <div>
            {/* Verification progress */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 24px', marginBottom: 20 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>VERIFICATION PROGRESS</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {PROGRESS_STEPS.map((s, i) => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', flex: i < PROGRESS_STEPS.length - 1 ? 1 : 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.status === 'done' ? '#a8a4ff' : s.status === 'active' ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.06)', border: s.status === 'active' ? '2px solid #fbbf24' : 'none' }}>
                        {s.status === 'done' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        {s.status === 'active' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
                        {s.status === 'locked' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                      </div>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: s.status === 'done' ? '#a8a4ff' : s.status === 'active' ? '#fbbf24' : 'rgba(227,226,224,0.3)', whiteSpace: 'nowrap' }}>{s.label}</span>
                    </div>
                    {i < PROGRESS_STEPS.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: i < 2 ? '#a8a4ff' : 'rgba(255,255,255,0.08)', margin: '0 8px', marginBottom: 24 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add bank account form */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Add Bank Account</h2>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.45)', margin: '4px 0 0' }}>Transfer earnings directly to your bank account.</p>
                </div>
                <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: 'rgba(168,164,255,0.1)', border: '1px solid rgba(168,164,255,0.25)', color: '#a8a4ff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  Verify via UPI
                </button>
              </div>

              <form onSubmit={handleSave} style={{ marginTop: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>ACCOUNT HOLDER NAME</label>
                    <input type="text" value={accountName} onChange={e => setAccountName(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>IFSC CODE</label>
                    <div style={{ position: 'relative' }}>
                      <input type="text" value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} style={{ width: '100%', padding: '12px 14px', paddingRight: 130, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                      {ifsc && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '2px 7px', fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: '#10b981', whiteSpace: 'nowrap' }}>HDFC PUNE BRANCH</span>}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>ACCOUNT NUMBER</label>
                    <input type="password" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '18px', outline: 'none', boxSizing: 'border-box', letterSpacing: '0.15em' }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>ACCOUNT TYPE</label>
                    <select value={accountType} onChange={e => setAccountType(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}>
                      <option style={{ background: '#1a1a2e' }}>Savings Account</option>
                      <option style={{ background: '#1a1a2e' }}>Current Account</option>
                    </select>
                  </div>
                </div>

                {/* Penny drop info */}
                <div style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#60a5fa', margin: '0 0 2px' }}>Penny drop verification</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.5)', margin: 0, lineHeight: 1.5 }}>We&apos;ll deposit ₹1 to verify your account details. This usually takes less than 60 seconds.</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', padding: '15px', borderRadius: 14, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '16px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(108,92,231,0.3)' }}
                >
                  {loading ? (
                    <><svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Verifying...</>
                  ) : 'Save & Verify Account'}
                </button>
              </form>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Payout settings */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Payout Settings</p>
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>SCHEDULE</p>
              {[
                { value: 'weekly', label: 'Weekly (Mon)' },
                { value: 'monthly', label: 'Monthly (1st)' },
                { value: 'ondemand', label: 'On-demand' },
              ].map(opt => (
                <div key={opt.value} onClick={() => setSchedule(opt.value)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: schedule === opt.value ? '#e3e2e0' : 'rgba(227,226,224,0.5)' }}>{opt.label}</span>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${schedule === opt.value ? '#a8a4ff' : 'rgba(255,255,255,0.2)'}`, background: schedule === opt.value ? '#a8a4ff' : 'transparent', transition: 'all 0.15s' }} />
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>THRESHOLD</p>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#a8a4ff' }}>₹{threshold.toLocaleString('en-IN')}</span>
                </div>
                <input type="range" min={100} max={10000} step={100} value={threshold} onChange={e => setThreshold(Number(e.target.value))} style={{ width: '100%', accentColor: '#a8a4ff' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.3)' }}>₹100</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.3)' }}>₹10,000</span>
                </div>
              </div>
            </div>

            {/* Tax info */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Tax Information</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.6)' }}>PAN Status</span>
                <span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: '#10b981', letterSpacing: '0.05em' }}>VERIFIED</span>
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.35)', lineHeight: 1.6, marginBottom: 14 }}>
                <strong style={{ color: 'rgba(227,226,224,0.5)' }}>Note on TDS:</strong> As per Section 194O, 1% TDS is applicable on gross sales for all creators.
              </p>
              <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(227,226,224,0.7)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Form 16A (Q3)
                <span style={{ marginLeft: 'auto', fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)' }}>PDF</span>
              </button>
            </div>

            {/* Last payout */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px' }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Last Payout</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#e3e2e0' }}>₹12,400</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>PROCESSED</span>
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.4)', marginBottom: 14 }}>Jan 15, 2024 • ID: PL_0921XJ</p>
              <Link href="/dashboard/earnings" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#a8a4ff', textDecoration: 'none', fontWeight: 600 }}>
                View all history →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
