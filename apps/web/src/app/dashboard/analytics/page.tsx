import Link from 'next/link'

/* ── Icons ───────────────────────────────────────────────────────────────── */
const IBell     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const IPlus     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const ICalendar = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IDownload = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const IEye      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IUsers    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const IPercent  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
const ICash     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IBox      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
const IPhone    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.13 6.13l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z"/></svg>

/* ── Metric cards ────────────────────────────────────────────────────────── */
const METRICS = [
  { label: 'Total Views',      value: '124.8K', delta: '+12.4%', positive: true,  Icon: IEye,     barColor: '#60a5fa', barPct: 75 },
  { label: 'Total Visitors',   value: '82,430', delta: '+8.1%',  positive: true,  Icon: IUsers,   barColor: '#fb7185', barPct: 55 },
  { label: 'Conversion Rate',  value: '3.2%',   delta: '-0.4%',  positive: false, Icon: IPercent, barColor: '#fb7185', barPct: 30 },
  { label: 'Total Revenue',    value: '₹47,320',delta: '+24.2%', positive: true,  Icon: ICash,    barColor: '#a8a4ff', barPct: 85 },
]

/* ── Activity trend line chart ───────────────────────────────────────────── */
const TREND_POINTS = [
  [0,   90], [40,  85], [80,  75], [120, 65], [160, 55], [200, 45],
  [240, 50], [280, 40], [320, 35], [360, 25], [400, 20], [440, 15], [480, 10],
]

function polylineStr(pts: number[][]): string {
  return pts.map(([x, y]) => `${x},${y}`).join(' ')
}

/* ── Traffic sources ─────────────────────────────────────────────────────── */
const TRAFFIC = [
  { label: 'Instagram Bio',   pct: 54, color: '#fb7185' },
  { label: 'WhatsApp',        pct: 22, color: '#4ade80'  },
  { label: 'Direct/Search',   pct: 18, color: '#60a5fa'  },
]

/* ── Top products ────────────────────────────────────────────────────────── */
const TOP_PRODUCTS = [
  { Icon: IBox,   name: 'Digital Creator Playbook',    sub: 'eBook / PDF',      status: 'HIGH DEMAND', statusColor: '#4ade80', statusBg: 'rgba(74,222,128,0.1)', sold: '842 units',  conv: '4.8%', revenue: '₹24,120' },
  { Icon: IPhone, name: '1:1 Strategy Consultation',  sub: 'Coaching / 1-on-1', status: 'STABLE',      statusColor: '#60a5fa', statusBg: 'rgba(96,165,250,0.1)', sold: '12 sessions', conv: '12.2%', revenue: '₹14,500' },
]

/* ── Top cities ──────────────────────────────────────────────────────────── */
const CITIES = [
  { name: 'Mumbai',     pct: 42 },
  { name: 'Pune',       pct: 18 },
  { name: 'Bangalore',  pct: 12 },
  { name: 'Delhi NCR',  pct: 10 },
]

/* ── Donut SVG helper ────────────────────────────────────────────────────── */
function DonutSegment({ pct, offset, color, r = 40, cx = 60, cy = 60 }: { pct: number; offset: number; color: string; r?: number; cx?: number; cy?: number }) {
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <circle
      cx={cx} cy={cy} r={r}
      fill="none"
      stroke={color}
      strokeWidth="18"
      strokeDasharray={`${dash} ${circ - dash}`}
      strokeDashoffset={-offset * circ / 100}
      transform={`rotate(-90 ${cx} ${cy})`}
      strokeLinecap="butt"
    />
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function AnalyticsPage() {
  return (
    <div className="min-h-screen animate-enter" style={{ background: 'var(--surface)' }}>

      {/* Topbar */}
      <div className="flex items-center gap-3 px-4 sm:px-6 h-14 sticky top-0 z-10"
        style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(249,245,248,0.06)' }}>
        <div className="hidden sm:flex flex-1 max-w-xs">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl w-full"
            style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.07)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(249,245,248,0.25)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span className="font-sans text-xs" style={{ color: 'rgba(249,245,248,0.25)' }}>
              Search analytics...
            </span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/dashboard/products/new"
            className="flex items-center gap-1.5 font-sans font-semibold text-xs px-3.5 py-2 rounded-xl transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, var(--primary-dim) 0%, var(--primary) 100%)', color: '#0e0e10' }}>
            <IPlus /> <span className="hidden sm:inline">Add Product</span><span className="sm:hidden">Add</span>
          </Link>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ color: 'rgba(249,245,248,0.45)', background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.07)' }}>
            <IBell />
          </button>
        </div>
      </div>

      {/* Page body */}
      <div className="px-4 py-5 sm:px-6 sm:py-6 max-w-6xl">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="font-sans font-semibold mb-1" style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
              Performance Overview
            </h1>
            <p className="font-sans text-sm" style={{ color: 'rgba(249,245,248,0.4)' }}>
              Real-time insights for your creative business.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 font-sans text-xs px-3 py-2 rounded-xl"
              style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.08)', color: 'rgba(249,245,248,0.55)' }}>
              <ICalendar /> <span className="hidden sm:inline">Oct 1 – Oct 31, 2023</span><span className="sm:hidden">Oct 2023</span>
            </button>
            <button className="flex items-center gap-1.5 font-sans text-xs px-3 py-2 rounded-xl transition-colors"
              style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.08)', color: 'rgba(249,245,248,0.55)' }}>
              <IDownload /> Export
            </button>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 stagger">
          {METRICS.map(({ label, value, delta, positive, Icon, barColor, barPct }) => (
            <div key={label} className="rounded-2xl p-4 overflow-hidden relative"
              style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.05)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-sans text-xs" style={{ color: 'rgba(249,245,248,0.4)' }}>{label}</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(249,245,248,0.06)', color: 'rgba(249,245,248,0.5)' }}>
                  <Icon />
                </div>
              </div>
              <p className="font-sans font-semibold mb-1" style={{ fontSize: '1.5rem', color: 'var(--on-surface)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                {value}
              </p>
              <p className="font-sans text-xs font-medium mb-3"
                style={{ color: positive ? '#4ade80' : '#fb7185' }}>
                {delta}
              </p>
              {/* Trend bar */}
              <div className="h-0.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(249,245,248,0.08)' }}>
                <div className="h-full rounded-full" style={{ width: `${barPct}%`, background: barColor }} />
              </div>
            </div>
          ))}
        </div>

        {/* Activity Trends */}
        <div className="rounded-2xl p-5 mb-5"
          style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.05)' }}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="font-sans font-semibold text-sm" style={{ color: 'var(--on-surface)' }}>Activity Trends</p>
              <p className="font-sans text-xs mt-0.5" style={{ color: 'rgba(249,245,248,0.35)' }}>Engagement metrics over time</p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              {[
                { label: 'PAGE VIEWS', color: '#a8a4ff' },
                { label: 'REVENUE',    color: '#fb7185' },
                { label: 'ORDERS',     color: 'rgba(249,245,248,0.3)' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
                  <span className="font-sans text-xs uppercase tracking-widest"
                    style={{ color: 'rgba(249,245,248,0.35)', fontSize: '0.6rem', letterSpacing: '0.1em' }}>
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Line chart */}
          <div style={{ height: '160px' }}>
            <svg viewBox="0 0 480 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a8a4ff" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#a8a4ff" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {/* Area fill */}
              <polygon
                points={`${polylineStr(TREND_POINTS)} 480,120 0,120`}
                fill="url(#lineGrad)"
              />
              {/* Main line */}
              <polyline
                points={polylineStr(TREND_POINTS)}
                fill="none"
                stroke="#a8a4ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Secondary line (revenue) — shifted */}
              <polyline
                points={polylineStr(TREND_POINTS.map(([x, y]) => [x, y + 20]))}
                fill="none"
                stroke="#fb7185"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 3"
                opacity="0.6"
              />
              {/* X-axis labels */}
              {(['MON','TUE','WED','THU','FRI','SAT','SUN'] as const).map((d, i) => (
                <text key={d} x={i * 80} y="118" fontSize="8" fill="rgba(249,245,248,0.25)" style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
                  {d}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Traffic + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5 scroll-reveal">

          {/* Traffic Sources */}
          <div className="rounded-2xl p-5"
            style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.05)' }}>
            <p className="font-sans font-semibold text-sm mb-5" style={{ color: 'var(--on-surface)' }}>Traffic Sources</p>

            <div className="flex items-center gap-6">
              {/* Donut */}
              <div className="shrink-0 relative" style={{ width: '120px', height: '120px' }}>
                <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
                  <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(249,245,248,0.07)" strokeWidth="18"/>
                  <DonutSegment pct={54} offset={0}  color="#fb7185" />
                  <DonutSegment pct={22} offset={54} color="#4ade80" />
                  <DonutSegment pct={18} offset={76} color="#60a5fa" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="font-sans font-bold" style={{ color: 'var(--on-surface)', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>54%</p>
                  <p className="font-sans text-xs" style={{ color: 'rgba(249,245,248,0.35)', fontSize: '0.6rem' }}>INSTAGRAM</p>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                {TRAFFIC.map((t) => (
                  <div key={t.label} className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: t.color }} />
                    <span className="font-sans text-sm" style={{ color: 'rgba(249,245,248,0.6)' }}>{t.label}</span>
                    <span className="font-sans text-sm font-medium ml-auto" style={{ color: 'var(--on-surface)' }}>{t.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Audience Map */}
          <div className="rounded-2xl p-5"
            style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.05)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-sans font-semibold text-sm" style={{ color: 'var(--on-surface)' }}>Audience Map</p>
                <p className="font-sans text-xs mt-0.5" style={{ color: 'rgba(249,245,248,0.35)' }}>Geographical breakdown by region</p>
              </div>
              <span className="font-sans text-xs px-2.5 py-1 rounded-lg"
                style={{ background: 'var(--surface-high)', color: 'rgba(249,245,248,0.5)', border: '1px solid rgba(249,245,248,0.08)' }}>
                India
              </span>
            </div>

            <div className="flex items-center gap-5">
              {/* India SVG placeholder */}
              <div className="shrink-0 rounded-xl flex items-center justify-center"
                style={{ width: '100px', height: '100px', background: 'var(--surface-high)' }}>
                <svg viewBox="0 0 80 100" style={{ width: '60px', height: '75px' }} opacity="0.5">
                  <path d="M40 5 L55 15 L65 30 L68 50 L60 70 L50 85 L40 95 L30 85 L20 70 L12 50 L15 30 L25 15 Z" fill="rgba(168,164,255,0.3)" stroke="rgba(168,164,255,0.5)" strokeWidth="1.5"/>
                  <circle cx="48" cy="42" r="2" fill="#a8a4ff"/>
                  <circle cx="38" cy="58" r="1.5" fill="#a8a4ff" opacity="0.6"/>
                  <circle cx="30" cy="48" r="1.5" fill="#a8a4ff" opacity="0.5"/>
                </svg>
              </div>

              {/* Top cities */}
              <div className="flex-1 space-y-3">
                <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(249,245,248,0.28)', fontSize: '0.6rem', letterSpacing: '0.12em' }}>
                  Top Cities
                </p>
                {CITIES.map((c) => (
                  <div key={c.name} className="flex items-center gap-2">
                    <span className="font-sans text-xs w-20 shrink-0" style={{ color: 'rgba(249,245,248,0.55)' }}>
                      {c.name}
                    </span>
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(249,245,248,0.08)' }}>
                      <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: 'var(--primary-dim)' }} />
                    </div>
                    <span className="font-sans text-xs w-8 text-right shrink-0" style={{ color: 'rgba(249,245,248,0.4)' }}>
                      {c.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Products */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.05)' }}>
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid rgba(249,245,248,0.06)' }}>
            <p className="font-sans font-semibold text-sm" style={{ color: 'var(--on-surface)' }}>Top Performing Products</p>
            <button className="font-sans text-xs transition-colors" style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
              View Detailed Store Report →
            </button>
          </div>

          {/* Desktop table header */}
          <div className="hidden md:grid px-5 py-3" style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr', borderBottom: '1px solid rgba(249,245,248,0.05)' }}>
            {['PRODUCT NAME', 'STATUS', 'SOLD', 'CONVERSION', 'REVENUE'].map((h) => (
              <p key={h} className="font-sans text-xs uppercase tracking-widest"
                style={{ color: 'rgba(249,245,248,0.25)', letterSpacing: '0.1em', fontSize: '0.65rem' }}>
                {h}
              </p>
            ))}
          </div>

          {/* Desktop rows */}
          <div className="hidden md:block">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={i} className="grid items-center px-5 py-4 transition-colors"
                style={{
                  gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr',
                  borderBottom: i < TOP_PRODUCTS.length - 1 ? '1px solid rgba(249,245,248,0.04)' : 'none',
                }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--surface-high)', color: 'rgba(249,245,248,0.5)' }}>
                    <p.Icon />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium" style={{ color: 'var(--on-surface)' }}>{p.name}</p>
                    <p className="font-sans text-xs" style={{ color: 'rgba(249,245,248,0.35)' }}>{p.sub}</p>
                  </div>
                </div>
                <span className="font-sans text-xs font-semibold px-2.5 py-1 rounded-lg self-center"
                  style={{ background: p.statusBg, color: p.statusColor, letterSpacing: '0.05em', fontSize: '0.65rem' }}>
                  {p.status}
                </span>
                <span className="font-sans text-sm" style={{ color: 'rgba(249,245,248,0.6)' }}>{p.sold}</span>
                <span className="font-sans text-sm" style={{ color: 'rgba(249,245,248,0.6)' }}>{p.conv}</span>
                <span className="font-sans text-sm font-semibold" style={{ color: '#4ade80', fontVariantNumeric: 'tabular-nums' }}>{p.revenue}</span>
              </div>
            ))}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col divide-y" style={{ borderColor: 'rgba(249,245,248,0.04)' }}>
            {TOP_PRODUCTS.map((p, i) => (
              <div key={i} className="px-4 py-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--surface-high)', color: 'rgba(249,245,248,0.5)' }}>
                    <p.Icon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium truncate" style={{ color: 'var(--on-surface)' }}>{p.name}</p>
                    <p className="font-sans text-xs" style={{ color: 'rgba(249,245,248,0.35)' }}>{p.sub}</p>
                  </div>
                  <span className="font-sans text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0"
                    style={{ background: p.statusBg, color: p.statusColor, letterSpacing: '0.05em', fontSize: '0.65rem' }}>
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-sans" style={{ fontSize: '0.6rem', color: 'rgba(249,245,248,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sold</p>
                    <p className="font-sans text-sm" style={{ color: 'rgba(249,245,248,0.6)' }}>{p.sold}</p>
                  </div>
                  <div>
                    <p className="font-sans" style={{ fontSize: '0.6rem', color: 'rgba(249,245,248,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Conv.</p>
                    <p className="font-sans text-sm" style={{ color: 'rgba(249,245,248,0.6)' }}>{p.conv}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="font-sans" style={{ fontSize: '0.6rem', color: 'rgba(249,245,248,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Revenue</p>
                    <p className="font-sans text-sm font-semibold" style={{ color: '#4ade80', fontVariantNumeric: 'tabular-nums' }}>{p.revenue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
