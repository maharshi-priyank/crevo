'use client'

import Link from 'next/link'

const SCORE_SEGMENTS = [
  { label: 'Poor', range: '0–300', color: '#ef4444', from: 0, to: 300 },
  { label: 'Fair', range: '300–500', color: '#f97316', from: 300, to: 500 },
  { label: 'Good', range: '500–700', color: '#fbbf24', from: 500, to: 700 },
  { label: 'Great', range: '700–850', color: '#10b981', from: 700, to: 850 },
  { label: 'Excellent', range: '850–1000', color: '#a8a4ff', from: 850, to: 1000 },
]

const MY_SCORE = 762

const SCORE_FACTORS = [
  { label: 'Sales Volume', score: 88, weight: '25%', color: '#10b981', detail: '120 transactions this month' },
  { label: 'Payout History', score: 100, weight: '20%', color: '#a8a4ff', detail: '0 missed payouts' },
  { label: 'Product Quality', score: 82, weight: '20%', color: '#10b981', detail: '4.7★ avg. rating' },
  { label: 'Refund Rate', score: 74, weight: '15%', color: '#fbbf24', detail: '3.2% refund rate (avg. is 4%)' },
  { label: 'Profile Completeness', score: 90, weight: '10%', color: '#10b981', detail: '9 out of 10 fields complete' },
  { label: 'Content Consistency', score: 67, weight: '10%', color: '#fbbf24', detail: 'Post 3+ products to boost' },
]


function getScoreLabel(score: number) {
  for (const seg of SCORE_SEGMENTS) {
    if (score >= seg.from && score < seg.to) return seg
  }
  return SCORE_SEGMENTS[SCORE_SEGMENTS.length - 1]
}

export default function CrediLinkPage() {
  const scoreInfo = getScoreLabel(MY_SCORE)
  const pct = (MY_SCORE / 1000) * 100

  return (
    <div style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', minHeight: '100%' }}>
      <main style={{ padding: '36px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>CREVO / CREDILINK</p>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '3rem', fontWeight: 700, color: '#e3e2e0', margin: 0, letterSpacing: '-0.03em' }}>My Score</h1>
          </div>
          <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 12, background: 'rgba(168,164,255,0.1)', border: '1px solid rgba(168,164,255,0.2)', color: '#a8a4ff', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            Share Score Card
          </button>
        </div>

        {/* Score display */}
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 24, marginBottom: 32 }}>
          {/* Score card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Gauge */}
            <div style={{ position: 'relative', width: 200, height: 110, marginBottom: 20 }}>
              <svg width="200" height="120" viewBox="0 0 200 120">
                <defs>
                  <linearGradient id="gaugeFill" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444"/>
                    <stop offset="30%" stopColor="#f97316"/>
                    <stop offset="55%" stopColor="#fbbf24"/>
                    <stop offset="75%" stopColor="#10b981"/>
                    <stop offset="100%" stopColor="#a8a4ff"/>
                  </linearGradient>
                </defs>
                {/* Background arc */}
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round"/>
                {/* Colored arc */}
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeFill)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 251} 251`}/>
                {/* Needle */}
                <line
                  x1="100" y1="100"
                  x2={100 + 60 * Math.cos(Math.PI - (pct / 100) * Math.PI)}
                  y2={100 - 60 * Math.sin((pct / 100) * Math.PI)}
                  stroke={scoreInfo.color} strokeWidth="3" strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="6" fill={scoreInfo.color}/>
              </svg>
            </div>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '5rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 4px', letterSpacing: '-0.04em', lineHeight: 1 }}>{MY_SCORE}</p>
            <span style={{ padding: '4px 14px', borderRadius: 8, background: scoreInfo.color + '20', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: scoreInfo.color, marginBottom: 8 }}>{scoreInfo.label}</span>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.45)', margin: 0 }}>Last updated: March 20, 2026</p>

            {/* Gradient bar */}
            <div style={{ marginTop: 20, width: '100%' }}>
              <div style={{ height: 8, borderRadius: 4, background: 'linear-gradient(90deg, #ef4444, #f97316, #fbbf24, #10b981, #a8a4ff)', marginBottom: 6 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {SCORE_SEGMENTS.map(s => (
                  <span key={s.label} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '8px', color: MY_SCORE >= s.from && MY_SCORE < s.to ? s.color : 'rgba(227,226,224,0.3)', fontWeight: MY_SCORE >= s.from && MY_SCORE < s.to ? 700 : 400 }}>{s.label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Perks & badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(168,164,255,0.1), rgba(108,92,231,0.05))', border: '1px solid rgba(168,164,255,0.2)', borderRadius: 16, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Score Benefits</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { icon: '💳', perk: 'Razorpay credit line ₹1,00,000', locked: false },
                  { icon: '🏅', perk: 'Verified badge on storefront', locked: false },
                  { icon: '⚡', perk: 'Same-day payouts', locked: false },
                  { icon: '🔓', perk: 'Premium AI coaching (unlock at 800)', locked: true },
                ].map(p => (
                  <div key={p.perk} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '12px', borderRadius: 12, background: p.locked ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', opacity: p.locked ? 0.5 : 1 }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{p.icon}</span>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: p.locked ? 'rgba(227,226,224,0.4)' : '#e3e2e0', margin: 0, lineHeight: 1.4 }}>{p.perk}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Score history sparkline */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Score History</h3>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#10b981', fontWeight: 700 }}>↑ +47 this month</span>
              </div>
              <svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a8a4ff" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#a8a4ff" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0 50 L50 45 L100 42 L150 38 L200 30 L250 18 L300 8" fill="none" stroke="#a8a4ff" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M0 50 L50 45 L100 42 L150 38 L200 30 L250 18 L300 8 L300 60 L0 60 Z" fill="url(#sparkFill)"/>
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map(m => (
                  <span key={m} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.35)' }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Score breakdown */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Score Breakdown</h2>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.4)' }}>Improve each factor to raise your score</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {SCORE_FACTORS.map(f => (
              <div key={f.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>{f.label}</p>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.4)', fontWeight: 600 }}>WT {f.weight}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${f.score}%`, background: f.color, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: 700, color: f.color, flexShrink: 0 }}>{f.score}</span>
                </div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.45)', margin: 0 }}>{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
