'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { getMyProducts, updateProduct, deleteProduct } from '@/lib/api'

/* ── Icons ───────────────────────────────────────────────────────────────── */
const IBell      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const IPlus      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IStar      = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="#F97316"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const IMore      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
const ITrash     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const IEdit      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>

/* ── Badge colours ───────────────────────────────────────────────────────── */
const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  'PRE-SELL': { bg: 'rgba(249,115,22,0.15)',   color: '#F97316' },
  'COURSE':   { bg: 'rgba(168,164,255,0.15)',  color: '#a8a4ff' },
  'COACHING': { bg: 'rgba(74,222,128,0.12)',   color: '#4ade80' },
  'DIGITAL':  { bg: 'rgba(96,165,250,0.12)',   color: '#60a5fa' },
}

/* ── Product data ────────────────────────────────────────────────────────── */
type TabKey = 'all' | 'published' | 'drafts' | 'archived'

const COVER_GRADIENTS = [
  'linear-gradient(135deg,#7b76e8 0%,#a8a4ff 100%)',
  'linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)',
  'linear-gradient(135deg,#374151 0%,#6b7280 100%)',
  'linear-gradient(135deg,#10b981 0%,#059669 100%)',
  'linear-gradient(135deg,#f97316 0%,#fbbf24 100%)',
]

const TYPE_BADGE: Record<string, string> = {
  digital_download: 'DIGITAL',
  course: 'COURSE',
  session_1on1: 'COACHING',
  membership: 'DIGITAL',
  bundle: 'DIGITAL',
  webinar: 'COURSE',
}

interface ApiProduct {
  id: string
  title: string
  description: string
  productType: string
  priceInr: number
  isPublished: boolean
  files: { id: string }[]
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',       label: 'All'       },
  { key: 'published', label: 'Published' },
  { key: 'drafts',    label: 'Drafts'    },
  { key: 'archived',  label: 'Archived'  },
]

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function ProductsPage() {
  const { getToken } = useAuth()
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getToken().then((token) => {
      if (!token) return
      return getMyProducts(token).then((data) => setProducts((data as ApiProduct[]) ?? []))
    }).catch(console.error).finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = products.filter((p) => {
    if (activeTab === 'all') return true
    if (activeTab === 'published') return p.isPublished
    if (activeTab === 'drafts') return !p.isPublished
    return false
  })

  async function handleTogglePublish(product: ApiProduct) {
    const token = await getToken()
    if (!token) return
    const updated = await updateProduct(token, product.id, { isPublished: !product.isPublished }).catch(console.error)
    if (updated) {
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, isPublished: !p.isPublished } : p))
    }
  }

  async function handleDelete(productId: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return
    const token = await getToken()
    if (!token) return
    await deleteProduct(token, productId).catch(console.error)
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  return (
    <div className="min-h-screen animate-enter" style={{ background: 'var(--surface)' }}>

      {/* Topbar */}
      <div className="flex items-center gap-3 px-6 h-14 sticky top-0 z-10"
        style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(249,245,248,0.06)' }}>
        <div className="flex-1 max-w-xs">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.07)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(249,245,248,0.25)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span className="font-sans text-xs" style={{ color: 'rgba(249,245,248,0.25)' }}>
              Search products...
            </span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ color: 'rgba(249,245,248,0.45)', background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.07)' }}>
            <IBell />
          </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-semibold text-xs"
            style={{ background: 'linear-gradient(135deg,#7b76e8,#a8a4ff)', color: '#0e0e10' }}>
            P
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="px-6 py-6">

        {/* Header row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-sans font-semibold mb-1" style={{ fontSize: '1.5rem', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
              My Products
            </h1>
            <p className="font-sans text-sm" style={{ color: 'rgba(249,245,248,0.4)' }}>
              You have <span style={{ color: 'var(--on-surface)', fontWeight: 600 }}>{products.length} product{products.length !== 1 ? 's' : ''}</span> listed on your store.
            </p>
          </div>
          <Link href="/dashboard/products/add"
            className="flex items-center gap-1.5 font-sans font-semibold text-sm px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--on-surface)', color: '#0e0e10' }}>
            <IPlus /> Add Product
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 mb-6"
          style={{ borderBottom: '1px solid rgba(249,245,248,0.08)' }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="font-sans text-sm pb-3 px-4 transition-colors relative"
              style={{
                color: activeTab === tab.key ? 'var(--on-surface)' : 'rgba(249,245,248,0.35)',
                fontWeight: activeTab === tab.key ? 500 : 400,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: 'var(--primary)' }} />
              )}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
                style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.06)', height: 280 }} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20" style={{ color: 'rgba(249,245,248,0.3)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            <p className="font-sans text-sm">No products yet. Add your first product!</p>
          </div>
        )}

        {/* Product grid */}
        {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {filtered.map((product, idx) => {
            const badge = TYPE_BADGE[product.productType] ?? 'DIGITAL'
            const badgeStyle = BADGE_COLORS[badge] ?? { bg: 'rgba(249,245,248,0.1)', color: 'rgba(249,245,248,0.6)' }
            const isDraft = !product.isPublished
            const gradient = COVER_GRADIENTS[idx % COVER_GRADIENTS.length]

            return (
              <div key={product.id} className="rounded-2xl overflow-hidden flex flex-col card-lift"
                style={{ background: 'var(--surface-low)', border: '1px solid rgba(249,245,248,0.06)' }}>

                {/* Cover */}
                <div className="relative h-44 shrink-0" style={{ background: gradient }}>
                  {/* Badge */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md font-sans text-xs font-semibold uppercase tracking-wider"
                    style={{ background: badgeStyle.bg, color: badgeStyle.color, backdropFilter: 'blur(8px)', letterSpacing: '0.08em', fontSize: '0.65rem' }}>
                    {badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-sans font-semibold text-sm" style={{ color: 'var(--on-surface)', lineHeight: 1.3 }}>
                      {product.title}
                    </h3>
                    <span className="font-sans font-bold text-sm shrink-0" style={{ color: '#4ade80', fontVariantNumeric: 'tabular-nums' }}>
                      ₹{Number(product.priceInr).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="font-sans text-xs mb-4" style={{ color: 'rgba(249,245,248,0.4)' }}>
                    {product.description || '—'}
                  </p>

                  {/* File count */}
                  <p className="font-sans text-xs mb-4" style={{ color: 'rgba(249,245,248,0.35)' }}>
                    {product.files.length} file{product.files.length !== 1 ? 's' : ''} attached
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-3"
                    style={{ borderTop: '1px solid rgba(249,245,248,0.06)' }}>
                    {isDraft ? (
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-xs font-medium" style={{ color: 'rgba(249,245,248,0.35)' }}>
                          DRAFT
                        </span>
                        <Link href={`/dashboard/products/${product.id}`} className="font-sans text-xs" style={{ color: 'var(--primary)' }}>
                          Continue Editing
                        </Link>
                      </div>
                    ) : (
                      <button onClick={() => handleTogglePublish(product)}
                        className="flex items-center gap-2 cursor-pointer" style={{ background: 'none', border: 'none' }}>
                        <div className="w-10 h-5 rounded-full flex items-center px-0.5"
                          style={{ background: '#4ade80' }}>
                          <div className="w-4 h-4 rounded-full ml-auto" style={{ background: '#fff' }} />
                        </div>
                        <span className="font-sans text-xs font-semibold uppercase tracking-widest"
                          style={{ color: '#4ade80', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                          Published
                        </span>
                      </button>
                    )}

                    <div className="flex items-center gap-1">
                      <Link href={`/dashboard/products/${product.id}`}
                        className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                        style={{ color: 'rgba(249,245,248,0.5)' }}>
                        <IEdit />
                      </Link>
                      <button onClick={() => handleDelete(product.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                        style={{ color: 'rgba(249,245,248,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <ITrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        )}
      </div>
    </div>
  )
}
