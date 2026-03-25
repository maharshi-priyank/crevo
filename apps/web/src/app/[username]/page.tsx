import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

// ─── Re-validation ─────────────────────────────────────────────────────────────
export const revalidate = 60

// ─── Constants ────────────────────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

const BG_COLORS: Record<string, string> = {
  dark:     '#07070f',
  gradient: '#07070f',
  cream:    '#f5f0e8',
  pure:     '#fafafa',
  deep:     '#020209',
}

const CARD_RADII:  Record<string, number> = { sharp: 8, medium: 20, full: 32 }
const BTN_RADII:   Record<string, number> = { sharp: 8, medium: 14, full: 100 }

const PRODUCT_CTA: Record<string, string> = {
  course:       'Enroll Now',
  session_1on1: 'Book a Session',
  community:    'Join Community',
  webinar:      'Register Free',
  membership:   'Become a Member',
  bundle:       'Get the Bundle',
  default:      'Buy Now',
}

const PRODUCT_COVER_GRADIENTS: Record<string, string> = {
  digital_download: 'linear-gradient(135deg,#667eea,#764ba2)',
  course:           'linear-gradient(135deg,#f093fb,#f5576c)',
  session_1on1:     'linear-gradient(135deg,#4facfe,#00f2fe)',
  membership:       'linear-gradient(135deg,#43e97b,#38f9d7)',
  bundle:           'linear-gradient(135deg,#fa709a,#fee140)',
  webinar:          'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  default:          'linear-gradient(135deg,#6c5ce7,#a8a4ff)',
}

const CATEGORY_LABELS: Record<string, string> = {
  fitness:   'Fitness',  finance:   'Finance',  education: 'Education',
  tech:      'Tech',     music:     'Music',    art:       'Art & Design',
  business:  'Business', lifestyle: 'Lifestyle',food:      'Food',
  wellness:  'Wellness', gaming:    'Gaming',   travel:    'Travel',
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id:              string
  title:           string
  slug:            string
  description:     string
  coverImageUrl:   string | null
  productType:     string
  priceInr:        number
  comparePriceInr: number | null
  isFree:          boolean
}

interface SocialLink { platform: string; url: string }

interface PageSettings {
  accent:        string
  bgStyle:       string
  buttonStyle:   'filled' | 'outline' | 'pill'
  cornerRadius:  'sharp' | 'medium' | 'full'
  fontPair:      string
  productLayout: 'list' | 'grid'
}

interface StorefrontBlock {
  id:      string
  type:    string
  visible: boolean
  config:  Record<string, string>
}

interface StorefrontData {
  username:       string
  displayName:    string
  bio:            string | null
  avatarUrl:      string | null
  category:       string
  credilinkScore: number
  isVerified:     boolean
  products:       Product[]
  socialLinks:    SocialLink[]
  followerCount?: number
  pageSettings?:  PageSettings
  blocks?:        StorefrontBlock[]
}

const DEFAULT_SETTINGS: PageSettings = {
  accent:        '#a8a4ff',
  bgStyle:       'dark',
  buttonStyle:   'filled',
  cornerRadius:  'medium',
  fontPair:      'default',
  productLayout: 'list',
}

// ─── Theme tokens ─────────────────────────────────────────────────────────────
interface ThemeTokens {
  bg:          string
  text:        string
  textSub:     string
  textMuted:   string
  cardBg:      string
  cardBorder:  string
  navBg:       string
  accent:      string
  isDark:      boolean
  headingFont: string
  bodyFont:    string
  cardRadius:  number
  btnRadius:   number
}

function deriveTheme(s: PageSettings): ThemeTokens {
  const isDark = s.bgStyle !== 'cream' && s.bgStyle !== 'pure'
  return {
    bg:          BG_COLORS[s.bgStyle] ?? '#07070f',
    isDark,
    text:        isDark ? '#f0effe'                : '#1a1209',
    textSub:     isDark ? 'rgba(227,226,224,0.65)' : 'rgba(26,18,9,0.6)',
    textMuted:   isDark ? 'rgba(227,226,224,0.35)' : 'rgba(26,18,9,0.35)',
    cardBg:      isDark ? 'rgba(255,255,255,0.03)' : '#fff',
    cardBorder:  isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.09)',
    navBg:       isDark ? 'rgba(7,7,15,0.85)'      : 'rgba(245,240,232,0.9)',
    accent:      s.accent,
    headingFont: s.fontPair === 'mono' ? 'monospace' : 'Fraunces, serif',
    bodyFont:    s.fontPair === 'mono' ? 'monospace' : 'DM Sans, sans-serif',
    cardRadius:  CARD_RADII[s.cornerRadius] ?? 20,
    btnRadius:   BTN_RADII[s.cornerRadius]  ?? 14,
  }
}

function getCtaStyle(t: ThemeTokens, s: PageSettings, isFree: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '13px 20px', textDecoration: 'none',
    fontFamily: t.bodyFont, fontWeight: 700, fontSize: '15px', letterSpacing: '-0.01em',
    width: '100%',
  }
  if (isFree) return { ...base, borderRadius: t.btnRadius, background: 'linear-gradient(135deg,#10b981,#34d399)', color: '#fff', boxShadow: '0 6px 24px rgba(16,185,129,0.3)' }
  if (s.buttonStyle === 'outline') return { ...base, borderRadius: t.btnRadius, background: 'transparent', border: `1.5px solid ${t.accent}`, color: t.accent }
  if (s.buttonStyle === 'pill') return { ...base, borderRadius: 100, background: t.accent, color: '#fff', boxShadow: `0 6px 24px ${t.accent}50` }
  return { ...base, borderRadius: t.btnRadius, background: t.accent, color: '#fff', boxShadow: `0 6px 24px ${t.accent}50` }
}

// ─── Data fetching ────────────────────────────────────────────────────────────
async function getStorefront(username: string): Promise<StorefrontData | null> {
  try {
    const res = await fetch(`${API_URL}/storefront/${username}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function fmtPrice(n: number): string { return `₹${n.toLocaleString('en-IN')}` }
function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SocialIcon({ platform }: { platform: string }) {
  const icons: Record<string, React.ReactNode> = {
    instagram: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    youtube:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>,
    twitter:   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    linkedin:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    whatsapp:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
    tiktok:    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.27 8.27 0 0 0 4.84 1.55V7.05a4.85 4.85 0 0 1-1.07-.36z"/></svg>,
    website:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  }
  return <>{icons[platform] ?? icons.website}</>
}

function StatCell({ label, value, theme, accent }: { label: string; value: string; theme: ThemeTokens; accent?: boolean }) {
  return (
    <div style={{ flex: 1, textAlign: 'center', padding: '14px 8px' }}>
      <p style={{ fontFamily: theme.headingFont, fontSize: '20px', fontWeight: 700, color: accent ? theme.accent : theme.text, margin: '0 0 2px' }}>{value}</p>
      <p style={{ fontFamily: theme.bodyFont, fontSize: '10px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{label}</p>
    </div>
  )
}

function ProfileHero({ data, theme }: { data: StorefrontData; theme: ThemeTokens; settings: PageSettings }) {
  const categoryLabel = CATEGORY_LABELS[data.category] ?? data.category
  return (
    <div className="sf-hero" style={{ textAlign: 'center', padding: '48px 24px 32px', position: 'relative' }}>
      {/* Avatar */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
        <div className="sf-avatar-ring" style={{
          borderRadius: '50%', background: `linear-gradient(135deg,${theme.accent},${theme.accent}88)`,
          padding: 3, margin: '0 auto',
          boxShadow: `0 0 0 6px ${theme.accent}1a, 0 8px 40px ${theme.accent}40`,
        }}>
          <div style={{ borderRadius: '50%', overflow: 'hidden', background: theme.isDark ? '#1a1a2e' : '#f0ede8' }} className="sf-avatar-inner">
            {data.avatarUrl
              ? <img src={data.avatarUrl} alt={data.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="sf-avatar-initial" style={{ fontFamily: theme.headingFont, fontWeight: 700, color: theme.accent }}>
                    {data.displayName[0]?.toUpperCase() ?? '?'}
                  </span>
                </div>
            }
          </div>
        </div>
        {data.isVerified && (
          <div style={{
            position: 'absolute', bottom: 4, right: 4, width: 24, height: 24, borderRadius: '50%',
            background: `linear-gradient(135deg,${theme.accent},${theme.accent}cc)`,
            border: `2.5px solid ${theme.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        )}
      </div>

      <h1 className="sf-hero-name" style={{ fontFamily: theme.headingFont, fontWeight: 700, color: theme.text, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
        {data.displayName}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: theme.bodyFont, fontSize: '13px', color: `${theme.accent}b0`, fontWeight: 500 }}>@{data.username}</span>
        {categoryLabel && (
          <>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: `${theme.text}30`, display: 'inline-block' }} />
            <span style={{ fontFamily: theme.bodyFont, fontSize: '12px', fontWeight: 600, color: theme.textSub, background: `${theme.text}08`, border: `1px solid ${theme.text}12`, borderRadius: 20, padding: '3px 10px' }}>
              {categoryLabel}
            </span>
          </>
        )}
      </div>

      {data.bio && (
        <p style={{ fontFamily: theme.bodyFont, fontSize: '14px', color: theme.textSub, lineHeight: 1.65, maxWidth: 340, margin: '0 auto 24px' }}>
          {data.bio}
        </p>
      )}

      {(data.credilinkScore > 0 || data.followerCount || data.products.length > 0) && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, borderRadius: 14, overflow: 'hidden', border: `1px solid ${theme.cardBorder}`, background: theme.cardBg, maxWidth: 320, margin: '0 auto 24px' }}>
          {data.followerCount != null && data.followerCount > 0 && <StatCell label="Followers" value={fmtCount(data.followerCount)} theme={theme} />}
          {data.credilinkScore > 0 && <StatCell label="Credilink" value={String(data.credilinkScore)} theme={theme} accent />}
          {data.products.length > 0 && <StatCell label="Products" value={String(data.products.length)} theme={theme} />}
        </div>
      )}

      {data.socialLinks.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          {data.socialLinks.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="sf-social"
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 24, background: `${theme.text}08`, border: `1px solid ${theme.text}12`, textDecoration: 'none', color: theme.textSub, fontFamily: theme.bodyFont, fontSize: '13px', fontWeight: 600 }}>
              <SocialIcon platform={link.platform} />
              <span style={{ textTransform: 'capitalize' }}>{link.platform}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductCard({ product, theme, settings }: { product: Product; theme: ThemeTokens; settings: PageSettings }) {
  const cta = PRODUCT_CTA[product.productType] ?? PRODUCT_CTA.default
  const coverGradient = PRODUCT_COVER_GRADIENTS[product.productType] ?? PRODUCT_COVER_GRADIENTS.default
  return (
    <div className="sf-card" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: theme.cardRadius, overflow: 'hidden' }}>
      {/* Cover */}
      <div className="sf-card-cover" style={{ background: coverGradient, position: 'relative', overflow: 'hidden' }}>
        {product.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.coverImageUrl} alt={product.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top,rgba(0,0,0,0.6),transparent)' }} />
        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(7,7,15,0.8)', backdropFilter: 'blur(12px)', borderRadius: 10, padding: '6px 12px', border: '1px solid rgba(255,255,255,0.12)' }}>
          {product.isFree
            ? <span style={{ fontFamily: theme.bodyFont, fontSize: '13px', fontWeight: 700, color: '#4ade80' }}>FREE</span>
            : <span style={{ fontFamily: theme.headingFont, fontSize: '16px', fontWeight: 700, color: '#f0effe' }}>{fmtPrice(product.priceInr)}</span>
          }
        </div>
        {product.comparePriceInr && product.comparePriceInr > product.priceInr && (
          <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(74,222,128,0.15)', backdropFilter: 'blur(8px)', borderRadius: 6, padding: '4px 8px', border: '1px solid rgba(74,222,128,0.25)' }}>
            <span style={{ fontFamily: theme.bodyFont, fontSize: '11px', fontWeight: 700, color: '#4ade80' }}>
              {Math.round((1 - product.priceInr / product.comparePriceInr) * 100)}% OFF
            </span>
          </div>
        )}
      </div>
      {/* Body */}
      <div style={{ padding: '18px 18px 20px' }}>
        <h3 style={{ fontFamily: theme.headingFont, fontSize: '19px', fontWeight: 700, color: theme.text, margin: '0 0 8px', lineHeight: 1.25 }}>
          {product.title}
        </h3>
        {product.comparePriceInr && product.comparePriceInr > product.priceInr && (
          <p style={{ fontFamily: theme.bodyFont, fontSize: '12px', color: theme.textMuted, margin: '0 0 6px' }}>
            <span style={{ textDecoration: 'line-through' }}>{fmtPrice(product.comparePriceInr)}</span>
            {' '}<span style={{ color: '#4ade80', fontWeight: 600 }}>Save {fmtPrice(product.comparePriceInr - product.priceInr)}</span>
          </p>
        )}
        {product.description && (
          <p style={{ fontFamily: theme.bodyFont, fontSize: '13px', color: theme.textSub, margin: '0 0 18px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>
        )}
        <Link href={`/checkout/${product.id}`} style={getCtaStyle(theme, settings, product.isFree)}>
          {cta}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </Link>
      </div>
    </div>
  )
}

function BlockRenderer({ block, theme, settings, products }: {
  block: StorefrontBlock; theme: ThemeTokens; settings: PageSettings; products: Product[]
}) {
  if (!block.visible) return null
  const c = block.config

  switch (block.type) {
    case 'profile_header':
      return null // rendered in sidebar

    case 'link_button': {
      if (!c.label && !c.url) return null
      const btnStyle: React.CSSProperties =
        settings.buttonStyle === 'outline'
          ? { background: 'transparent', border: `1.5px solid ${theme.accent}`, color: theme.accent }
          : settings.buttonStyle === 'pill'
            ? { background: theme.accent, color: '#fff', borderRadius: 100 }
            : { background: theme.accent, color: '#fff' }
      return (
        <a href={c.url || '#'} target="_blank" rel="noopener noreferrer" className="sf-link-btn"
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 20px', borderRadius: theme.btnRadius, background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, textDecoration: 'none', transition: 'opacity 0.15s, transform 0.15s', ...btnStyle }}>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontFamily: theme.bodyFont, fontSize: '14px', fontWeight: 700, color: 'inherit', marginBottom: c.description ? 2 : 0 }}>{c.label || 'Link'}</span>
            {c.description && <span style={{ display: 'block', fontFamily: theme.bodyFont, fontSize: '12px', color: settings.buttonStyle === 'filled' || settings.buttonStyle === 'pill' ? 'rgba(255,255,255,0.7)' : theme.textSub }}>{c.description}</span>}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      )
    }

    case 'text_block':
      if (!c.content) return null
      return (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: theme.bodyFont, fontSize: '14px', color: theme.textSub, lineHeight: 1.75, margin: 0, textAlign: (c.alignment as React.CSSProperties['textAlign']) || 'left', whiteSpace: 'pre-wrap' }}>
            {c.content}
          </p>
        </div>
      )

    case 'image_block':
      if (!c.url) return null
      return (
        <div className="sf-img-card" style={{ borderRadius: theme.cardRadius, overflow: 'hidden', background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, boxShadow: theme.isDark ? '0 8px 32px rgba(0,0,0,0.45)' : '0 4px 20px rgba(0,0,0,0.1)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
          <div style={{ position: 'relative', width: '100%', height: 260, overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.url} alt={c.alt || c.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          {c.caption && (
            <div style={{ padding: '12px 16px', borderTop: `1px solid ${theme.cardBorder}` }}>
              <p style={{ fontFamily: theme.bodyFont, fontSize: '13px', color: theme.textMuted, textAlign: 'center', margin: 0, lineHeight: 1.5 }}>{c.caption}</p>
            </div>
          )}
        </div>
      )

    case 'social_icons': {
      const platforms = ['instagram', 'youtube', 'twitter', 'linkedin', 'tiktok', 'website', 'whatsapp']
      const links = platforms.filter(p => c[p]).map(p => ({ platform: p, url: c[p] }))
      if (!links.length) return null
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
          {links.map(link => (
            <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 24, background: `${theme.text}08`, border: `1px solid ${theme.text}12`, textDecoration: 'none', color: theme.textSub, fontFamily: theme.bodyFont, fontSize: '13px', fontWeight: 600 }}>
              <SocialIcon platform={link.platform} />
              <span style={{ textTransform: 'capitalize' }}>{link.platform}</span>
            </a>
          ))}
        </div>
      )
    }

    case 'video_embed': {
      if (!c.url) return null
      let embedUrl = c.url
      // Convert YouTube watch URLs to embed
      const ytMatch = c.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
      if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`
      return (
        <div style={{ borderRadius: theme.cardRadius, overflow: 'hidden', marginBottom: 16, background: '#000', border: `1px solid ${theme.cardBorder}` }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
            <iframe src={embedUrl} title={c.caption || 'Video'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} />
          </div>
          {c.caption && <p style={{ fontFamily: theme.bodyFont, fontSize: '12px', color: theme.textMuted, textAlign: 'center', margin: '10px 0', padding: '0 12px' }}>{c.caption}</p>}
        </div>
      )
    }

    case 'testimonial': {
      if (!c.quote) return null
      const stars = Math.min(5, Math.max(1, parseInt(c.rating ?? '5', 10) || 5))
      return (
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: theme.cardRadius, padding: '20px', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
            {Array.from({ length: stars }).map((_, i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={theme.accent} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ))}
          </div>
          <p style={{ fontFamily: theme.bodyFont, fontSize: '14px', color: theme.text, lineHeight: 1.65, margin: '0 0 16px', fontStyle: 'italic' }}>&ldquo;{c.quote}&rdquo;</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${theme.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: theme.headingFont, fontSize: '13px', fontWeight: 700, color: theme.accent }}>{c.author?.[0]?.toUpperCase() ?? '?'}</span>
            </div>
            <div>
              <p style={{ fontFamily: theme.bodyFont, fontSize: '13px', fontWeight: 700, color: theme.text, margin: 0 }}>{c.author || 'Anonymous'}</p>
              {c.role && <p style={{ fontFamily: theme.bodyFont, fontSize: '11px', color: theme.textMuted, margin: 0 }}>{c.role}</p>}
            </div>
          </div>
        </div>
      )
    }

    case 'divider':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 16px' }}>
          <div style={{ flex: 1, height: 1, background: theme.cardBorder }} />
          {c.label && <span style={{ fontFamily: theme.bodyFont, fontSize: '11px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{c.label}</span>}
          <div style={{ flex: 1, height: 1, background: theme.cardBorder }} />
        </div>
      )

    case 'product_card':
    case 'course_block': {
      const product = products.find(p => p.id === c.productId)
      if (!product) return null
      return <div style={{ marginBottom: 14 }}><ProductCard product={product} theme={theme} settings={settings} /></div>
    }

    default:
      return null
  }
}

function ProductGrid({ products, theme, settings }: { products: Product[]; theme: ThemeTokens; settings: PageSettings }) {
  if (products.length === 0) return null
  const isGrid = settings.productLayout === 'grid'
  return (
    <section className="sf-prod-section">
      <p style={{ fontFamily: theme.bodyFont, fontSize: '11px', fontWeight: 700, color: `${theme.accent}99`, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>
        Products &amp; Offerings
      </p>
      <div className={`sf-prod-grid ${isGrid ? 'is-grid' : 'is-list'}`}>
        {products.map(p => <ProductCard key={p.id} product={p} theme={theme} settings={settings} />)}
      </div>
    </section>
  )
}

function CredilinkBadge({ score, isVerified, theme }: { score: number; isVerified: boolean; theme: ThemeTokens }) {
  if (!isVerified && score === 0) return null
  return (
    <div style={{ padding: '0 20px', marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: `${theme.accent}0a`, border: `1px solid ${theme.accent}25`, borderRadius: 16, padding: '14px 16px' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${theme.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: theme.bodyFont, fontSize: '13px', fontWeight: 700, color: theme.text, margin: '0 0 1px' }}>Credilink Verified Creator</p>
          <p style={{ fontFamily: theme.bodyFont, fontSize: '11px', color: theme.textMuted, margin: 0 }}>Identity &amp; performance score verified</p>
        </div>
        {score > 0 && <span style={{ fontFamily: theme.headingFont, fontSize: '20px', fontWeight: 700, color: theme.accent, flexShrink: 0 }}>{score}</span>}
      </div>
    </div>
  )
}

function PoweredByFooter({ theme }: { theme: ThemeTokens }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 20px 40px' }}>
      <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontFamily: theme.bodyFont, fontSize: '11px', color: `${theme.text}30`, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Powered by</span>
        <span style={{ fontFamily: theme.headingFont, fontSize: '13px', fontWeight: 700, color: `${theme.accent}55` }}>Crevo</span>
      </Link>
    </div>
  )
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  const data = await getStorefront(username)
  if (!data) return { title: 'Creator not found' }
  return {
    title:       `${data.displayName} — Crevo`,
    description: data.bio ?? `Check out ${data.displayName}'s products on Crevo`,
    openGraph: {
      title:       `${data.displayName} on Crevo`,
      description: data.bio ?? undefined,
      images:      data.avatarUrl ? [data.avatarUrl] : [],
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
// ─── Block grouping (consecutive images → grid) ──────────────────────────────
type BlockGroup =
  | { kind: 'images'; items: StorefrontBlock[] }
  | { kind: 'single'; item: StorefrontBlock }

function groupContentBlocks(blocks: StorefrontBlock[]): BlockGroup[] {
  const groups: BlockGroup[] = []
  let i = 0
  while (i < blocks.length) {
    if (blocks[i].type === 'image_block') {
      const cluster: StorefrontBlock[] = [blocks[i]]
      while (i + 1 < blocks.length && blocks[i + 1].type === 'image_block') {
        i++
        cluster.push(blocks[i])
      }
      groups.push({ kind: 'images', items: cluster })
    } else {
      groups.push({ kind: 'single', item: blocks[i] })
    }
    i++
  }
  return groups
}

export default async function StorefrontPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const data = await getStorefront(username)
  if (!data) notFound()

  const settings: PageSettings = { ...DEFAULT_SETTINGS, ...data.pageSettings }
  const theme = deriveTheme(settings)
  const showOrbs = settings.bgStyle === 'dark' || settings.bgStyle === 'gradient' || settings.bgStyle === 'deep'

  return (
    <>
      <style>{`
        @keyframes orb-drift {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(30px,-20px) scale(1.05); }
          66%      { transform: translate(-20px,15px) scale(0.97); }
        }
        @keyframes sf-in {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        * { box-sizing: border-box; }

        /* ── Shared ── */
        .sf-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .sf-card:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,0,0,0.35); }
        .sf-img-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.5) !important; }
        .sf-social:hover { opacity: 0.8; }
        .sf-fade { animation: sf-in 0.5s ease both; }
        .sf-link-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── Mobile base ── */
        .sf-avatar-ring  { width: 96px;  height: 96px; }
        .sf-avatar-inner { width: 90px;  height: 90px; }
        .sf-avatar-initial { font-size: 32px; }
        .sf-hero-name    { font-size: 24px; }
        .sf-card-cover   { height: 160px; }

        /* ── Nav ── */
        .sf-nav {
          position: sticky; top: 0; z-index: 20;
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        }
        .sf-nav-inner {
          max-width: 560px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px; height: 56px;
        }

        /* ── Mobile layout ── */
        .sf-layout { max-width: 560px; margin: 0 auto; position: relative; z-index: 1; }
        .sf-prod-section { padding: 8px 20px 0; }
        .sf-main { padding: 16px 20px 48px; }
        .sf-blocks-col { display: flex; flex-direction: column; gap: 12px; }
        .sf-img-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .sf-img-grid-2 .sf-img-card { height: 180px; }
        .sf-img-grid-2 .sf-img-card > div { height: 100% !important; }
        .sf-img-single .sf-img-card { width: 100%; }

        /* ── Product grid ── */
        .sf-prod-grid { display: flex; flex-direction: column; gap: 14px; }
        .sf-prod-grid.is-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        /* ── Sidebar footer hidden on mobile ── */
        .sf-sidebar-footer { display: none; }

        /* ── Tablet (640px+) ── */
        @media (min-width: 640px) {
          .sf-nav-inner { max-width: 700px; }
          .sf-layout    { max-width: 700px; }
          .sf-card-cover { height: 180px; }
        }

        /* ───────────────────────────────────────────────────────────────────────
           DESKTOP (1024px+) — full redesign
           ─────────────────────────────────────────────────────────────────────── */
        @media (min-width: 1024px) {

          /* Nav spans full width, content capped at 1200px */
          .sf-nav-inner { max-width: 1200px; padding: 0 40px; }

          /* Two-col page: narrow sidebar + scrollable content */
          .sf-layout {
            max-width: 1200px;
            display: grid;
            grid-template-columns: 320px 1fr;
            min-height: calc(100vh - 56px);
            gap: 0;
          }

          /* ── Sidebar: sticky, full-height, glass panel ── */
          .sf-sidebar {
            position: sticky;
            top: 56px;
            height: calc(100vh - 56px);
            overflow-y: auto;
            scrollbar-width: none;
            display: flex;
            flex-direction: column;
          }
          .sf-sidebar::-webkit-scrollbar { display: none; }

          /* ── Main area: scrollable, centered content column ── */
          .sf-main {
            overflow-y: auto;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          /* Inner content wrapper — constrained width, nicely padded */
          .sf-blocks-wrapper {
            width: 100%;
            max-width: 680px;
            padding: 40px 32px 64px;
            display: flex;
            flex-direction: column;
            gap: 0;
          }

          .sf-prod-section { padding: 0; }
          .sf-blocks-col { gap: 14px; }

          /* Image grid: 2-col for pairs, square-ish */
          .sf-img-grid-2 { gap: 12px; }
          .sf-img-grid-2 .sf-img-card { height: 220px; }
          .sf-img-single .sf-img-card { height: 340px; }

          /* Product cards */
          .sf-prod-grid.is-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
          .sf-prod-grid.is-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .sf-card-cover { height: 190px; }

          /* Avatar */
          .sf-avatar-ring  { width: 110px; height: 110px; }
          .sf-avatar-inner { width: 104px; height: 104px; }
          .sf-avatar-initial { font-size: 38px; }
          .sf-hero-name { font-size: 28px; }
          .sf-hero { padding: 48px 28px 36px !important; }

          .sf-sidebar-footer { display: block; }
          .sf-main-footer { display: none; }
        }

        /* ── Wide (1280px+) ── */
        @media (min-width: 1280px) {
          .sf-layout { max-width: 1280px; grid-template-columns: 360px 1fr; }
          .sf-nav-inner { max-width: 1280px; }
          .sf-blocks-wrapper { max-width: 740px; padding: 48px 48px 72px; }
          .sf-img-single .sf-img-card { height: 380px; }
          .sf-img-grid-2 .sf-img-card { height: 240px; }
          .sf-prod-grid.is-list { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .sf-card-cover { height: 200px; }
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: theme.bg,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient orbs */}
        {showOrbs && (
          <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle,${theme.accent}28 0%,transparent 70%)`, animation: 'orb-drift 18s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', bottom: '5%', left: '-15%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle,${theme.accent}16 0%,transparent 70%)`, animation: 'orb-drift 24s ease-in-out infinite reverse' }} />
          </div>
        )}

        {/* ── Full-width sticky nav ── */}
        <nav className="sf-nav" style={{ background: theme.navBg, borderBottom: `1px solid ${theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}` }}>
          <div className="sf-nav-inner">
            <Link href="/" style={{ width: 34, height: 34, borderRadius: 10, background: `${theme.text}0a`, border: `1px solid ${theme.text}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: theme.text, flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </Link>
            <span style={{ fontFamily: theme.headingFont, fontSize: '15px', fontWeight: 700, color: theme.text, letterSpacing: '-0.01em' }}>
              {data.displayName || 'Storefront'}
            </span>
            <button style={{ width: 34, height: 34, borderRadius: 10, background: `${theme.text}0a`, border: `1px solid ${theme.text}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme.text, flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          </div>
        </nav>

        {/* ── Two-column layout ── */}
        <div className="sf-layout sf-fade">

          {/* Left: profile sidebar */}
          <aside
            className="sf-sidebar"
            style={{ borderRight: `1px solid ${theme.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}` }}
          >
            <ProfileHero data={data} theme={theme} settings={settings} />
            {data.isVerified && (
              <CredilinkBadge score={data.credilinkScore} isVerified={data.isVerified} theme={theme} />
            )}
            {/* Footer shown only in sidebar on desktop */}
            <div className="sf-sidebar-footer">
              <PoweredByFooter theme={theme} />
            </div>
          </aside>

          {/* Right: blocks (or products fallback) */}
          <main className="sf-main">
            <div className="sf-blocks-wrapper">
              {(() => {
                const contentBlocks = (data.blocks ?? []).filter(b => b.visible && b.type !== 'profile_header')
                if (contentBlocks.length > 0) {
                  const groups = groupContentBlocks(contentBlocks)
                  return (
                    <div className="sf-blocks-col">
                      {groups.map((group, gi) => {
                        if (group.kind === 'images') {
                          if (group.items.length === 1) {
                            return (
                              <div key={group.items[0].id} className="sf-img-single">
                                <BlockRenderer block={group.items[0]} theme={theme} settings={settings} products={data.products} />
                              </div>
                            )
                          }
                          // 2+ images → grid
                          return (
                            <div key={gi} className="sf-img-grid-2">
                              {group.items.map(b => (
                                <BlockRenderer key={b.id} block={b} theme={theme} settings={settings} products={data.products} />
                              ))}
                            </div>
                          )
                        }
                        return <BlockRenderer key={group.item.id} block={group.item} theme={theme} settings={settings} products={data.products} />
                      })}
                    </div>
                  )
                }
                // Fallback: show products if no blocks configured
                return (
                  <>
                    {data.products.length > 0 && (
                      <div style={{ height: 1, background: `linear-gradient(to right,transparent,${theme.cardBorder},transparent)`, marginBottom: 28 }} />
                    )}
                    <ProductGrid products={data.products} theme={theme} settings={settings} />
                  </>
                )
              })()}
              {/* Footer shown in main flow on mobile/tablet */}
              <div className="sf-main-footer" style={{ marginTop: 32 }}>
                <PoweredByFooter theme={theme} />
              </div>
            </div>
          </main>

        </div>
      </div>
    </>
  )
}
