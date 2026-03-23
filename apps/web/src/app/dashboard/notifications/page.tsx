'use client'

import { useState } from 'react'
import Link from 'next/link'

type Notif = {
  id: number
  type: 'sale' | 'order' | 'ai' | 'collab' | 'system'
  title: string
  body: string
  time: string
  read: boolean
}

const INITIAL_NOTIFS: Notif[] = [
  { id: 1, type: 'sale', title: 'New Sale 🎉', body: 'Rohan K. purchased "PCOS Reset — 21 Day Protocol" for ₹999.', time: '2 min ago', read: false },
  { id: 2, type: 'sale', title: 'New Sale 🎉', body: 'Anjali M. purchased "Mindful Eating Masterclass" for ₹1,499.', time: '38 min ago', read: false },
  { id: 3, type: 'ai', title: 'AI Insight ready', body: 'Your weekly revenue report is ready. You\'re up 18% vs last week!', time: '1 hr ago', read: false },
  { id: 4, type: 'collab', title: 'Collab invite from @neha.fitnes', body: '"Joint PCOS Fitness Bundle" — 50/50 split. Review and accept.', time: '2 hr ago', read: false },
  { id: 5, type: 'order', title: 'Refund request', body: 'Deepa S. has raised a refund request for "30-Day Fat Loss Plan".', time: '5 hr ago', read: true },
  { id: 6, type: 'system', title: 'KYC verification complete', body: 'Your bank account SBI ···· 4532 has been verified successfully.', time: 'Yesterday', read: true },
  { id: 7, type: 'sale', title: 'New Sale 🎉', body: 'Meenakshi T. purchased "Gut Health Reset" for ₹799.', time: 'Yesterday', read: true },
  { id: 8, type: 'system', title: 'Product published', body: '"Thyroid Support Protocol" is now live on your storefront.', time: '2 days ago', read: true },
]

const TYPE_META: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  sale: {
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  },
  order: {
    color: '#f97316',
    bg: 'rgba(249,115,22,0.12)',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg>,
  },
  ai: {
    color: '#a8a4ff',
    bg: 'rgba(168,164,255,0.12)',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  },
  collab: {
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.12)',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  system: {
    color: 'rgba(227,226,224,0.5)',
    bg: 'rgba(255,255,255,0.07)',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  },
}

const FILTERS = ['All', 'Sales', 'Orders', 'AI', 'Collabs', 'System']

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS)
  const [activeFilter, setActiveFilter] = useState('All')

  const unreadCount = notifs.filter(n => !n.read).length

  const filtered = notifs.filter(n => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Sales') return n.type === 'sale'
    if (activeFilter === 'Orders') return n.type === 'order'
    if (activeFilter === 'AI') return n.type === 'ai'
    if (activeFilter === 'Collabs') return n.type === 'collab'
    if (activeFilter === 'System') return n.type === 'system'
    return true
  })

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  function markRead(id: number) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div className="min-h-screen" style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Top bar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'rgba(227,226,224,0.45)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Dashboard
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#e3e2e0' }}>Notifications</span>
        {unreadCount > 0 && <span style={{ padding: '2px 8px', borderRadius: 8, background: '#a8a4ff', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: '#0e0e10' }}>{unreadCount}</span>}
        <div style={{ marginLeft: 'auto' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)', cursor: 'pointer' }} />
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 4px', letterSpacing: '-0.03em' }}>Notifications</h1>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.45)', margin: 0 }}>{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <button type="button" onClick={markAllRead} style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(168,164,255,0.1)', border: '1px solid rgba(168,164,255,0.2)', color: '#a8a4ff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f} type="button" onClick={() => setActiveFilter(f)} style={{ padding: '7px 16px', borderRadius: 100, background: activeFilter === f ? 'rgba(168,164,255,0.15)' : 'rgba(255,255,255,0.05)', border: activeFilter === f ? '1px solid rgba(168,164,255,0.3)' : '1px solid rgba(255,255,255,0.08)', color: activeFilter === f ? '#a8a4ff' : 'rgba(227,226,224,0.5)', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: activeFilter === f ? 700 : 400, cursor: 'pointer' }}>
              {f}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 700, color: 'rgba(227,226,224,0.3)', margin: 0 }}>All clear!</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.25)', marginTop: 8 }}>No notifications in this category.</p>
            </div>
          ) : filtered.map(n => {
            const meta = TYPE_META[n.type]
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{ display: 'flex', gap: 14, padding: '16px 20px', borderRadius: 14, background: n.read ? 'rgba(255,255,255,0.02)' : 'rgba(168,164,255,0.05)', border: n.read ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(168,164,255,0.15)', cursor: 'pointer', transition: 'background 0.15s' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {meta.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>{n.title}</p>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.35)', flexShrink: 0, marginLeft: 12 }}>{n.time}</span>
                  </div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.55)', margin: 0, lineHeight: 1.5 }}>{n.body}</p>
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a8a4ff', flexShrink: 0, marginTop: 4 }} />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
