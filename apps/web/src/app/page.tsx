import Link from 'next/link'
import { LandingNav } from '@/components/layout/LandingNav'

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const ICheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const IChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
const IArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)
const IImagePlaceholder = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
  </svg>
)
const IBotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><line x1="12" y1="3" x2="12" y2="7" />
  </svg>
)
const IXCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)
const ITwitter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const IInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

/* ─── Data ───────────────────────────────────────────────────────────────── */
const PAIN_POINTS = [
  {
    title: 'High Platform Fees',
    desc: 'Stop losing 15–30% of your hard-earned revenue to global platforms. We take 0% on UPI.',
  },
  {
    title: 'Delayed Payouts',
    desc: 'Stop waiting 7 days for your money. Receive funds instantly to your VPA via direct UPI rails.',
  },
  {
    title: 'English-Only UX',
    desc: 'Built for the next billion. Our interfaces and WhatsApp bots support 8+ Indian languages.',
  },
]

const TESTIMONIALS = [
  {
    amount: '₹8,45,000',
    quote: 'I switched from Patreon. My Indian audience never had credit cards. CreatorOS\'s UPI integration tripled my conversion overnight.',
    name: 'Animesh Verma',
    role: 'Tech Reviewer • 400k Subs',
    pro: false,
  },
  {
    amount: '₹2,14,000',
    quote: 'The WhatsApp bot is like having a sales team of 10 people. I make sales while I\'m recording content or even sleeping.',
    name: 'Riya Singh',
    role: 'Fitness Coach • 1.2M Followers',
    pro: true,
  },
  {
    amount: '₹5,12,000',
    quote: 'The UI is so premium. It doesn\'t look like a standard Indian payment page. It makes my brand look like it belongs in the big leagues.',
    name: 'Kabir Das',
    role: 'Motion Designer • Agency Owner',
    pro: false,
  },
]

const PLANS = [
  {
    name: 'Free',
    sub: 'For new creators starting their journey.',
    price: '₹0',
    period: '/mo',
    features: ['1 Storefront Page', 'Unlimited Products', 'WhatsApp Automation'],
    cta: 'Get Started',
    ctaHref: '/signup',
    style: 'ghost' as const,
  },
  {
    name: 'Starter',
    sub: 'Scale your audience engagement.',
    price: '₹149',
    period: '/mo',
    features: ['Custom Domain', 'Basic Analytics', 'Email Support'],
    cta: 'Upgrade',
    ctaHref: '/signup',
    style: 'dark' as const,
  },
  {
    name: 'Pro',
    sub: 'For serious full-time creators.',
    price: '₹399',
    period: '/mo',
    features: ['⚡ WhatsApp Sales Bot', '⚡ AI Revenue Coach', '⚡ Priority Payouts'],
    cta: 'Go Pro Now',
    ctaHref: '/signup',
    style: 'pro' as const,
    badge: 'MOST POPULAR',
  },
  {
    name: 'Business',
    sub: 'For talent agencies & labels.',
    price: '₹999',
    period: '/mo',
    features: ['Manage 10+ Creators', 'Dedicated Manager', 'White-label Pages'],
    cta: 'Contact Sales',
    ctaHref: '/signup',
    style: 'ghost' as const,
  },
]

const FAQS = [
  { q: 'How does CreatorOS compare to Linktree or Patreon?', a: 'Unlike Linktree, we\'re a full commerce engine — not just a link page. Unlike Patreon, we\'re built for India-first payment rails (UPI, direct payouts) with 0% commission on UPI transactions.' },
  { q: 'What payment methods do you support?', a: 'We support all major Indian payment methods via Razorpay: UPI (PhonePe, GPay, Paytm), debit/credit cards, net banking, and EMI. Payouts go directly to your bank account via UPI.' },
  { q: 'How do payouts work?', a: 'Payouts are instant for UPI transactions. Simply link your bank account or UPI VPA during onboarding and money flows directly to you after each sale.' },
  { q: 'Do I need a GST number?', a: 'No. A GST number is optional. If you have one, we\'ll include it on auto-generated invoices. If you don\'t, we still generate professional receipts for every transaction.' },
]

const FOOTER_LINKS = {
  Product:  ['Storefront', 'WhatsApp Bot', 'AI Coach', 'Analytics'],
  Company:  ['About Us', 'Contact Us', 'Creator Blog', 'Support'],
  Legal:    ['Privacy Policy', 'Terms of Service', 'Refund Policy'],
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">

      <LandingNav />

      {/* ── Alert Banner ──────────────────────────────────────────────────── */}
      <div className="pt-14">
        <div className="w-full flex justify-center items-center gap-2.5 py-2.5 px-4"
          style={{ background: 'rgba(249,245,248,0.05)', borderBottom: '1px solid rgba(249,245,248,0.06)' }}>
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
          <p className="text-xs font-sans" style={{ color: 'rgba(249,245,248,0.55)', letterSpacing: '0.01em' }}>
            <span className="font-semibold" style={{ color: 'rgba(249,245,248,0.75)' }}>ALERT</span>
            {' '}·{' '}Linktree got blocked in India. We never will.
          </p>
        </div>
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden grain bg-surface" style={{ paddingTop: '6rem', paddingBottom: '5rem' }}>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(168,164,255,0.10) 0%, transparent 65%)',
          zIndex: 0,
        }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center stagger-slow">
          <h1 className="font-serif mb-6" style={{
            fontWeight: 600,
            fontSize: 'clamp(2.75rem, 7vw, 5rem)',
            color: 'var(--on-surface)',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
          }}>
            Your entire creator
            <br />
            business.{' '}
            <span className="font-serif" style={{ fontStyle: 'italic', color: 'var(--primary)' }}>
              One link.
            </span>
          </h1>

          <p className="font-sans mb-10 max-w-lg mx-auto" style={{
            fontSize: '1rem',
            lineHeight: 1.65,
            color: 'rgba(249,245,248,0.5)',
          }}>
            The high-precision storefront for modern Bharat. Sell digital products,
            manage coaching, and collect pure UPI payments with zero commission.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-sm transition-all hover:-translate-y-0.5 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, var(--primary-dim) 0%, var(--primary) 100%)',
                color: '#0e0e10',
                padding: '0.8rem 2rem',
                borderRadius: '999px',
                boxShadow: '0 4px 32px rgba(168,164,255,0.35)',
                letterSpacing: '-0.01em',
              }}
            >
              Claim your link.os
            </Link>
            <Link
              href="/testcreator"
              className="inline-flex items-center justify-center gap-2 font-sans text-sm font-medium transition-all hover:-translate-y-0.5"
              style={{
                background: 'rgba(249,245,248,0.08)',
                border: '1px solid rgba(249,245,248,0.14)',
                color: 'var(--on-surface)',
                padding: '0.8rem 2rem',
                borderRadius: '999px',
                backdropFilter: 'blur(12px)',
              }}
            >
              View Demo
            </Link>
          </div>

          {/* Trust bar */}
          <div className="flex flex-col items-center gap-3">
            <p className="font-sans text-xs font-medium tracking-widest uppercase"
              style={{ color: 'rgba(249,245,248,0.28)', letterSpacing: '0.14em' }}>
              Trusted by 12,000+ top Indian creators
            </p>
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-lg" style={{
                  width: '48px', height: '24px',
                  background: 'rgba(249,245,248,0.10)',
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Preview ───────────────────────────────────────────────── */}
      <section className="bg-surface" style={{ paddingBottom: '6rem' }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="relative rounded-2xl overflow-visible" style={{
            background: 'var(--secondary)',
            padding: '3.5rem 2.5rem 4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Image placeholder */}
            <div className="rounded-xl flex items-center justify-center"
              style={{ width: '80px', height: '80px', background: 'rgba(0,0,0,0.12)', color: 'rgba(0,0,0,0.3)' }}>
              <IImagePlaceholder />
            </div>

            {/* Payment notification chip */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-sans"
              style={{
                background: '#0e0e10',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                whiteSpace: 'nowrap',
              }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--primary-dim)', color: '#0e0e10' }}>
                <IBotIcon />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(249,245,248,0.4)', lineHeight: 1.2 }}>
                  Latest UPI Payment
                </p>
                <p className="text-sm font-semibold" style={{ color: 'var(--on-surface)', lineHeight: 1.3 }}>
                  ₹4,999.00{' '}
                  <span style={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 500 }}>Success</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Indian creators are switching ───────────────────────────── */}
      <section className="bg-secondary-bg" style={{ padding: '6rem 0 5rem' }}>
        <div className="max-w-6xl mx-auto px-6">
          {/* Top row: headline + description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 items-end">
            <h2 className="font-serif" style={{
              fontWeight: 600,
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              color: 'var(--on-secondary-dark)',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
            }}>
              Why Indian creators
              <br />are switching.
            </h2>
            <p className="font-sans" style={{
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'var(--on-secondary)',
              maxWidth: '460px',
            }}>
              Global tools weren't built for Bharat. We solve for high platform fees,
              slow UPI payouts, and the mobile-first Indian internet.
            </p>
          </div>

          {/* Pain points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 stagger">
            {PAIN_POINTS.map((p) => (
              <div key={p.title} className="scroll-reveal">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5"
                  style={{ background: 'rgba(251,113,133,0.15)', color: '#fb7185' }}>
                  <IXCircle />
                </div>
                <h3 className="font-sans font-semibold mb-2" style={{
                  fontSize: '1rem',
                  color: 'var(--on-secondary-dark)',
                  letterSpacing: '-0.01em',
                }}>
                  {p.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--on-secondary)' }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp Sales, on Autopilot ─────────────────────────────────── */}
      <section id="features" className="bg-surface" style={{ padding: '6rem 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: mockup */}
            <div className="rounded-2xl flex items-center justify-center order-2 md:order-1"
              style={{
                background: 'var(--surface-low)',
                aspectRatio: '1 / 1',
                maxWidth: '420px',
              }}>
              <div className="rounded-2xl flex items-center justify-center"
                style={{ width: '55%', aspectRatio: '1 / 1', background: 'var(--secondary)', color: 'rgba(0,0,0,0.25)' }}>
                <IImagePlaceholder />
              </div>
            </div>

            {/* Right: copy */}
            <div className="order-1 md:order-2">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-5"
                style={{ color: 'var(--primary)', letterSpacing: '0.14em' }}>
                Automated Growth
              </p>
              <h2 className="font-serif mb-5" style={{
                fontWeight: 600,
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                color: 'var(--on-surface)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}>
                WhatsApp Sales,
                <br />on Autopilot.
              </h2>
              <p className="font-sans mb-8" style={{
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'rgba(249,245,248,0.5)',
              }}>
                Indian audiences live on WhatsApp. Your CreatorOS bot answers questions,
                handles payments, and sends product delivery links 24/7.
              </p>
              <Link href="/signup"
                className="inline-flex items-center gap-2 font-sans font-medium text-sm transition-all hover:-translate-y-0.5"
                style={{
                  background: 'rgba(249,245,248,0.10)',
                  border: '1px solid rgba(249,245,248,0.18)',
                  color: 'var(--on-surface)',
                  padding: '0.65rem 1.5rem',
                  borderRadius: '999px',
                  backdropFilter: 'blur(12px)',
                }}>
                Learn about Automations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Revenue Coach ─────────────────────────────────────────────── */}
      <section className="bg-surface" style={{ padding: '2rem 0 6rem' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-5"
                style={{ color: 'var(--primary)', letterSpacing: '0.14em' }}>
                Creator Alpha
              </p>
              <h2 className="font-serif mb-5" style={{
                fontWeight: 600,
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                color: 'var(--on-surface)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}>
                AI Revenue Coach.
              </h2>
              <p className="font-sans" style={{
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'rgba(249,245,248,0.5)',
              }}>
                Our AI analyzes your niche, engagement rates, and current offerings to
                suggest pricing pivots and product launches that actually convert for the
                Indian market.
              </p>
            </div>

            {/* Right: coach insight card */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--surface-low)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--surface-high)', color: 'var(--primary)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 1-2 0v-.07A7 7 0 0 1 5 10a1 1 0 0 1 2 0 5 5 0 0 0 5 5 5 5 0 0 0 5-5 1 1 0 0 1 2 0 7 7 0 0 1-6 6.93z" />
                  </svg>
                </div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest"
                  style={{ color: 'rgba(249,245,248,0.4)', letterSpacing: '0.12em' }}>
                  Coach Insight
                </p>
              </div>

              <p className="font-sans text-sm leading-relaxed mb-5"
                style={{ color: 'rgba(249,245,248,0.65)', fontStyle: 'italic' }}>
                "Your audience engages most with 'Hindi-Tech' content on Tuesdays.
                Launching a ₹199 mini-course at 8 PM would likely generate ₹45,000 in 4 hours."
              </p>

              <button className="font-sans text-sm font-medium transition-colors"
                style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Apply Strategy →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="bg-surface" style={{ padding: '4rem 0 6rem' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-center mb-14" style={{
            fontWeight: 600,
            fontSize: 'clamp(2rem, 4.5vw, 3rem)',
            color: 'var(--on-surface)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            Real creators. Real{' '}
            <span className="text-green-gradient">rupees.</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl p-6 relative card-lift"
                style={{ background: 'var(--surface-low)' }}>
                {t.pro && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full font-sans text-xs font-semibold"
                    style={{ background: 'var(--primary-dim)', color: '#0e0e10', fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                    PRO USER
                  </div>
                )}
                <p className="font-sans font-bold mb-3" style={{
                  fontSize: 'clamp(1.5rem, 3vw, 1.75rem)',
                  color: '#4ade80',
                  letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {t.amount}
                </p>
                <p className="font-sans text-sm leading-relaxed mb-6"
                  style={{ color: 'rgba(249,245,248,0.55)' }}>
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4"
                  style={{ borderTop: '1px solid rgba(249,245,248,0.07)' }}>
                  <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-sans font-bold text-sm"
                    style={{ background: 'var(--surface-highest)', color: 'rgba(249,245,248,0.6)' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-sm" style={{ color: 'var(--on-surface)', lineHeight: 1.2 }}>
                      {t.name}
                    </p>
                    <p className="font-sans text-xs mt-0.5" style={{ color: 'rgba(249,245,248,0.35)' }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission Statement ─────────────────────────────────────────────── */}
      <section className="bg-surface text-center" style={{ padding: '6rem 1.5rem' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif mb-6" style={{
            fontWeight: 700,
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            color: 'var(--on-surface)',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
          }}>
            90 करोड़{' '}
            <span style={{ color: 'var(--primary)' }}>Indians</span>
            {' '}are
            <br />
            online.
            <br />
            Are you selling yet?
          </h2>
          <p className="font-sans mb-8 max-w-xl mx-auto" style={{
            fontSize: '1rem',
            lineHeight: 1.7,
            color: 'rgba(249,245,248,0.4)',
          }}>
            Bharat is the new global frontier. We're building the infrastructure that
            lets our creators own their future, their data, and their revenue.
          </p>
          <div className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'rgba(249,245,248,0.3)', letterSpacing: '0.16em' }}>
            <span style={{ color: '#F97316', fontSize: '0.7rem' }}>●</span>
            Built in India, for the world.
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-secondary-bg" style={{ padding: '6rem 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif mb-3" style={{
              fontWeight: 600,
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              color: 'var(--on-secondary-dark)',
              letterSpacing: '-0.025em',
            }}>
              Simple pricing, no surprises.
            </h2>
            <p className="font-sans" style={{ color: 'var(--on-secondary)', fontSize: '0.95rem' }}>
              Every plan includes 0% platform commission on direct UPI payments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start stagger">
            {PLANS.map((plan) => {
              const isPro = plan.style === 'pro'
              const isDark = plan.style === 'dark'
              return (
                <div key={plan.name} className="relative rounded-2xl p-6 flex flex-col card-lift"
                  style={isPro
                    ? { background: '#0e0e10', boxShadow: '0 8px 48px rgba(0,0,0,0.3)' }
                    : isDark
                    ? { background: '#2a2a2e', border: '1px solid rgba(0,0,0,0.08)' }
                    : { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }
                  }>
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full font-sans text-xs font-bold"
                      style={{
                        background: 'var(--primary-dim)',
                        color: '#0e0e10',
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.04em',
                      }}>
                      {plan.badge}
                    </div>
                  )}

                  <p className="font-sans font-semibold mb-1 text-sm" style={{ color: isPro ? 'var(--on-surface)' : 'var(--on-secondary-dark)' }}>
                    {plan.name}
                  </p>
                  <p className="font-sans text-xs mb-4" style={{ color: isPro ? 'rgba(249,245,248,0.4)' : 'var(--on-secondary)' }}>
                    {plan.sub}
                  </p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-serif" style={{
                      fontWeight: 600,
                      fontSize: '2.25rem',
                      color: isPro ? 'var(--on-surface)' : 'var(--on-secondary-dark)',
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                    }}>
                      {plan.price}
                    </span>
                    <span className="font-sans text-sm" style={{ color: isPro ? 'rgba(249,245,248,0.4)' : 'var(--on-secondary)' }}>
                      {plan.period}
                    </span>
                  </div>

                  <ul className="space-y-2.5 mb-7 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 font-sans text-sm"
                        style={{ color: isPro ? 'rgba(249,245,248,0.7)' : 'var(--on-secondary)' }}>
                        <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            background: isPro ? 'rgba(168,164,255,0.2)' : 'rgba(0,0,0,0.08)',
                            color: isPro ? 'var(--primary)' : 'var(--on-secondary)',
                          }}>
                          <ICheck />
                        </span>
                        {f.replace('⚡ ', '')}
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.ctaHref}
                    className="block text-center font-sans font-semibold text-sm py-3 rounded-xl transition-all hover:-translate-y-0.5"
                    style={isPro
                      ? { background: 'var(--primary)', color: '#0e0e10' }
                      : isDark
                      ? { background: '#0e0e10', color: 'var(--on-surface)' }
                      : { background: 'rgba(0,0,0,0.08)', color: 'var(--on-secondary-dark)', border: '1px solid rgba(0,0,0,0.1)' }
                    }>
                    {plan.cta}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="bg-secondary-bg" style={{ padding: '0 0 6rem' }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="space-y-2">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.7)' }}>
                <summary className="flex items-center justify-between gap-4 px-6 py-5 font-sans font-medium text-sm cursor-pointer select-none list-none"
                  style={{ color: 'var(--on-secondary-dark)' }}>
                  <span>{faq.q}</span>
                  <span className="shrink-0 transition-transform duration-200 group-open:rotate-180" style={{ color: 'var(--on-secondary)' }}>
                    <IChevronDown />
                  </span>
                </summary>
                <div className="px-6 pb-5 font-sans text-sm leading-relaxed" style={{ color: 'var(--on-secondary)' }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-surface" style={{ borderTop: '1px solid rgba(249,245,248,0.06)', padding: '4rem 0 2rem' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            {/* Brand col */}
            <div className="md:col-span-2">
              <p className="font-sans font-semibold mb-3" style={{ color: 'var(--on-surface)', fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
                CreatorOS
              </p>
              <p className="font-sans text-sm leading-relaxed mb-5" style={{ color: 'rgba(249,245,248,0.35)', maxWidth: '240px' }}>
                Built for the modern Bharat creator. The high-precision engine for your digital empire.
              </p>
              <div className="flex items-center gap-3">
                {[ITwitter, IInstagram].map((Icon, i) => (
                  <a key={i} href="#"
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: 'var(--surface-low)', color: 'rgba(249,245,248,0.4)' }}>
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([col, links]) => (
              <div key={col}>
                <p className="font-sans font-semibold text-sm mb-4" style={{ color: 'var(--on-surface)' }}>
                  {col}
                </p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="font-sans text-sm transition-colors hover:text-white"
                        style={{ color: 'rgba(249,245,248,0.35)' }}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-6" style={{ borderTop: '1px solid rgba(249,245,248,0.06)' }}>
            <p className="font-sans text-xs text-center uppercase tracking-widest"
              style={{ color: 'rgba(249,245,248,0.2)', letterSpacing: '0.14em' }}>
              © 2024 CreatorOS. Built for the modern Bharat creator. Made with ♥ in Bengaluru
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
