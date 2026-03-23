'use client'

import { useState } from 'react'
import Link from 'next/link'

const CONVERSATIONS = [
  { id: 'RK', phone: '+91 98*** *2104', last: '"Yes, please send the link..."', status: 'Purchased', statusColor: '#10b981', time: '2m ago' },
  { id: 'AM', phone: '+91 74*** *8821', last: 'Viewing: Minimalist Watch S...', status: 'Browsing', statusColor: '#a8a4ff', time: '14m ago' },
  { id: 'JD', phone: '+9191*** *0039', last: 'Cart abandoned: 3 items', status: 'Dropped off', statusColor: '#ef4444', time: '1h ago' },
]


const STATS = [
  { label: 'MESSAGES TODAY', value: '1,284', delta: '+12%', deltaPos: true },
  { label: 'PRODUCTS VIEWED', value: '452', delta: '+8%', deltaPos: true },
  { label: 'PAYMENTS VIA WA', value: '89', delta: 'Stable', deltaPos: null },
  { label: 'REVENUE VIA WA', value: '₹6,450', delta: 'High', deltaPos: true, accent: true },
]

export default function WhatsAppPage() {
  const [botActive, setBotActive] = useState(true)
  const [broadcastMsg, setBroadcastMsg] = useState('')
  const [chatInput, setChatInput] = useState('')

  return (
    <div style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 28px', height: 52, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(37,211,102,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#25d366" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
            </div>
            <div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>WhatsApp Store</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>BOT ACTIVE</span>
              </div>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Pause bot toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.6)' }}>Pause bot</span>
              <div onClick={() => setBotActive(!botActive)} style={{ width: 36, height: 20, borderRadius: 10, background: botActive ? '#10b981' : 'rgba(255,255,255,0.12)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: 2, left: botActive ? 17 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
              </div>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)', cursor: 'pointer' }} />
          </div>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', overflow: 'hidden' }}>
          {/* Left content */}
          <div style={{ padding: '24px 28px', overflowY: 'auto' }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
              {STATS.map(s => (
                <div key={s.label} style={{ background: s.accent ? 'rgba(168,164,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${s.accent ? 'rgba(168,164,255,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {s.label === 'MESSAGES TODAY' ? <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></> : s.label === 'PRODUCTS VIEWED' ? <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></> : s.label === 'PAYMENTS VIA WA' ? <><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></> : <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>}
                    </svg>
                    {s.delta && <span style={{ padding: '2px 7px', borderRadius: 6, background: s.accent ? 'rgba(168,164,255,0.15)' : s.deltaPos === true ? 'rgba(16,185,129,0.12)' : s.deltaPos === null ? 'rgba(255,255,255,0.08)' : 'rgba(239,68,68,0.12)', fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: s.accent ? '#a8a4ff' : s.deltaPos === true ? '#10b981' : s.deltaPos === null ? 'rgba(227,226,224,0.5)' : '#ef4444' }}>{s.delta}</span>}
                  </div>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 700, color: s.accent ? '#a8a4ff' : '#e3e2e0', margin: '0 0 2px' }}>{s.value}</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent conversations */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Recent Conversations</h2>
                <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#a8a4ff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600 }}>View All →</button>
              </div>
              {/* Table */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 120px 80px', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['BUYER', 'LAST MESSAGE', 'STATUS', 'TIME'].map(h => <span key={h} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', fontWeight: 700, color: 'rgba(227,226,224,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>)}
                </div>
                {CONVERSATIONS.map((conv, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 120px 80px', padding: '12px 16px', borderBottom: i < CONVERSATIONS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(37,211,102,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: '#25d366' }}>{conv.id}</span>
                      </div>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.7)' }}>{conv.phone}</span>
                    </div>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.last}</span>
                    <span style={{ padding: '3px 8px', borderRadius: 7, background: conv.statusColor + '18', fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: conv.statusColor, width: 'fit-content' }}>{conv.status}</span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.35)' }}>{conv.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom 2 cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Catalog sync */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px' }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.5)', margin: '0 0 4px' }}>Catalogue Sync</p>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 8px', lineHeight: 1.2 }}>6 products synced</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#25d366', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, padding: 0 }}>Manage Products ↗</button>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37,211,102,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25d366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.68-6"/></svg>
                  </div>
                </div>
              </div>
              {/* Quick broadcast */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Quick Broadcast</p>
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <input value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} placeholder="Type message to all users..." style={{ flex: 1, padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', outline: 'none' }} />
                  <button type="button" style={{ width: 34, height: 34, borderRadius: 10, background: '#a8a4ff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0e0e10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.35)' }}>Estimated reach: 1,420 users</p>
              </div>
            </div>
          </div>

          {/* Right: WhatsApp chat preview */}
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)' }}>
            {/* Chat header */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(37,211,102,0.06)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(37,211,102,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25d366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>BharatStore Bot</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: '#10b981', margin: 0 }}>Online</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  <svg key="vid" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
                  <svg key="call" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
                  <svg key="more" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.5)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>,
                ]}
              </div>
            </div>
            {/* Chat messages */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Bot welcome message */}
              <div style={{ maxWidth: '80%', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: '14px 14px 14px 4px', padding: '10px 14px' }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#e3e2e0', margin: '0 0 4px', lineHeight: 1.5 }}>👋 Welcome to Atelier Store! Please select an option from the menu below:</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>10:45 AM</p>
              </div>
              {/* User reply */}
              <div style={{ maxWidth: '70%', alignSelf: 'flex-end', background: 'rgba(37,211,102,0.8)', borderRadius: '14px 14px 4px 14px', padding: '10px 14px' }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#fff', margin: '0 0 4px' }}>View Products</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>10:46 AM ✓✓</p>
              </div>
              {/* Product card */}
              <div style={{ maxWidth: '85%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px 14px 14px 4px', overflow: 'hidden' }}>
                <div style={{ height: 100, background: 'linear-gradient(135deg, #1e2a2a, #162020)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(200,170,130,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '20px' }}>⌚</span>
                  </div>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 2px' }}>Minimalist Watch S2</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.5)', margin: '0 0 8px' }}>Heritage edition with leather strap.</p>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 8px' }}>₹2,499</p>
                  <button type="button" style={{ width: '100%', padding: '8px', borderRadius: 8, background: '#25d366', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Buy Now</button>
                </div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.35)', padding: '0 12px 8px', margin: 0 }}>10:46 AM</p>
              </div>
            </div>
            {/* Chat input */}
            <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.4)' }}>😊</button>
              <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.4)' }}>📎</button>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: '8px 14px' }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message" style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#e3e2e0', width: '100%' }} />
              </div>
              <button type="button" style={{ width: 36, height: 36, borderRadius: '50%', background: '#25d366', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M12 2a10 10 0 0 0-6.84 17.47l-.93 3.45 3.55-.93A10 10 0 1 0 12 2z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
