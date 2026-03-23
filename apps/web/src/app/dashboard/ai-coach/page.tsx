'use client'

import { useState } from 'react'

const INSIGHTS = [
  {
    tag: 'HIGH PRIORITY', tagColor: '#ef4444', border: 'rgba(239,68,68,0.3)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    title: 'Pricing Strategy Advice',
    body: 'Data shows similar creators in the "Tech Review" niche are pricing 1:1 consultations at $150. You\'re currently at $85. Increasing to $125 could boost monthly revenue by 32% without significant drop-off.',
    actions: [{ label: 'Review Benchmarks', primary: true, link: false }, { label: 'Dismiss', primary: false, link: false }],
    wide: true,
  },
  {
    tag: 'OPPORTUNITY', tagColor: '#fbbf24', border: 'rgba(251,191,36,0.3)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    title: 'Niche Content Gap',
    body: 'Search volume for "AI-Powered Notion Templates" is up 400% this week. You haven\'t posted about this yet.',
    actions: [{ label: 'View keywords →', primary: false, link: true as const }],
    wide: false,
  },
  {
    tag: 'WIN', tagColor: '#10b981', border: 'rgba(16,185,129,0.3)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    title: 'Optimal Post Timing',
    body: 'Your last 3 posts at 7:00 PM IST had 2.5x more engagement. Your AI Coach suggests scheduling your next drop for Tuesday 7:00 PM.',
    footer: 'Confidence Score: 94%',
    actions: [{ label: 'Schedule Now', primary: false, link: true as const }],
    wide: false,
  },
  {
    tag: 'TIP', tagColor: '#a8a4ff', border: 'rgba(168,164,255,0.3)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    title: 'Upsell Recommendation',
    body: 'Try bundling your "Basic Guide" with "Live Q&A" at checkout. Similar funnels are seeing a 15% increase in Average Order Value.',
    wide: false,
  },
]

const SUGGESTED_QUESTIONS = [
  '"How do I reach $10k this month?"',
  '"Analyze my churn rate"',
  '"Optimize my landing page copy"',
]

export default function AiCoachPage() {
  const [message, setMessage] = useState('')
  const [dismissed, setDismissed] = useState<number[]>([])
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([])

  function sendMessage(text?: string) {
    const msg = text || message
    if (!msg.trim()) return
    setMessages(prev => [
      ...prev,
      { role: 'user', text: msg },
      { role: 'ai', text: 'Analyzing your data... Based on your current metrics, I recommend focusing on your highest-converting products and leveraging your email list for your next launch. Your conversion rate suggests a 25% revenue uplift is achievable this month.' },
    ])
    setMessage('')
  }

  return (
    <div style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', minHeight: '100%' }}>
      {/* Topbar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: 52, display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, background: '#0e0e10', zIndex: 10 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '7px 14px', maxWidth: 280 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search insights..." style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#e3e2e0', flex: 1 }} />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.5)' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></button>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)', cursor: 'pointer' }} />
        </div>
      </div>

      {/* Page header */}
      <div style={{ padding: '40px 40px 32px', background: 'linear-gradient(180deg, rgba(108,92,231,0.12) 0%, transparent 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: '#a8a4ff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI REVENUE ENGINE ACTIVE</span>
        </div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '3.2rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 12px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Your AI Revenue Coach</h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(227,226,224,0.5)', lineHeight: 1.6, maxWidth: 540, margin: 0 }}>
          Harnessing predictive analytics to scale your creator business. Here are your high-impact insights for today.
        </p>
      </div>

      {/* Insights grid */}
      <div style={{ padding: '0 40px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {INSIGHTS.filter((_, i) => !dismissed.includes(i)).map((ins, i) => (
            <div key={i} style={{ gridColumn: ins.wide ? '1 / -1' : 'auto', background: 'rgba(255,255,255,0.03)', border: `1px solid ${ins.border}`, borderLeft: `3px solid ${ins.tagColor}`, borderRadius: 16, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ padding: '3px 10px', borderRadius: 8, background: `${ins.tagColor}20`, fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: ins.tagColor, letterSpacing: '0.08em' }}>{ins.tag}</span>
                {ins.icon}
              </div>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 10px' }}>{ins.title}</h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.6)', lineHeight: 1.6, margin: '0 0 16px' }}>{ins.body}</p>
              {ins.footer && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.4)', marginBottom: 12 }}>{ins.footer}</p>}
              {ins.actions && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {ins.actions.map(action => (
                    <button key={action.label} type="button"
                      onClick={() => action.label === 'Dismiss' && setDismissed(d => [...d, i])}
                      style={{ padding: '8px 16px', borderRadius: 10, background: action.primary ? '#a8a4ff' : 'rgba(255,255,255,0.07)', border: action.primary ? 'none' : '1px solid rgba(255,255,255,0.12)', color: action.primary ? '#0e0e10' : action.link ? '#a8a4ff' : 'rgba(227,226,224,0.7)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat */}
      <div style={{ padding: '0 40px 40px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '28px 24px' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 700, color: '#e3e2e0', textAlign: 'center', margin: '0 0 6px' }}>Ask your AI Coach anything</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.45)', textAlign: 'center', margin: '0 0 20px' }}>Analyze data, project revenue, or draft content strategies.</p>

          {messages.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, maxHeight: 200, overflowY: 'auto' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: 14, background: msg.role === 'user' ? '#a8a4ff' : 'rgba(255,255,255,0.07)', border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: msg.role === 'user' ? '#0e0e10' : 'rgba(227,226,224,0.8)', margin: 0, lineHeight: 1.5 }}>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
            {SUGGESTED_QUESTIONS.map(q => (
              <button key={q} type="button" onClick={() => sendMessage(q)} style={{ padding: '7px 14px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(227,226,224,0.7)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer' }}>
                {q}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '8px 12px 8px 16px' }}>
            <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a command or question..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#e3e2e0' }} />
            <button type="button" onClick={() => sendMessage()} style={{ width: 36, height: 36, borderRadius: 10, background: '#a8a4ff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(168,164,255,0.4)', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0e0e10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
