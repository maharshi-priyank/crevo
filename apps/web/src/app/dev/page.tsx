/**
 * Dev preview page — only accessible in development.
 * Remove this file before production.
 */
import { notFound } from 'next/navigation'
import Link from 'next/link'

const PAGES = [
  { section: 'Auth Flow', links: [
    { href: '/signup',              label: 'Signup' },
    { href: '/login',               label: 'Login' },
    { href: '/onboarding/profile',  label: 'Onboarding: Profile' },
    { href: '/onboarding/username', label: 'Onboarding: Username' },
  ]},
  { section: 'Dashboard', links: [
    { href: '/dashboard',                   label: 'Dashboard Home' },
    { href: '/dashboard/page-builder',      label: 'Page Builder' },
    { href: '/dashboard/products',          label: 'Products' },
    { href: '/dashboard/orders',            label: 'Orders' },
    { href: '/dashboard/analytics',         label: 'Analytics' },
    { href: '/dashboard/payouts',           label: 'Payouts' },
    { href: '/dashboard/settings',          label: 'Settings' },
  ]},
  { section: 'Public Storefront', links: [
    { href: '/demo',        label: 'Demo Storefront' },
    { href: '/testcreator', label: 'Test Creator' },
  ]},
]

function DevIndexPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="white" stroke="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold">Dev Preview</h1>
          <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">DEV ONLY</span>
        </div>
        <p className="text-zinc-500 text-sm mb-10">
          Direct links to all pages. Auth is bypassed for dashboard pages via Clerk dev session.
          <br />
          <span className="text-amber-400">Note: Dashboard pages still require a Clerk session. Sign in first at <Link href="/login" className="underline">/login</Link>, then come back here.</span>
        </p>

        <div className="space-y-8">
          {PAGES.map(({ section, links }) => (
            <div key={section}>
              <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-3">{section}</p>
              <div className="grid grid-cols-2 gap-2">
                {links.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] rounded-xl px-4 py-3 text-sm text-zinc-300 hover:text-white transition-all group"
                  >
                    <span>{label}</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06]">
          <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            Back to landing page
          </Link>
        </div>
      </div>
    </main>
  )
}

export default async function DevPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <DevIndexPage />
}
