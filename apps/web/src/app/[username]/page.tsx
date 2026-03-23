import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

interface Product {
  id: string; title: string; slug: string; description: string
  coverImageUrl: string | null; productType: string; priceInr: number
  comparePriceInr: number | null; isFree: boolean; isBestseller?: boolean
}
interface StorefrontData {
  username: string; displayName: string; bio: string | null; avatarUrl: string | null
  category: string; credilinkScore: number; isVerified: boolean; themeId: string
  products: Product[]; socialLinks: { platform: string; url: string }[]
  followerCount?: number; totalSales?: number
}

async function getStorefront(username: string): Promise<StorefrontData | null> {
  try {
    const res = await fetch(`${API_URL}/storefront/${username}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

function getDemoData(username: string): StorefrontData {
  return {
    username, displayName: 'Priya Sharma', category: 'fitness',
    bio: 'Certified Nutritionist & Holistic Strength Coach. Helping you reclaim your health with science-backed sustainable fitness.',
    avatarUrl: null, credilinkScore: 847, isVerified: true, themeId: 'dark',
    followerCount: 1200000, totalSales: 2840,
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com' },
      { platform: 'youtube', url: 'https://youtube.com' },
      { platform: 'whatsapp', url: 'https://wa.me' },
    ],
    products: [
      { id: '1', title: '21-Day Fat Loss Meal Plan', slug: 'fat-loss-meal-plan', description: 'Delicious, Indian-inspired recipes designed to kickstart your metabolism without sacrificing flavor.', coverImageUrl: null, productType: 'digital_download', priceInr: 499, comparePriceInr: null, isFree: false },
      { id: '2', title: 'Fat Loss Course', slug: 'fat-loss-course', description: 'A complete transformation system including workout videos, progress tracking, and 1-on-1 community access.', coverImageUrl: null, productType: 'course', priceInr: 2999, comparePriceInr: null, isFree: false, isBestseller: true },
    ],
  }
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  const data = username === 'testcreator' ? getDemoData(username) : await getStorefront(username)
  if (!data) return { title: 'Creator not found' }
  return { title: `${data.displayName} — Crevo`, description: data.bio ?? undefined }
}

const PRODUCT_CTA: Record<string, string> = {
  course: 'Enroll Now', session_1on1: 'Book Now', community: 'Join Now', default: 'Buy Now'
}

export default async function StorefrontPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const data = username === 'testcreator' ? getDemoData(username) : await getStorefront(username)
  if (!data) notFound()

  const fmtNum = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n)

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', maxWidth: 480, margin: '0 auto', position: 'relative' }}>
      {/* Top nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', position: 'sticky', top: 0, background: 'rgba(14,14,16,0.95)', backdropFilter: 'blur(12px)', zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e3e2e0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </Link>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#e3e2e0' }}>Storefront</span>
        <button style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e3e2e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </button>
      </div>

      {/* Profile section */}
      <div style={{ padding: '28px 20px 20px', textAlign: 'center' }}>
        {/* Avatar */}
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #a8a4ff', boxShadow: '0 0 0 4px rgba(168,164,255,0.15)', position: 'relative' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)" stroke="none"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
          {data.isVerified && (
            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: '50%', background: '#3b82f6', border: '2px solid #0e0e10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="white"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          )}
        </div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 4px' }}>{data.displayName}</h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#a8a4ff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>@{data.username.toUpperCase()}</p>
        {data.bio && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.6)', lineHeight: 1.6, maxWidth: 320, margin: '0 auto 18px' }}>{data.bio}</p>}

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 18 }}>
          {data.followerCount && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>{fmtNum(data.followerCount)}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>FOLLOWERS</p>
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>{data.credilinkScore}</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>CREDILINK SCORE</p>
          </div>
        </div>

        {/* Social icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
          {data.socialLinks.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'rgba(227,226,224,0.6)' }}>
              {link.platform === 'instagram' ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              ) : link.platform === 'youtube' ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              )}
            </a>
          ))}
        </div>

        {/* Credilink verified badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 16px', maxWidth: 320, margin: '0 auto' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(168,164,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Credilink Verified Creator</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.45)', margin: 0 }}>Identity and performance score audited</p>
          </div>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: '#a8a4ff' }}>{data.credilinkScore}</span>
        </div>
      </div>

      {/* Products */}
      <div style={{ padding: '0 20px 80px' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: '#a8a4ff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>EXCLUSIVE PROGRAMS</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {data.products.map(p => {
            const cta = PRODUCT_CTA[p.productType] || PRODUCT_CTA.default
            return (
              <div key={p.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
                {/* Cover */}
                <div style={{ height: 180, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  {/* Price badge */}
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(14,14,16,0.85)', backdropFilter: 'blur(8px)', borderRadius: 10, padding: '5px 10px' }}>
                    <span style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: 700, color: '#e3e2e0' }}>₹{p.priceInr}</span>
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>{p.title}</h3>
                    {p.isBestseller && <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(168,164,255,0.15)', fontFamily: 'DM Sans, sans-serif', fontSize: '9px', fontWeight: 700, color: '#a8a4ff', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>BESTSELLER</span>}
                  </div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.5)', margin: '0 0 16px', lineHeight: 1.6 }}>{p.description}</p>
                  <Link href={`/checkout/${p.id}?product=${p.slug}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '13px', borderRadius: 14, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '15px', boxShadow: '0 6px 20px rgba(108,92,231,0.3)' }}>
                    {cta}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Powered by */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>POWERED BY CREATOROS</p>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: 'rgba(14,14,16,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', zIndex: 50 }}>
        {[
          { label: 'Shop', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>, active: true },
          { label: 'Feed', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
          { label: 'Payments', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
          { label: 'Profile', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
        ].map(item => (
          <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 0', cursor: 'pointer', color: item.active ? '#a8a4ff' : 'rgba(227,226,224,0.35)', borderTop: item.active ? '2px solid #a8a4ff' : '2px solid transparent', marginTop: -1 }}>
            {item.icon}
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
