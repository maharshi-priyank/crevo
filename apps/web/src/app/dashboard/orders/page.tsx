'use client'

import { useState } from 'react'

const STATUS_FILTERS = ['All', 'Paid', 'Processing', 'Delivered', 'Refunded', 'Failed']

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  DELIVERED:  { bg: 'rgba(16,185,129,0.12)',  color: '#10b981', label: 'Delivered' },
  PROCESSING: { bg: 'rgba(168,164,255,0.12)', color: '#a8a4ff', label: 'Processing' },
  FAILED:     { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444', label: 'Failed' },
  PAID:       { bg: 'rgba(16,185,129,0.12)',  color: '#10b981', label: 'Paid' },
  REFUNDED:   { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24', label: 'Refunded' },
}

const ORDERS = [
  { id: '#CRV-89421', initials: 'AR', name: 'Arjun Rao',    email: 'arjun@example.com',      product: 'Mastering UI Motion',     amount: '₹4,999',  payment: 'UPI', status: 'DELIVERED' },
  { id: '#CRV-89422', initials: 'MK', name: 'Meera Kapoor', email: 'meera.k@studio.in',       product: 'Creator Brand Kit',       amount: '₹12,499', payment: 'Net Banking', status: 'PROCESSING' },
  { id: '#CRV-89423', initials: 'JD', name: 'John Doe',     email: 'j.doe@webmail.com',       product: 'Lightroom Presets v4',    amount: '₹2,450',  payment: 'Card', status: 'FAILED' },
  { id: '#CRV-89424', initials: 'SP', name: 'Sneha Patel',  email: 'sneha@designcraft.in',    product: 'UX Masterclass 2024',    amount: '₹7,999',  payment: 'UPI', status: 'PAID' },
  { id: '#CRV-89425', initials: 'RV', name: 'Rahul Verma',  email: 'rahul.v@techfolio.com',   product: 'Social Media Templates', amount: '₹1,299',  payment: 'Card', status: 'DELIVERED' },
  { id: '#CRV-89426', initials: 'PK', name: 'Priya Kumar',  email: 'priya@creativestudio.in', product: 'Brand Identity Pack',    amount: '₹8,499',  payment: 'Net Banking', status: 'REFUNDED' },
]

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
      <div className="flex items-center gap-3 px-4 sm:px-6 h-14 sticky top-0 z-10"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0e0e10' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Orders</h1>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" className="hidden sm:block"
            style={{ padding: '7px 16px', borderRadius: 10, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>
            Export
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 sm:px-6 sm:py-6">

        {/* Header — stacks on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.4rem, 5vw, 2rem)', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Orders</h1>
            <div className="flex items-center gap-2 mt-1">
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)' }}>247 total orders</span>
            </div>
          </div>
          {/* Stat cards — scroll horizontally on mobile */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {[
              { label: 'Revenue', value: '₹1,24,850' },
              { label: "Today", value: '14 orders' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 18px', flexShrink: 0 }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{s.label}</p>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters — scrollable horizontally on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <div className="flex gap-1 overflow-x-auto pb-1" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4 }}>
            {STATUS_FILTERS.map(f => (
              <button key={f} type="button" onClick={() => setActiveFilter(f)}
                style={{ padding: '7px 12px', borderRadius: 9, background: activeFilter === f ? 'rgba(168,164,255,0.15)' : 'transparent', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: activeFilter === f ? 700 : 400, color: activeFilter === f ? '#a8a4ff' : 'rgba(227,226,224,0.5)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:ml-auto" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 12px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..."
              style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#e3e2e0', width: '100%', minWidth: 0 }} />
          </div>
        </div>

        {/* Desktop table (hidden on mobile) */}
        <div className="hidden md:block" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr 90px 120px 110px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {['ORDER ID', 'BUYER', 'PRODUCT', 'AMOUNT', 'PAYMENT', 'STATUS'].map(col => (
              <span key={col} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{col}</span>
            ))}
          </div>
          {filtered.map((order, i) => (
            <div key={order.id}
              style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr 90px 120px 110px', padding: '15px 20px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: '#a8a4ff' }}>{order.id}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: '#fff' }}>{order.initials}</span>
                </div>
                <div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#e3e2e0', margin: 0 }}>{order.name}</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>{order.email}</p>
                </div>
              </div>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.7)' }}>{order.product}</span>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0' }}>{order.amount}</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.5)' }}>{order.payment}</span>
              <span style={{ padding: '4px 10px', borderRadius: 8, background: STATUS_STYLES[order.status]?.bg, fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: STATUS_STYLES[order.status]?.color, display: 'inline-block' }}>
                {STATUS_STYLES[order.status]?.label}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile card list (hidden on desktop) */}
        <div className="md:hidden flex flex-col gap-3">
          {filtered.map((order, i) => (
            <div key={order.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px' }}>
              {/* Row 1: avatar + name + amount */}
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: '#fff' }}>{order.initials}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#e3e2e0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.name}</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.product}</p>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>{order.amount}</p>
                </div>
              </div>
              {/* Row 2: order ID + payment + status */}
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: '#a8a4ff' }}>{order.id}</span>
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.4)' }}>{order.payment}</span>
                  <span style={{ padding: '3px 9px', borderRadius: 7, background: STATUS_STYLES[order.status]?.bg, fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: STATUS_STYLES[order.status]?.color }}>
                    {STATUS_STYLES[order.status]?.label}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12" style={{ color: 'rgba(227,226,224,0.3)' }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>No orders found.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.4)' }}>
            <span className="hidden sm:inline">Showing </span>{filtered.length} of 247
          </span>
          <div className="flex gap-2">
            {['Prev', 'Next'].map(btn => (
              <button key={btn} type="button" style={{ padding: '7px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.6)', cursor: 'pointer' }}>{btn}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
