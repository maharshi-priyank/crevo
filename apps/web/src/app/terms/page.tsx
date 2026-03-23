import Link from 'next/link'

export const metadata = { title: 'Terms of Service — Crevo' }

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using Crevo ("the Platform"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please discontinue use immediately.',
  },
  {
    title: '2. Creator Accounts',
    body: 'You must be at least 18 years of age to create a seller account. You are responsible for maintaining the confidentiality of your login credentials and all activity under your account.',
  },
  {
    title: '3. Products & Content',
    body: 'You retain all intellectual property rights to content you upload. By publishing on Crevo, you grant us a non-exclusive, royalty-free licence to display and distribute your content to buyers through the Platform.',
  },
  {
    title: '4. Payments & Commissions',
    body: 'Crevo charges a platform commission on each successful sale as disclosed in your dashboard. Payouts are processed via Razorpay to your verified bank account per your selected payout schedule.',
  },
  {
    title: '5. Prohibited Conduct',
    body: 'You may not sell illegal content, mislead buyers, reverse-engineer the Platform, or use automated tools to scrape data. Violations may result in immediate account suspension.',
  },
  {
    title: '6. Limitation of Liability',
    body: 'Crevo is provided "as is". We are not liable for any indirect, incidental, or consequential damages arising from your use of the Platform beyond the fees paid in the past 3 months.',
  },
  {
    title: '7. Governing Law',
    body: 'These Terms are governed by the laws of India. Any disputes shall be resolved in the courts of Ahmedabad, Gujarat.',
  },
  {
    title: '8. Changes to Terms',
    body: 'We may update these Terms from time to time. Continued use after changes constitutes acceptance. We will notify you via email for material changes.',
  },
]

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', padding: '0 0 80px' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#6c5ce7,#a8a4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '14px', color: '#0e0e10' }}>C</div>
          <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '16px', color: '#e3e2e0' }}>Crevo</span>
        </Link>
        <Link href="/privacy" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)', textDecoration: 'none' }}>Privacy Policy →</Link>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 0' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: 'rgba(227,226,224,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Legal</p>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 12px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>Terms of Service</h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.4)', margin: '0 0 48px' }}>Last updated: March 2026 · Effective immediately</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {SECTIONS.map(s => (
            <section key={s.title}>
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 10px' }}>{s.title}</h2>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.6)', lineHeight: 1.75, margin: 0 }}>{s.body}</p>
            </section>
          ))}
        </div>

        <div style={{ marginTop: 56, padding: '24px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.45)', margin: 0 }}>Questions about these terms?</p>
          <a href="mailto:legal@crevo.in" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#a8a4ff', fontWeight: 600, textDecoration: 'none' }}>legal@crevo.in →</a>
        </div>
      </div>
    </main>
  )
}
