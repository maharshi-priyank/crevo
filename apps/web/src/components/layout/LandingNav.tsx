'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '#features',  label: 'Features'  },
  { href: '#showcase',  label: 'Showcase'  },
  { href: '#pricing',   label: 'Pricing'   },
  { href: '#resources', label: 'Resources' },
]

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: 'rgba(14,14,16,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(249,245,248,0.07)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/"
          className="font-sans font-semibold"
          style={{
            color: 'var(--on-surface)',
            fontSize: '16px',
            letterSpacing: '-0.01em',
            textDecoration: 'none',
          }}>
          CreatorOS
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href}
              className="nav-link px-3.5 py-1.5 rounded-lg font-sans text-sm transition-colors"
              style={{ color: 'rgba(249,245,248,0.5)', textDecoration: 'none' }}>
              {label}
            </a>
          ))}
        </div>

        {/* CTA group */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login"
            className="font-sans text-sm transition-colors hover:text-white"
            style={{ color: 'rgba(249,245,248,0.5)', textDecoration: 'none' }}>
            Login
          </Link>
          <Link href="/signup"
            className="font-sans font-semibold text-sm transition-all hover:-translate-y-0.5 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--primary-dim) 0%, var(--primary) 100%)',
              color: '#0e0e10',
              padding: '0.45rem 1.25rem',
              borderRadius: '999px',
              boxShadow: '0 2px 16px rgba(168,164,255,0.28)',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}>
            Start for free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: 'rgba(249,245,248,0.6)' }}
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen
              ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <div className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: mobileOpen ? '300px' : '0', background: 'rgba(14,14,16,0.98)' }}>
        <div className="px-6 py-4 flex flex-col gap-0.5">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href}
              onClick={() => setMobileOpen(false)}
              className="py-3 px-3 font-sans text-sm rounded-lg transition-colors"
              style={{ color: 'rgba(249,245,248,0.55)', textDecoration: 'none' }}>
              {label}
            </a>
          ))}
          <div className="flex gap-3 mt-3 pt-4" style={{ borderTop: '1px solid rgba(249,245,248,0.08)' }}>
            <Link href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center py-2.5 rounded-xl font-sans text-sm transition-colors"
              style={{ background: 'rgba(249,245,248,0.06)', color: 'rgba(249,245,248,0.65)', textDecoration: 'none' }}>
              Login
            </Link>
            <Link href="/signup"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center py-2.5 rounded-full font-sans font-semibold text-sm"
              style={{
                background: 'linear-gradient(135deg, var(--primary-dim) 0%, var(--primary) 100%)',
                color: '#0e0e10',
                textDecoration: 'none',
              }}>
              Start for free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
