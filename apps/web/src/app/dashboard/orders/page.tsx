'use client'

import { useState } from 'react'

const STATUS_FILTERS = ['All', 'Paid', 'Processing', 'Delivered', 'Refunded', 'Failed']

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  DELIVERED:  { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: 'DELIVERED' },
  PROCESSING: { bg: 'rgba(168,164,255,0.12)', color: '#a8a4ff', label: 'PROCESSING' },
  FAILED:     { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'FAILED' },
  PAID:       { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: 'PAID' },
  REFUNDED:   { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', label: 'REFUNDED' },
}

const PAYMENT_ICONS: Record<string, JSX.Element> = {
  'UPI / Razorpay': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  'Net Banking': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  'Card': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
}

const ORDERS = [
  { id: '#CRV-89421', initials: 'AR', name: 'Arjun Rao',    email: 'arjun@example.com',      product: 'Mastering UI Motion',    amount: '₹4,999',  payment: 'UPI / Razorpay', status: 'DELIVERED' },
  { id: '#CRV-89422', initials: 'MK', name: 'Meera Kapoor', email: 'meera.k@studio.in',       product: 'Creator Brand Kit',      amount: '₹12,499', payment: 'Net Banking',    status: 'PROCESSING' },
  { id: '#CRV-89423', initials: 'JD', name: 'John Doe',     email: 'j.doe@webmail.com',        product: 'Lightroom Presets v4',   amount: '₹2,450',  payment: 'Card',           status: 'FAILED' },
  { id: '#CRV-89424', initials: 'SP', name: 'Sneha Patel',  email: 'sneha@designcraft.in',    product: 'UX Masterclass 2024',   amount: '₹7,999',  payment: 'UPI / Razorpay', status: 'PAID' },
  { id: '#CRV-89425', initials: 'RV', name: 'Rahul Verma',  email: 'rahul.v@techfolio.com',   product: 'Social Media Templates', amount: '₹1,299',  payment: 'Card',           status: 'DELIVERED' },
  { id: '#CRV-89426', initials: 'PK', name: 'Priya Kumar',  email: 'priya@creativestudio.in', product: 'Brand Identity Pack',    amount: '₹8,499',  payment: 'Net Banking',    status: 'REFUNDED' },
]

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div style={{ width: 36, height: 36, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: '#fff' }}>{initials}</span>
    </div>
  )
}

const AVATAR_COLORS = ['#6c5ce7', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6']

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = ORDERS.filter(o => {
    const matchFilter = activeFilter === 'All' || o.status.toLowerCase() === activeFilter.toLowerCase()
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.name.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="animate-enter" style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', minHeight: '100%' }}>
      {/* Topbar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 16, height: 52, position: 'sticky', top: 0, background: '#0e0e10', zIndex: 10 }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Orders</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" style={{ padding: '7px 16px', borderRadius: 10, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>Export Report</button>
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.5)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)', cursor: 'pointer' }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Orders</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)' }}>247 total orders processed</span>
              </div>
            </div>
            {/* Stat cards */}
            <div style={{ display: 'flex', gap: 16 }}>
              {[
                { label: 'TOTAL REVENUE', value: '₹1,24,850' },
                { label: "TODAY'S ORDERS", value: '14' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 20px', minWidth: 140 }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{s.label}</p>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Filters + Search */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4 }}>
              {STATUS_FILTERS.map(f => (
                <button key={f} type="button" onClick={() => setActiveFilter(f)} style={{ padding: '7px 14px', borderRadius: 9, background: activeFilter === f ? 'rgba(168,164,255,0.15)' : 'transparent', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: activeFilter === f ? 700 : 400, color: activeFilter === f ? '#a8a4ff' : 'rgba(227,226,224,0.5)', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {f}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 14px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#e3e2e0', width: 160 }} />
              </div>
              <button type="button" style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(227,226,224,0.5)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr 100px 140px 120px 40px', gap: 0, padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['ORDER ID', 'BUYER', 'PRODUCT', 'AMOUNT', 'PAYMENT', 'STATUS', ''].map(col => (
                <span key={col} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{col}</span>
              ))}
            </div>
            {/* Rows */}
            {filtered.map((order, i) => (
              <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr 100px 140px 120px 40px', gap: 0, padding: '16px 20px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center', transition: 'background 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#a8a4ff' }}>{order.id}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={order.initials} color={AVATAR_COLORS[i % AVATAR_COLORS.length]} />
                  <div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#e3e2e0', margin: 0 }}>{order.name}</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>{order.email}</p>
                  </div>
                </div>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.7)' }}>{order.product}</span>
                <span style={{ fontFamily: 'Fraunces, serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0' }}>{order.amount}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(227,226,224,0.5)' }}>
                  {PAYMENT_ICONS[order.payment]}
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px' }}>{order.payment}</span>
                </div>
                <div>
                  <span style={{ padding: '4px 10px', borderRadius: 8, background: STATUS_STYLES[order.status]?.bg, fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: STATUS_STYLES[order.status]?.color, letterSpacing: '0.06em' }}>
                    {STATUS_STYLES[order.status]?.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.4)' }}>Showing 1 to {filtered.length} of 247 orders</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Previous', 'Next'].map(btn => (
                <button key={btn} type="button" style={{ padding: '7px 16px', borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.6)', cursor: 'pointer' }}>{btn}</button>
              ))}
            </div>
          </div>
      </div>
    </div>
  )
}
