'use client'

import { useState } from 'react'
import Link from 'next/link'

const SETTINGS_SECTIONS = [
  { id: 'profile', label: 'Profile', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id: 'store', label: 'Store', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
  { id: 'payments', label: 'Payments', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id: 'notifications', label: 'Notifications', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  { id: 'integrations', label: 'Integrations', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> },
  { id: 'danger', label: 'Danger Zone', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
]

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{ width: 44, height: 24, borderRadius: 12, background: value ? '#a8a4ff' : 'rgba(255,255,255,0.12)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
    >
      <div style={{ position: 'absolute', top: 3, left: value ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
    </div>
  )
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [name, setName] = useState('Priya Arora')
  const [bio, setBio] = useState('Nutrition coach & certified wellness expert. Helping women break the diet cycle.')
  const [username, setUsername] = useState('priyaarora')
  const [storeName, setStoreName] = useState('Atelier Wellness')
  const [storeTagline, setStoreTagline] = useState('Your journey to vibrant health starts here.')

  const [notiSale, setNotiSale] = useState(true)
  const [notiOrder, setNotiOrder] = useState(true)
  const [notiWA, setNotiWA] = useState(true)
  const [notiMarketing, setNotiMarketing] = useState(false)
  const [notiNewFollower, setNotiNewFollower] = useState(false)
  const [notiAI, setNotiAI] = useState(true)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  return (
    <div style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif', minHeight: '100%' }}>
      {/* Settings tab nav */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 4, height: 52, position: 'sticky', top: 0, background: '#0e0e10', zIndex: 10 }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: 700, color: '#e3e2e0', margin: 0, marginRight: 24, flexShrink: 0 }}>Settings</h1>
        {SETTINGS_SECTIONS.map(s => (
          <button key={s.id} type="button" onClick={() => setActiveSection(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', height: '100%', background: 'none', border: 'none', borderBottom: activeSection === s.id ? '2px solid #a8a4ff' : '2px solid transparent', color: activeSection === s.id ? '#a8a4ff' : s.id === 'danger' ? 'rgba(239,68,68,0.6)' : 'rgba(227,226,224,0.45)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: activeSection === s.id ? 600 : 400, cursor: 'pointer', marginBottom: -1 }}>
            <span style={{ opacity: 0.8 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)' }} />
        </div>
      </div>

      {/* Main content */}
      <main style={{ padding: '36px 48px', maxWidth: 720 }}>
        {/* ---- PROFILE ---- */}
        {activeSection === 'profile' && (
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#e3e2e0', marginBottom: 32 }}>Profile Settings</h2>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, padding: '20px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a87c,#c67b4a)', flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 4px' }}>Profile Photo</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.45)', margin: '0 0 12px' }}>PNG or JPG, min 400x400px recommended</p>
                <button type="button" style={{ padding: '8px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Upload new photo</button>
              </div>
            </div>

            {/* Form fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              {[
                { label: 'Display Name', value: name, setter: setName, placeholder: 'Your name' },
                { label: 'Username', value: username, setter: setUsername, placeholder: 'username', prefix: 'crevo.in/' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: 'rgba(227,226,224,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>{f.label}</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, overflow: 'hidden' }}>
                    {f.prefix && <span style={{ padding: '0 12px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(227,226,224,0.35)', borderRight: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' }}>{f.prefix}</span>}
                    <input value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder} style={{ flex: 1, padding: '12px 14px', background: 'none', border: 'none', outline: 'none', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: 'rgba(227,226,224,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.35)', margin: '6px 0 0', textAlign: 'right' }}>{bio.length}/150</p>
            </div>

            <button type="button" style={{ padding: '13px 28px', borderRadius: 14, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(108,92,231,0.3)' }}>Save Profile Changes</button>
          </div>
        )}

        {/* ---- STORE ---- */}
        {activeSection === 'store' && (
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#e3e2e0', marginBottom: 32 }}>Store Settings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: 'rgba(227,226,224,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Store Name</label>
                <input value={storeName} onChange={e => setStoreName(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: 'rgba(227,226,224,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Store Tagline</label>
                <input value={storeTagline} onChange={e => setStoreTagline(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: 'rgba(227,226,224,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Store Currency</label>
                <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(227,226,224,0.5)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>INR — Indian Rupee (₹)</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.4)" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
            </div>
            <button type="button" style={{ padding: '13px 28px', borderRadius: 14, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(108,92,231,0.3)' }}>Save Store Settings</button>
          </div>
        )}

        {/* ---- PAYMENTS ---- */}
        {activeSection === 'payments' && (
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#e3e2e0', marginBottom: 32 }}>Payment Settings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(30,144,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e90ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 2px' }}>Bank Account</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.5)', margin: 0 }}>SBI ···· 4532 — Verified ✓</p>
                </div>
                <button type="button" style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer' }}>Edit</button>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 24px' }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 4px' }}>Payout Schedule</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.45)', margin: '0 0 14px' }}>Choose when you want Crevo to transfer your earnings.</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Daily', 'Weekly', 'Monthly'].map((opt, i) => (
                    <button key={opt} type="button" style={{ padding: '8px 20px', borderRadius: 10, background: i === 0 ? 'rgba(168,164,255,0.15)' : 'rgba(255,255,255,0.05)', border: i === 0 ? '1px solid rgba(168,164,255,0.3)' : '1px solid rgba(255,255,255,0.1)', color: i === 0 ? '#a8a4ff' : 'rgba(227,226,224,0.5)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: i === 0 ? 700 : 400, cursor: 'pointer' }}>{opt}</button>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 2px' }}>UPI ID</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.5)', margin: 0 }}>priyaarora@okicici</p>
                </div>
                <button type="button" style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer' }}>Update</button>
              </div>
            </div>
          </div>
        )}

        {/* ---- NOTIFICATIONS ---- */}
        {activeSection === 'notifications' && (
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#e3e2e0', marginBottom: 32 }}>Notification Preferences</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { label: 'New sale', desc: 'Notified when a customer purchases your product.', value: notiSale, setter: setNotiSale },
                { label: 'Order updates', desc: 'Delivery status, refund requests, and disputes.', value: notiOrder, setter: setNotiOrder },
                { label: 'WhatsApp activity', desc: 'Bot conversations, new users, and catalog views.', value: notiWA, setter: setNotiWA },
                { label: 'AI coach insights', desc: 'Weekly revenue insights and product recommendations.', value: notiAI, setter: setNotiAI },
                { label: 'New follower', desc: 'When someone starts following your store.', value: notiNewFollower, setter: setNotiNewFollower },
                { label: 'Marketing tips', desc: 'Growth tactics, announcements, and feature releases.', value: notiMarketing, setter: setNotiMarketing },
              ].map(n => (
                <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#e3e2e0', margin: '0 0 2px' }}>{n.label}</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.45)', margin: 0 }}>{n.desc}</p>
                  </div>
                  <Toggle value={n.value} onChange={n.setter} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- INTEGRATIONS ---- */}
        {activeSection === 'integrations' && (
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#e3e2e0', marginBottom: 8 }}>Integrations</h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.45)', marginBottom: 28 }}>Connect tools and access creator features.</p>

            {/* Creator Tools */}
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.35)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 12 }}>CREATOR TOOLS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {[
                { href: '/dashboard/credilink', icon: '📊', name: 'Credilink Score', desc: 'Your creator credibility & trust score', badge: 'Score: 78/100', badgeColor: '#10b981' },
                { href: '/dashboard/media-kit', icon: '🎨', name: 'AI Media Kit', desc: 'Auto-generated sponsorship & brand kit', badge: 'New', badgeColor: '#a8a4ff' },
              ].map(tool => (
                <Link key={tool.href} href={tool.href}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none' }}>
                  <span style={{ fontSize: '24px', flexShrink: 0 }}>{tool.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 2px' }}>{tool.name}</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.45)', margin: 0 }}>{tool.desc}</p>
                  </div>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: tool.badgeColor, background: `${tool.badgeColor}18`, padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>{tool.badge}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.25)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </Link>
              ))}
            </div>

            {/* Third-party integrations */}
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.35)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 12 }}>THIRD-PARTY</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { name: 'Razorpay', desc: 'Payments & payouts', status: 'Connected', statusColor: '#10b981', icon: '💳' },
                { name: 'WhatsApp Business', desc: 'Automated selling & support', status: 'Connected', statusColor: '#10b981', icon: '💬' },
                { name: 'Google Analytics', desc: 'Traffic & conversion tracking', status: 'Not connected', statusColor: 'rgba(227,226,224,0.35)', icon: '📊' },
                { name: 'Mailchimp', desc: 'Email marketing campaigns', status: 'Not connected', statusColor: 'rgba(227,226,224,0.35)', icon: '📧' },
                { name: 'Zapier', desc: 'Connect with 5000+ apps', status: 'Not connected', statusColor: 'rgba(227,226,224,0.35)', icon: '⚡' },
              ].map(intg => (
                <div key={intg.name} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: '24px', flexShrink: 0 }}>{intg.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 2px' }}>{intg.name}</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.45)', margin: 0 }}>{intg.desc}</p>
                  </div>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: intg.statusColor, flexShrink: 0 }}>{intg.status}</span>
                  <button type="button" style={{ padding: '8px 16px', borderRadius: 10, background: intg.status === 'Connected' ? 'rgba(239,68,68,0.08)' : 'rgba(168,164,255,0.1)', border: intg.status === 'Connected' ? '1px solid rgba(239,68,68,0.15)' : '1px solid rgba(168,164,255,0.2)', color: intg.status === 'Connected' ? '#ef4444' : '#a8a4ff', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>{intg.status === 'Connected' ? 'Disconnect' : 'Connect'}</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- DANGER ZONE ---- */}
        {activeSection === 'danger' && (
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>Danger Zone</h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.45)', marginBottom: 32 }}>These actions are permanent and cannot be undone.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 2px' }}>Export all data</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.45)', margin: 0 }}>Download a copy of all your products, orders, and earnings.</p>
                </div>
                <button type="button" style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>Export</button>
              </div>

              <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 2px' }}>Delete Account</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.45)', margin: 0 }}>Permanently delete your account and all associated data.</p>
                </div>
                <button type="button" onClick={() => setShowDeleteModal(true)} style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>Delete Account</button>
              </div>
            </div>

            {/* Delete modal */}
            {showDeleteModal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                <div style={{ background: '#131315', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '32px', width: 420 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 8px' }}>Delete Account?</h3>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(227,226,224,0.55)', margin: '0 0 24px', lineHeight: 1.6 }}>All your products, orders, and earnings data will be permanently deleted. Type your username to confirm.</p>
                  <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder={`Type "${username}" to confirm`} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', marginBottom: 20, boxSizing: 'border-box' }} />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="button" onClick={() => { setShowDeleteModal(false); setDeleteConfirm('') }} style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    <button type="button" disabled={deleteConfirm !== username} style={{ flex: 1, padding: '12px', borderRadius: 12, background: deleteConfirm === username ? '#ef4444' : 'rgba(239,68,68,0.2)', border: 'none', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 700, cursor: deleteConfirm === username ? 'pointer' : 'not-allowed', opacity: deleteConfirm === username ? 1 : 0.5 }}>Permanently Delete</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
