import Link from 'next/link'

/* ── Icons ───────────────────────────────────────────────────────────────── */
const IBell   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const ICart   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
const IEye    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IBox    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
const ICash   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IZap    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>

/* ── Bar chart data ──────────────────────────────────────────────────────── */
const BARS = [
  { label: 'MAR 01', h: 38 },
  { label: '',       h: 52 },
  { label: '',       h: 45 },
  { label: '',       h: 65 },
  { label: '',       h: 55 },
  { label: 'MAR 10', h: 72 },
  { label: '',       h: 48 },
  { label: '',       h: 60 },
  { label: '',       h: 80 },
  { label: '',       h: 70 },
  { label: 'MAR 20', h: 95 },
  { label: '',       h: 78 },
  { label: '',       h: 62 },
  { label: '',       h: 55 },
  { label: '',       h: 68 },
  { label: 'MAR 30', h: 72 },
]

/* ── Stat cards ──────────────────────────────────────────────────────────── */
const STATS = [
  { label: 'Earnings This Month', value: '₹24,850', delta: '+14.2%',  positive: true,  Icon: ICash, iconColor: '#a8a4ff' },
  { label: 'Total Orders',        value: '47',       delta: '+8%',     positive: true,  Icon: ICart, iconColor: '#a8a4ff' },
  { label: 'Page Visitors',       value: '1,243',    delta: '+22%',    positive: true,  Icon: IEye,  iconColor: '#a8a4ff' },
  { label: 'Active Products',     value: '6',        delta: 'Active',  positive: null,  Icon: IBox,  iconColor: '#a8a4ff' },
]

/* ── Recent orders ───────────────────────────────────────────────────────── */
const ORDERS = [
  { initials: 'AK', name: 'Ananya Kapoor', product: '21-Day Meal Plan',    date: 'Today, 09:42 AM',         amount: '₹999.00'   },
  { initials: 'RS', name: 'Rahul Singh',   product: 'Fat Loss Course',      date: 'Yesterday, 11:20 PM',     amount: '₹4,499.00' },
  { initials: 'MD', name: 'Meera Desai',   product: 'Workout Template v2',  date: '24 Mar, 06:15 PM',        amount: '₹1,250.00' },
]

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function DashboardHome() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--surface)' }}>

      {/* Topbar */}
      <div className="flex items-center gap-3 px-6 h-14 shrink-0 sticky top-0 z-10"
        style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(249,245,248,0.06)' }}>
        <div className="flex-1 max-w-xs">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.07)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(249,245,248,0.25)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span className="font-sans text-xs" style={{ color: 'rgba(249,245,248,0.25)' }}>
              Search analytics, products...
            </span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ color: 'rgba(249,245,248,0.45)', background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.07)' }}>
            <IBell />
          </button>
        </div>
      </div>

      {/* Page body */}
      <div className="px-6 py-6 max-w-6xl animate-enter">

        {/* Greeting */}
        <div className="mb-6 animate-slide-up">
          <h1 className="font-sans font-semibold mb-1" style={{
            fontSize: '1.5rem',
            color: 'var(--on-surface)',
            letterSpacing: '-0.02em',
          }}>
            Good morning, Priya 👋
          </h1>
          <p className="font-sans text-sm" style={{ color: 'rgba(249,245,248,0.4)' }}>
            Your creator business grew by 12% this week. Here's a snapshot of your performance.
          </p>
        </div>

        {/* 4 Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 stagger">
          {STATS.map(({ label, value, delta, positive, Icon, iconColor }) => (
            <div key={label} className="rounded-2xl p-4 card-lift"
              style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.05)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(168,164,255,0.1)', color: iconColor }}>
                  <Icon />
                </div>
                <span className="font-sans text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: positive === true ? 'rgba(74,222,128,0.1)' : positive === false ? 'rgba(251,113,133,0.1)' : 'rgba(249,245,248,0.08)',
                    color: positive === true ? '#4ade80' : positive === false ? '#fb7185' : 'rgba(249,245,248,0.4)',
                  }}>
                  {delta}
                </span>
              </div>
              <p className="font-sans text-xs mb-1" style={{ color: 'rgba(249,245,248,0.4)' }}>
                {label}
              </p>
              <p className="font-sans font-semibold" style={{
                fontSize: '1.5rem',
                color: 'var(--on-surface)',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Chart + AI Coach */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 scroll-reveal">

          {/* Earnings Trend */}
          <div className="lg:col-span-2 rounded-2xl p-5 card-lift"
            style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.05)' }}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="font-sans font-semibold text-sm" style={{ color: 'var(--on-surface)' }}>
                  Earnings Trend
                </p>
                <p className="font-sans text-xs mt-0.5" style={{ color: 'rgba(249,245,248,0.35)' }}>
                  Past 30 days performance
                </p>
              </div>
              <button className="font-sans text-xs px-3 py-1.5 rounded-lg"
                style={{ background: 'var(--surface-high)', color: 'rgba(249,245,248,0.5)', border: '1px solid rgba(249,245,248,0.08)' }}>
                Last 30 Days
              </button>
            </div>

            {/* Bar chart (SVG) */}
            <div className="w-full" style={{ height: '160px' }}>
              <svg viewBox="0 0 480 160" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                {BARS.map((bar, i) => {
                  const x = (i / (BARS.length - 1)) * 460 + 10
                  const barW = 22
                  const maxH = 120
                  const h = (bar.h / 100) * maxH
                  const isHighest = bar.h >= 90
                  return (
                    <g key={i}>
                      <rect
                        x={x - barW / 2}
                        y={160 - h - 20}
                        width={barW}
                        height={h}
                        rx="5"
                        fill={isHighest ? 'rgba(168,164,255,0.85)' : 'rgba(168,164,255,0.25)'}
                      />
                      {bar.label && (
                        <text
                          x={x}
                          y={155}
                          textAnchor="middle"
                          fontSize="8"
                          fill="rgba(249,245,248,0.3)"
                          style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
                        >
                          {bar.label}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* AI Coach Intelligence */}
          <div className="rounded-2xl p-5 flex flex-col"
            style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.05)' }}>
            <div className="flex items-center gap-1.5 mb-4">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(168,164,255,0.15)', color: 'var(--primary)' }}>
                <IZap />
              </div>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--primary)', letterSpacing: '0.1em' }}>
                AI Coach Intelligence
              </p>
            </div>

            <h3 className="font-sans font-semibold mb-2" style={{ color: 'var(--on-surface)', fontSize: '1rem', lineHeight: 1.3 }}>
              Price Optimization Alert
            </h3>
            <p className="font-sans text-sm leading-relaxed flex-1" style={{ color: 'rgba(249,245,248,0.45)' }}>
              We noticed a 15% drop in conversion for your{' '}
              <span style={{ color: 'var(--on-surface)', fontWeight: 500 }}>Fat Loss Course</span>.
              A temporary 10% price drop or a limited-time bundle could recover your momentum.
            </p>

            <button className="mt-5 w-full py-3 rounded-xl font-sans font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, var(--primary-dim) 0%, var(--primary) 100%)',
                color: '#0e0e10',
              }}>
              Apply Suggestion
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl overflow-hidden scroll-reveal"
          style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.05)' }}>
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid rgba(249,245,248,0.06)' }}>
            <p className="font-sans font-semibold text-sm" style={{ color: 'var(--on-surface)' }}>
              Recent Orders
            </p>
            <Link href="/dashboard/orders" className="font-sans text-xs transition-colors"
              style={{ color: 'var(--primary)' }}>
              View All
            </Link>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-4 px-5 py-3"
            style={{ borderBottom: '1px solid rgba(249,245,248,0.05)' }}>
            {['CUSTOMER', 'PRODUCT', 'DATE', 'AMOUNT'].map((h) => (
              <p key={h} className="font-sans text-xs font-medium uppercase tracking-widest"
                style={{ color: 'rgba(249,245,248,0.25)', letterSpacing: '0.1em' }}>
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          {ORDERS.map((order, i) => (
            <div key={i} className="grid grid-cols-4 items-center px-5 py-3.5 transition-colors"
              style={{
                borderBottom: i < ORDERS.length - 1 ? '1px solid rgba(249,245,248,0.04)' : 'none',
              }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-semibold text-xs shrink-0"
                  style={{ background: 'var(--surface-highest)', color: 'rgba(249,245,248,0.7)' }}>
                  {order.initials}
                </div>
                <span className="font-sans text-sm" style={{ color: 'var(--on-surface)' }}>
                  {order.name}
                </span>
              </div>
              <span className="font-sans text-sm" style={{ color: 'rgba(249,245,248,0.55)' }}>
                {order.product}
              </span>
              <span className="font-sans text-sm" style={{ color: 'rgba(249,245,248,0.4)' }}>
                {order.date}
              </span>
              <span className="font-sans font-semibold text-sm" style={{ color: '#4ade80', fontVariantNumeric: 'tabular-nums' }}>
                {order.amount}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
