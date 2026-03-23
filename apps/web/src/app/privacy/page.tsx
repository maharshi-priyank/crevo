import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — Crevo' }

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide directly (name, email, phone, bank details for KYC), information generated through platform use (sales data, page views, click events), and device/browser data for security and analytics.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use your data to operate the Platform, process payments, provide AI-powered insights, prevent fraud, comply with RBI/KYC regulations, and send transactional and marketing communications (which you may opt out of).',
  },
  {
    title: '3. Data Sharing',
    body: 'We share data with Razorpay (payment processing), Clerk (authentication), AWS (cloud infrastructure), and analytics providers — all under strict data processing agreements. We do not sell your personal data to third parties.',
  },
  {
    title: '4. Data Retention',
    body: 'We retain account data for as long as your account is active and for 7 years after closure as required by Indian tax and financial regulations. You may request deletion of non-legally-required data at any time.',
  },
  {
    title: '5. Security',
    body: 'We use TLS encryption in transit and AES-256 at rest. Bank account details are processed by Razorpay and never stored on Crevo servers directly. We perform regular security audits.',
  },
  {
    title: '6. Cookies',
    body: 'We use essential cookies for session management and optional cookies for analytics. You can control cookie preferences in your browser settings. Declining analytics cookies does not affect platform functionality.',
  },
  {
    title: '7. Your Rights',
    body: 'You have the right to access, correct, export, or delete your personal data. Submit requests to privacy@crevo.in. We will respond within 30 days.',
  },
  {
    title: '8. Contact',
    body: 'For privacy concerns, contact our Data Protection Officer at privacy@crevo.in or write to: Crevo Technologies Pvt. Ltd., Ahmedabad, Gujarat — 380015, India.',
  },
]

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', padding: '0 0 80px' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#6c5ce7,#a8a4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '14px', color: '#0e0e10' }}>C</div>
          <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '16px', color: '#e3e2e0' }}>Crevo</span>
        </Link>
        <Link href="/terms" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)', textDecoration: 'none' }}>Terms of Service →</Link>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 0' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: 'rgba(227,226,224,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Legal</p>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 12px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>Privacy Policy</h1>
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
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.45)', margin: 0 }}>Privacy concerns or data requests?</p>
          <a href="mailto:privacy@crevo.in" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#a8a4ff', fontWeight: 600, textDecoration: 'none' }}>privacy@crevo.in →</a>
        </div>
      </div>
    </main>
  )
}
