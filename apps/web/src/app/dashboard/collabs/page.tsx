'use client'

import { useState } from 'react'
import Link from 'next/link'


const TABS = ['Partnerships', 'Invitations', 'Analytics', 'Settings']

export default function CollabsPage() {
  const [activeTab, setActiveTab] = useState('Partnerships')
  const [inviteAccepted, setInviteAccepted] = useState(false)
  const [inviteDeclined, setInviteDeclined] = useState(false)

  return (
    <div style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', minHeight: '100%' }}>
      {/* Main */}
      <main>
        {/* Top nav tabs */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', display: 'flex', alignItems: 'center', height: 52 }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: 700, color: '#e3e2e0', marginRight: 32 }}>Crevo Collabs</span>
          {TABS.map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{ padding: '0 16px', height: '100%', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #a8a4ff' : '2px solid transparent', color: activeTab === tab ? '#a8a4ff' : 'rgba(227,226,224,0.45)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: activeTab === tab ? 600 : 400, cursor: 'pointer', marginBottom: -1 }}>
              {tab}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.5)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </button>
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.5)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </button>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)', cursor: 'pointer' }} />
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          {/* Breadcrumb + header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.35)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>CREVO / COLLAB</p>
              <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '3rem', fontWeight: 700, color: '#e3e2e0', margin: 0, letterSpacing: '-0.03em' }}>Collabs</h1>
            </div>
            <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 14, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(108,92,231,0.3)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Create a Collab
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Active collabs', value: '2', icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
              { label: 'Total collab revenue', value: '₹34,850', icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> },
              { label: 'Pending invites', value: '1', icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)', margin: '0 0 6px' }}>{s.label}</p>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>{s.value}</p>
                </div>
                {s.icon}
              </div>
            ))}
          </div>

          {/* Two-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24 }}>
            {/* Left: Pending invites */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Pending Invites</h2>
                <span style={{ padding: '3px 8px', borderRadius: 7, background: 'rgba(251,191,36,0.12)', fontFamily: 'DM Sans, sans-serif', fontSize: '9px', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ACTION REQUIRED</span>
              </div>

              {!inviteDeclined && !inviteAccepted ? (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 16, padding: '20px' }}>
                  {/* Inviter header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #f472b6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)" stroke="none"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>@neha.fitnes</p>
                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>Invited 2 days ago</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button type="button" onClick={() => setInviteDeclined(true)} style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                      <button type="button" onClick={() => setInviteAccepted(true)} style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#10b981' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </button>
                    </div>
                  </div>
                  {/* Product */}
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 10px' }}>Joint PCOS Fitness Bundle</p>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    <span style={{ padding: '3px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.07)', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.6)' }}>50/50 SPLIT</span>
                    <span style={{ padding: '3px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.07)', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.6)' }}>PRICE: ₹999</span>
                  </div>
                  <blockquote style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontStyle: 'italic', color: 'rgba(227,226,224,0.55)', lineHeight: 1.6, margin: 0 }}>
                    &ldquo;Hey! Let&apos;s build a comprehensive PCOS management guide together. Your nutrition expertise + my workout plans.&rdquo;
                  </blockquote>
                </div>
              ) : inviteAccepted ? (
                <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: 700, color: '#10b981', margin: '0 0 6px' }}>Collab Accepted! 🎉</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)', margin: 0 }}>Joint PCOS Fitness Bundle is now active.</p>
                </div>
              ) : (
                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>Invite declined.</p>
                </div>
              )}
            </div>

            {/* Right: Active + Completed collabs */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Active Collabs</h2>
                <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#a8a4ff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600 }}>View Analytics ↗</button>
              </div>

              {/* Active collab card */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  {/* Stacked avatars */}
                  <div style={{ display: 'flex', position: 'relative', width: 60 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)', border: '2px solid #0e0e10', position: 'absolute', left: 0, zIndex: 2 }} />
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#60a5fa,#3b82f6)', border: '2px solid #0e0e10', position: 'absolute', left: 20, zIndex: 1 }} />
                  </div>
                  <div style={{ paddingLeft: 24 }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Priya x Ravi Kumar</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.45)', margin: 0 }}>Ultimate Fat Loss Bundle</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>EARNINGS</p>
                    <p style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>₹8,420</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>REVENUE SPLIT</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>60/40</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '75%', background: 'linear-gradient(90deg, #a8a4ff, #6c5ce7)', borderRadius: 3 }} />
                    </div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.4)', margin: '4px 0 0', textAlign: 'right' }}>75% TARGET</p>
                  </div>
                </div>
              </div>

              {/* Completed collabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.68-6"/></svg>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Completed Collabs</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 2px' }}>Mental Wellness 101</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>Closed March 12, 2024</p>
                    <p style={{ fontFamily: 'Fraunces, serif', fontSize: '14px', fontWeight: 700, color: '#10b981', margin: '3px 0 0' }}>₹12,400 <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', color: 'rgba(227,226,224,0.4)', fontWeight: 700 }}>FINAL SHARE</span></p>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.4)', fontWeight: 600 }}>Archive Center</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
