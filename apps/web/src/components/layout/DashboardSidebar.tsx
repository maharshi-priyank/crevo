'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'

/* ── Icons ───────────────────────────────────────────────────────────────── */
const IHome      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const IPage      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IBox       = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
const IOrders    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
const IBar       = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const IDollar    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const IZap       = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
const IWhatsApp  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
const ICollab    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const ISettings  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
const IPlus      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IBell      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const IHelp      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const ILogOut    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>

const NAV: { href: string; label: string; Icon: () => JSX.Element; disabled?: boolean }[] = [
  { href: '/dashboard',                label: 'Home',           Icon: IHome     },
  { href: '/dashboard/page-builder',   label: 'My Page',        Icon: IPage     },
  { href: '/dashboard/products',       label: 'Products',       Icon: IBox      },
  { href: '/dashboard/orders',         label: 'Orders',         Icon: IOrders   },
  { href: '/dashboard/analytics',      label: 'Analytics',      Icon: IBar,      disabled: true },
  { href: '/dashboard/earnings',       label: 'Earnings',       Icon: IDollar,   disabled: true },
  { href: '/dashboard/ai-coach',       label: 'AI Coach',       Icon: IZap,      disabled: true },
  { href: '/dashboard/whatsapp',       label: 'WhatsApp Store', Icon: IWhatsApp, disabled: true },
  { href: '/dashboard/collabs',        label: 'Collabs',        Icon: ICollab,   disabled: true },
  { href: '/dashboard/settings',       label: 'Settings',       Icon: ISettings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  const displayName = isLoaded && user ? (user.fullName ?? user.firstName ?? user.username ?? 'Creator') : 'Loading…'
  const handle      = isLoaded && user ? (user.username ?? user.primaryEmailAddress?.emailAddress?.split('@')[0] ?? '') : ''
  const initial     = displayName[0]?.toUpperCase() ?? 'C'

  return (
    <aside
      className="hidden md:flex flex-col shrink-0"
      style={{
        width: '200px',
        background: 'var(--surface-low)',
        borderRight: '1px solid rgba(249,245,248,0.06)',
      }}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(249,245,248,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm"
            style={{ background: 'var(--primary-dim)', color: '#0e0e10', letterSpacing: '-0.03em', fontFamily: 'Fraunces, serif' }}>
            C
          </div>
          <span style={{ color: 'var(--on-surface)', fontSize: '15px', letterSpacing: '-0.01em', fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
            Crevo
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
        {NAV.map(({ href, label, Icon, disabled }) => {
          const active = !disabled && (pathname === href || (href !== '/dashboard' && pathname.startsWith(href)))
          if (disabled) {
            return (
              <div
                key={href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm"
                style={{
                  color: 'rgba(249,245,248,0.2)',
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                  fontWeight: 400,
                  cursor: 'default',
                }}
              >
                <span style={{ color: 'rgba(249,245,248,0.15)' }}>
                  <Icon />
                </span>
                <span className="flex-1">{label}</span>
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: 'rgba(168,164,255,0.4)',
                  background: 'rgba(168,164,255,0.08)',
                  border: '1px solid rgba(168,164,255,0.15)',
                  borderRadius: '4px',
                  padding: '1px 5px',
                  lineHeight: 1.6,
                }}>SOON</span>
              </div>
            )
          }
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-150"
              style={{
                color: active ? 'var(--on-surface)' : 'rgba(249,245,248,0.4)',
                background: active ? 'rgba(168,164,255,0.12)' : 'transparent',
                fontFamily: 'DM Sans, system-ui, sans-serif',
                fontWeight: active ? 500 : 400,
              }}
            >
              <span style={{ color: active ? 'var(--primary)' : 'rgba(249,245,248,0.35)' }}>
                <Icon />
              </span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom utility links */}
      <div className="px-2 pb-1" style={{ borderTop: '1px solid rgba(249,245,248,0.04)' }}>
        {[
          { href: '/dashboard/notifications', label: 'Notifications', Icon: IBell },
          { href: '/dashboard/support',       label: 'Help & Support', Icon: IHelp },
        ].map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-150"
              style={{ color: active ? 'var(--primary)' : 'rgba(249,245,248,0.3)', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
              <Icon /> {label}
            </Link>
          )
        })}
      </div>

      {/* User + CTA */}
      <div className="p-3 shrink-0" style={{ borderTop: '1px solid rgba(249,245,248,0.06)' }}>
        {/* User row */}
        <div className="flex items-center gap-2.5 mb-3 px-1">
          {user?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.imageUrl} alt={displayName} className="w-8 h-8 rounded-full shrink-0 object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs"
              style={{ background: 'linear-gradient(135deg,#7b76e8,#a8a4ff)', color: '#0e0e10', fontFamily: 'DM Sans, sans-serif' }}>
              {initial}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate" style={{ color: 'var(--on-surface)', lineHeight: 1.3, fontFamily: 'DM Sans, sans-serif' }}>
              {displayName}
            </p>
            {handle && (
              <p className="text-xs truncate" style={{ color: 'rgba(249,245,248,0.35)', fontSize: '0.68rem', fontFamily: 'DM Sans, sans-serif' }}>
                @{handle}
              </p>
            )}
          </div>
          {/* Log out */}
          <button type="button" title="Sign out" onClick={() => signOut({ redirectUrl: '/login' })}
            className="shrink-0 p-1 rounded-lg transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(249,245,248,0.25)' }}>
            <ILogOut />
          </button>
        </div>

        {/* Add Product CTA */}
        <Link
          href="/dashboard/products/add"
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl font-semibold text-xs transition-all hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, var(--primary-dim) 0%, var(--primary) 100%)',
            color: '#0e0e10',
            letterSpacing: '-0.01em',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          <IPlus /> Add Product
        </Link>
      </div>
    </aside>
  )
}
