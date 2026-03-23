import Link from 'next/link'

/* ── Icons ───────────────────────────────────────────────────────────────── */
const IBell      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const IArrowRight= () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const ITrend     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
const IHourglass = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>
const IDownload  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const IBank      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
const IUPI       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>

/* ── Payout history data ─────────────────────────────────────────────────── */
const PAYOUTS = [
  {
    ref: '#COS-9821-XP',
    date: '14 Oct, 2023',
    MethodIcon: IBank,
    method: 'HDFC Bank ...8891',
    amount: '₹12,450.00',
    status: 'PAID' as const,
  },
  {
    ref: '#COS-8711-LM',
    date: '22 Sep, 2023',
    MethodIcon: IUPI,
    method: 'UPI priya@okhdfc',
    amount: '₹45,200.00',
    status: 'PAID' as const,
  },
  {
    ref: '#COS-7650-QK',
    date: '08 Sep, 2023',
    MethodIcon: IBank,
    method: 'HDFC Bank ...8891',
    amount: '₹3,200.00',
    status: 'PROCESSING' as const,
  },
]

const STATUS_STYLE = {
  PAID:       { color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.2)'  },
  PROCESSING: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.2)'  },
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function EarningsPage() {
  return (
    <div className="min-h-screen animate-enter" style={{ background: 'var(--surface)' }}>

      {/* ── Topbar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 h-14 sticky top-0 z-10"
        style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(249,245,248,0.06)' }}>

        {/* Avatar + name (visible in topbar on this page) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-semibold text-xs"
            style={{ background: 'linear-gradient(135deg,#7b76e8,#a8a4ff)', color: '#0e0e10' }}>
            P
          </div>
          <div>
            <p className="font-sans font-semibold text-xs leading-tight" style={{ color: 'var(--on-surface)' }}>
              Priya Sharma
            </p>
            <p className="font-sans text-xs leading-tight" style={{ color: 'rgba(249,245,248,0.35)', fontSize: '0.65rem' }}>
              Pro Creator
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xs ml-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.07)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(249,245,248,0.25)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span className="font-sans text-xs" style={{ color: 'rgba(249,245,248,0.25)' }}>
              Search earnings...
            </span>
          </div>
        </div>

        {/* Right: Withdraw CTA + bell */}
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="#"
            className="flex items-center gap-2 font-sans font-semibold text-sm px-5 py-2 rounded-full transition-all hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, var(--primary-dim) 0%, var(--primary) 100%)',
              color: '#0e0e10',
              boxShadow: '0 4px 20px rgba(168,164,255,0.3)',
              letterSpacing: '-0.01em',
            }}
          >
            Withdraw ₹18,420
          </Link>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center relative"
            style={{ color: 'rgba(249,245,248,0.45)', background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.07)' }}>
            <IBell />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#fb7185' }} />
          </button>
        </div>
      </div>

      {/* ── Page body ──────────────────────────────────────────────────── */}
      <div className="px-6 py-6 max-w-5xl">

        {/* ── Hero row: total earned + available ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5 stagger">

          {/* Total Earned */}
          <div className="lg:col-span-2 rounded-2xl p-7"
            style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.05)' }}>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(249,245,248,0.35)', letterSpacing: '0.14em' }}>
              Total Earned All Time
            </p>
            <p className="font-sans font-bold mb-3"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                color: 'var(--on-surface)',
                letterSpacing: '-0.03em',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}>
              ₹2,14,850
            </p>
            <div className="flex items-center gap-1.5">
              <span style={{ color: '#4ade80' }}><ITrend /></span>
              <span className="font-sans text-sm font-medium" style={{ color: '#4ade80' }}>
                +12.4% from last month
              </span>
            </div>
          </div>

          {/* Available to Withdraw */}
          <div className="rounded-2xl p-6 flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, var(--primary-dim) 0%, var(--primary) 100%)' }}>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(14,14,16,0.6)', letterSpacing: '0.12em' }}>
              Available to Withdraw
            </p>
            <p className="font-sans font-bold mb-5"
              style={{
                fontSize: '2.25rem',
                color: '#0e0e10',
                letterSpacing: '-0.03em',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}>
              ₹18,420
            </p>
            <button
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-sans font-bold text-sm transition-all hover:-translate-y-0.5 active:scale-95"
              style={{ background: '#0e0e10', color: 'var(--on-surface)' }}
            >
              Withdraw Now <IArrowRight />
            </button>
          </div>
        </div>

        {/* ── Processing + GST row ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

          {/* Processing */}
          <div className="rounded-2xl p-5"
            style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.05)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}>
                <IHourglass />
              </div>
              <span className="font-sans text-sm font-medium" style={{ color: 'rgba(249,245,248,0.6)' }}>
                Processing
              </span>
            </div>
            <p className="font-sans font-bold mb-1"
              style={{
                fontSize: '1.875rem',
                color: '#fb7185',
                letterSpacing: '-0.03em',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}>
              ₹3,200
            </p>
            <p className="font-sans text-xs mt-2" style={{ color: 'rgba(249,245,248,0.35)' }}>
              Will be available by 24 Oct
            </p>
          </div>

          {/* GST & Tax Summary */}
          <div className="lg:col-span-2 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.05)' }}>
            <div className="flex-1 min-w-0">
              <p className="font-sans font-semibold text-sm mb-1" style={{ color: 'var(--on-surface)' }}>
                GST &amp; Tax Summary
              </p>
              <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(249,245,248,0.4)' }}>
                Your business is registered under CreatorOS Fintech. Monthly reports are ready.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {[
                { label: 'GST DEDUCTED', value: '₹38,670' },
                { label: 'TDS PAID',     value: '₹4,297'  },
              ].map((t) => (
                <div key={t.label} className="rounded-xl px-4 py-3 text-center"
                  style={{ background: 'var(--surface-high)', border: '1px solid rgba(249,245,248,0.07)', minWidth: '100px' }}>
                  <p className="font-sans text-xs uppercase tracking-widest mb-1"
                    style={{ color: 'rgba(249,245,248,0.3)', fontSize: '0.6rem', letterSpacing: '0.12em' }}>
                    {t.label}
                  </p>
                  <p className="font-sans font-semibold" style={{
                    color: 'var(--on-surface)',
                    fontSize: '1rem',
                    letterSpacing: '-0.02em',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {t.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Payout History ─────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.05)' }}>

          {/* Section header */}
          <div className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid rgba(249,245,248,0.06)' }}>
            <p className="font-sans font-semibold" style={{ color: 'var(--on-surface)', fontSize: '1rem' }}>
              Payout History
            </p>
            <button className="flex items-center gap-1.5 font-sans text-xs transition-colors"
              style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Download All Statements <IDownload />
            </button>
          </div>

          {/* Table header */}
          <div className="grid px-6 py-3"
            style={{
              gridTemplateColumns: '1.5fr 1fr 1.5fr 1fr 1fr',
              borderBottom: '1px solid rgba(249,245,248,0.05)',
              background: 'rgba(249,245,248,0.02)',
            }}>
            {['REFERENCE ID', 'DATE', 'METHOD', 'AMOUNT', 'STATUS'].map((h) => (
              <p key={h} className="font-sans text-xs uppercase tracking-widest"
                style={{ color: 'rgba(249,245,248,0.25)', fontSize: '0.65rem', letterSpacing: '0.12em' }}>
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          {PAYOUTS.map((payout, i) => {
            const s = STATUS_STYLE[payout.status]
            return (
              <div
                key={payout.ref}
                className="grid items-center px-6 py-4 transition-colors"
                style={{
                  gridTemplateColumns: '1.5fr 1fr 1.5fr 1fr 1fr',
                  borderBottom: i < PAYOUTS.length - 1 ? '1px solid rgba(249,245,248,0.04)' : 'none',
                }}
              >
                {/* Ref ID */}
                <span className="font-mono text-sm font-medium" style={{ color: 'var(--on-surface)', letterSpacing: '0.02em' }}>
                  {payout.ref}
                </span>

                {/* Date */}
                <span className="font-sans text-sm" style={{ color: 'rgba(249,245,248,0.45)' }}>
                  {payout.date}
                </span>

                {/* Method */}
                <div className="flex items-center gap-2">
                  <span style={{ color: 'rgba(249,245,248,0.4)' }}>
                    <payout.MethodIcon />
                  </span>
                  <span className="font-sans text-sm" style={{ color: 'rgba(249,245,248,0.6)' }}>
                    {payout.method}
                  </span>
                </div>

                {/* Amount */}
                <span className="font-sans font-semibold text-sm"
                  style={{ color: 'var(--on-surface)', fontVariantNumeric: 'tabular-nums' }}>
                  {payout.amount}
                </span>

                {/* Status badge */}
                <div>
                  <span className="font-sans font-semibold text-xs px-3 py-1 rounded-lg"
                    style={{
                      color: s.color,
                      background: s.bg,
                      border: `1px solid ${s.border}`,
                      letterSpacing: '0.06em',
                      fontSize: '0.65rem',
                    }}>
                    {payout.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
