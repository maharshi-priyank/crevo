'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import {
  createProduct,
  updateProduct,
  getUploadUrl,
  finalizeFileUpload,
  deleteProductFile,
} from '@/lib/api'

type ProductType = 'digital_download' | 'course' | 'coaching' | 'community' | 'pre_sell' | 'bundle' | null

interface UploadedFile {
  id: string          // ProductFile DB id (after finalize)
  filename: string
  size: number
  mimeType: string
  r2Key: string
  status: 'uploading' | 'done' | 'error'
  progress: number    // 0-100
  error?: string
}

const PRODUCT_TYPES = [
  { type: 'digital_download' as const, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>, label: 'Digital Download', desc: 'PDFs, templates, presets or assets.', color: '#a8a4ff' },
  { type: 'course' as const, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>, label: 'Course', desc: 'Video modules, quizzes and tracking.', color: '#f472b6' },
  { type: 'coaching' as const, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: 'Coaching', desc: '1:1 or group sessions with booking.', color: '#34d399' },
  { type: 'community' as const, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: 'Community', desc: 'Subscription access to your private group.', color: '#fb923c' },
  { type: 'pre_sell' as const, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/></svg>, label: 'Pre-Sell', desc: 'Collect payments before you launch.', color: '#60a5fa' },
  { type: 'bundle' as const, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>, label: 'Bundle', desc: 'Multiple products in one high-value offer.', color: '#a78bfa' },
]

const STEPS = ['Type', 'Details', 'Price', 'Content', 'Cover', 'Publish']
const MAX_FILE_SIZE = 500 * 1024 * 1024  // 500 MB
const MAX_COVER_SIZE = 10 * 1024 * 1024  // 10 MB
const ALLOWED_COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function AddProductPage() {
  const router = useRouter()
  const { getToken } = useAuth()

  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState<ProductType>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [inclusive, setInclusive] = useState(true)
  const [emi, setEmi] = useState(false)

  // Created after Step 3 → Next
  const [productId, setProductId] = useState<string | null>(null)

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cover image state
  const [coverPreview, setCoverPreview] = useState<string | null>(null)   // local blob URL
  const [coverUploading, setCoverUploading] = useState(false)
  const [coverDone, setCoverDone] = useState(false)
  const [coverError, setCoverError] = useState<string | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  // Global state
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100

  const STEP_TITLES = ['What are you selling?', 'Basic Details', 'Set your price', 'Add content', 'Upload cover art', 'Ready to publish?']
  const STEP_SUBS = [
    'Choose the type that best fits your offering.',
    'Give your product a memorable name.',
    'Price your work. You can change this anytime.',
    'Upload your files, videos, or course modules.',
    'A great cover increases sales by 40%.',
    'Your product will go live on your store.',
  ]

  // ── Helpers ────────────────────────────────────────────────────────────────

  async function token() {
    const t = await getToken()
    if (!t) throw new Error('Not authenticated')
    return t
  }

  // ── Step 3 → 4: Create product in DB ──────────────────────────────────────

  async function handleCreateProduct() {
    if (productId) { setStep(4); return }   // already created (user went back)
    setSaving(true)
    setError(null)
    try {
      const t = await token()
      const priceInr = parseFloat(price) || 0
      const product = await createProduct(t, {
        title: title.trim(),
        productType: selectedType!,
        priceInr,
        description: description.trim() || undefined,
        isFree: priceInr === 0,
      }) as { id: string }
      setProductId(product.id)
      setStep(4)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save product. Try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Step 4: Upload content files ───────────────────────────────────────────

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    e.target.value = ''   // reset so same file can be re-selected
    if (!selected.length || !productId) return

    for (const file of selected) {
      if (file.size > MAX_FILE_SIZE) {
        setUploadedFiles(prev => [...prev, {
          id: '', filename: file.name, size: file.size, mimeType: file.type,
          r2Key: '', status: 'error', progress: 0,
          error: `File too large (max 500 MB)`,
        }])
        continue
      }

      // Add placeholder entry
      const tempId = `temp-${Date.now()}-${Math.random()}`
      setUploadedFiles(prev => [...prev, {
        id: tempId, filename: file.name, size: file.size, mimeType: file.type,
        r2Key: '', status: 'uploading', progress: 0,
      }])

      try {
        // Fresh token before getting upload URL
        const t1 = await token()
        const { uploadUrl, r2Key } = await getUploadUrl(t1, productId, file.name, file.type)

        // PUT directly to R2 (no auth needed — presigned URL)
        const xhr = new XMLHttpRequest()
        await new Promise<void>((resolve, reject) => {
          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable) {
              const pct = Math.round((evt.loaded / evt.total) * 100)
              setUploadedFiles(prev => prev.map(f => f.id === tempId ? { ...f, progress: pct } : f))
            }
          }
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve()
            else reject(new Error(`Upload failed: ${xhr.status}`))
          }
          xhr.onerror = () => reject(new Error('Network error during upload'))
          xhr.open('PUT', uploadUrl)
          xhr.setRequestHeader('Content-Type', file.type)
          xhr.send(file)
        })

        // Fresh token after upload completes (original may have expired for large files)
        const t2 = await token()
        const fileRecord = await finalizeFileUpload(t2, productId, {
          r2Key,
          filename: file.name,
          fileSizeBytes: file.size,
          mimeType: file.type,
        }) as { id: string }

        setUploadedFiles(prev => prev.map(f =>
          f.id === tempId ? { ...f, id: fileRecord.id, r2Key, status: 'done', progress: 100 } : f
        ))
      } catch (err: unknown) {
        setUploadedFiles(prev => prev.map(f =>
          f.id === tempId ? { ...f, status: 'error', error: err instanceof Error ? err.message : 'Upload failed' } : f
        ))
      }
    }
  }, [productId, getToken])

  async function handleRemoveFile(file: UploadedFile) {
    if (!productId || !file.id || file.id.startsWith('temp-')) {
      setUploadedFiles(prev => prev.filter(f => f.id !== file.id))
      return
    }
    try {
      const t = await token()
      await deleteProductFile(t, productId, file.id)
      setUploadedFiles(prev => prev.filter(f => f.id !== file.id))
    } catch {
      // best-effort, still remove from UI
      setUploadedFiles(prev => prev.filter(f => f.id !== file.id))
    }
  }

  // ── Step 5: Upload cover image ─────────────────────────────────────────────

  const handleCoverSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !productId) return

    if (!ALLOWED_COVER_TYPES.includes(file.type)) {
      setCoverError('Only JPG, PNG, WebP, or GIF images are allowed')
      return
    }
    if (file.size > MAX_COVER_SIZE) {
      setCoverError('Cover image must be under 10 MB')
      return
    }

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file)
    setCoverPreview(localUrl)
    setCoverError(null)
    setCoverUploading(true)
    setCoverDone(false)

    try {
      const t1 = await token()
      const ext = file.name.split('.').pop() ?? 'jpg'
      const { uploadUrl, publicUrl } = await getUploadUrl(t1, productId, `cover.${ext}`, file.type, 'cover')

      // PUT to R2 (presigned — no auth header needed)
      const res = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      if (!res.ok) throw new Error(`Cover upload failed: ${res.status}`)

      // Fresh token to save coverImageUrl (original may have expired)
      if (publicUrl) {
        const t2 = await token()
        await updateProduct(t2, productId, { coverImageUrl: publicUrl })
      }

      setCoverDone(true)
    } catch (err: unknown) {
      setCoverError(err instanceof Error ? err.message : 'Cover upload failed')
      URL.revokeObjectURL(localUrl)
      setCoverPreview(null)
    } finally {
      setCoverUploading(false)
    }
  }, [productId, getToken])

  // ── Step 6: Publish / Save draft ───────────────────────────────────────────

  async function handlePublish(publish: boolean) {
    if (!productId) return
    setSaving(true)
    setError(null)
    try {
      const t = await token()
      await updateProduct(t, productId, { isPublished: publish })
      router.push('/dashboard/products')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save. Try again.')
      setSaving(false)
    }
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  function handleNext() {
    setError(null)
    if (step === 3) { handleCreateProduct(); return }
    if (step === STEPS.length) { handlePublish(true); return }
    setStep(s => s + 1)
  }

  function handleBack() {
    setError(null)
    if (step > 1) setStep(s => s - 1)
    else router.push('/dashboard/products')
  }

  const uploading = saving || coverUploading || uploadedFiles.some(f => f.status === 'uploading')
  const canNext =
    step === 1 ? !!selectedType :
    step === 2 ? title.trim().length > 2 :
    step === 3 ? (price === '' || parseFloat(price) >= 0) :
    !uploading

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0e0e10', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        accept=".pdf,.zip,.mp4,.mov,.avi,.mp3,.wav,.epub,.docx,.pptx,.xlsx,.csv,.psd,.ai,.sketch,.fig"
      />
      <input
        ref={coverInputRef}
        type="file"
        style={{ display: 'none' }}
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleCoverSelect}
      />

      {/* Topbar */}
      <div className="flex items-center px-4 sm:px-6 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0e0e10', height: 52 }}>
        <button type="button" onClick={handleBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.5)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          <span className="hidden sm:inline">Products</span>
        </button>
        <span className="mx-3" style={{ color: 'rgba(255,255,255,0.15)', fontSize: '14px' }}>/</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#e3e2e0' }}>New Product</span>
        <div className="ml-auto">
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#a8a4ff' }}>{step}/{STEPS.length}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 overflow-y-auto">

        {/* Step label + heading */}
        <div className="mb-6">
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#a8a4ff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            STEP {String(step).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
          </span>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.6rem, 5vw, 2.8rem)', fontWeight: 700, color: '#e3e2e0', margin: '4px 0 6px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {STEP_TITLES[step - 1]}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(227,226,224,0.5)', margin: 0, lineHeight: 1.6 }}>
            {STEP_SUBS[step - 1]}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 28, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #6c5ce7, #a8a4ff)', borderRadius: 2, transition: 'width 0.4s ease' }} />
          {STEPS.map((_, i) => (
            <div key={i} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: `${(i / (STEPS.length - 1)) * 100}%`, width: 8, height: 8, borderRadius: '50%', background: i < step ? '#a8a4ff' : 'rgba(255,255,255,0.15)', transition: 'background 0.3s', marginLeft: i === 0 ? 0 : i === STEPS.length - 1 ? -8 : -4 }} />
          ))}
        </div>

        {/* Error banner */}
        {error && (
          <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        {/* ── Step 1: Product type ─────────────────────────────────────── */}
        {step === 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4" style={{ maxWidth: 820 }}>
            {PRODUCT_TYPES.map(pt => (
              <button key={pt.type} type="button" onClick={() => setSelectedType(pt.type)}
                className="text-left transition-all"
                style={{ padding: 'clamp(16px, 4vw, 28px) clamp(12px, 3vw, 24px)', borderRadius: 16, border: selectedType === pt.type ? `2px solid ${pt.color}` : '1.5px solid rgba(255,255,255,0.08)', background: selectedType === pt.type ? `${pt.color}18` : 'rgba(255,255,255,0.03)', cursor: 'pointer' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${pt.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, color: pt.color }}>{pt.icon}</div>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(13px, 3vw, 17px)', fontWeight: 700, color: '#e3e2e0', margin: '0 0 4px' }}>{pt.label}</p>
                <p className="hidden sm:block" style={{ fontSize: '12px', color: 'rgba(227,226,224,0.45)', margin: 0, lineHeight: 1.5 }}>{pt.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* ── Step 2: Details ──────────────────────────────────────────── */}
        {step === 2 && (
          <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Product Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. 21-Day Fat Loss Meal Plan" autoFocus
                style={{ width: '100%', padding: '13px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: `1.5px solid ${title.trim().length > 0 ? 'rgba(168,164,255,0.4)' : 'rgba(255,255,255,0.12)'}`, color: '#e3e2e0', fontSize: '16px', outline: 'none', boxSizing: 'border-box' as const }} />
              <p style={{ fontSize: '11px', color: 'rgba(227,226,224,0.3)', marginTop: 6 }}>{title.length}/120 characters</p>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what buyers will get — be specific about outcomes." rows={4}
                style={{ width: '100%', padding: '13px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const, resize: 'none' as const, lineHeight: 1.6 }} />
            </div>
          </div>
        )}

        {/* ── Step 3: Price ────────────────────────────────────────────── */}
        {step === 3 && (
          <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Sale Price (INR)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '18px', fontWeight: 700, color: 'rgba(227,226,224,0.5)' }}>₹</span>
                <input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="0"
                  style={{ width: '100%', padding: '14px 16px', paddingLeft: 32, borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
              {price === '0' || price === '' ? (
                <p style={{ fontSize: '12px', color: '#34d399', marginTop: 6 }}>Free product — buyers get it at no cost</p>
              ) : parseFloat(price) < 49 && price !== '' ? (
                <p style={{ fontSize: '12px', color: '#fb923c', marginTop: 6 }}>Minimum recommended price is ₹49</p>
              ) : null}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Inclusive of GST', sublabel: 'Auto tax breakdown', value: inclusive, set: setInclusive },
                { label: 'Enable EMI', sublabel: 'Affordability for students', value: emi, set: setEmi },
              ].map(t => (
                <div key={t.label} onClick={() => t.set(!t.value)}
                  style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#e3e2e0', margin: 0 }}>{t.label}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>{t.sublabel}</p>
                  </div>
                  <div style={{ width: 42, height: 24, borderRadius: 12, background: t.value ? '#a8a4ff' : 'rgba(255,255,255,0.12)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 3, left: t.value ? 20 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 4: File upload ──────────────────────────────────────── */}
        {step === 4 && (
          <div style={{ maxWidth: 560 }}>
            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#a8a4ff' }}
              onDragLeave={e => { e.currentTarget.style.borderColor = 'rgba(168,164,255,0.3)' }}
              onDrop={async e => {
                e.preventDefault()
                e.currentTarget.style.borderColor = 'rgba(168,164,255,0.3)'
                const dt = e.dataTransfer
                if (dt.files.length) {
                  // Simulate input change
                  const synth = { target: { files: dt.files, value: '' }, currentTarget: {} } as unknown as React.ChangeEvent<HTMLInputElement>
                  await handleFileSelect(synth)
                }
              }}
              style={{ borderRadius: 16, border: '2px dashed rgba(168,164,255,0.3)', background: 'rgba(168,164,255,0.04)', padding: 'clamp(28px,6vw,52px) 24px', textAlign: 'center', cursor: 'pointer', marginBottom: 16, transition: 'border-color 0.2s' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(168,164,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: '#a8a4ff' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 6px' }}>Click or drag & drop files</p>
              <p style={{ fontSize: '13px', color: 'rgba(227,226,224,0.4)', margin: '0 0 18px' }}>PDF, MP4, ZIP, MP3 · up to 500 MB each</p>
              <span style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 10, background: 'rgba(168,164,255,0.12)', border: '1px solid rgba(168,164,255,0.3)', color: '#a8a4ff', fontSize: '14px', fontWeight: 600 }}>Browse Files</span>
            </div>

            {/* Uploaded file list */}
            {uploadedFiles.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {uploadedFiles.map(f => (
                  <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: f.status === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${f.status === 'error' ? 'rgba(239,68,68,0.2)' : f.status === 'done' ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.08)'}` }}>
                    {/* Icon */}
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(168,164,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {f.status === 'done' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : f.status === 'error' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      ) : (
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      )}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#e3e2e0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.filename}</p>
                      {f.status === 'error' ? (
                        <p style={{ fontSize: '11px', color: '#fca5a5', margin: 0 }}>{f.error}</p>
                      ) : f.status === 'uploading' ? (
                        <div style={{ marginTop: 4 }}>
                          <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                            <div style={{ height: '100%', width: `${f.progress}%`, background: '#a8a4ff', borderRadius: 2, transition: 'width 0.3s' }} />
                          </div>
                          <p style={{ fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: '3px 0 0' }}>{f.progress}% · {formatBytes(f.size)}</p>
                        </div>
                      ) : (
                        <p style={{ fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>{formatBytes(f.size)}</p>
                      )}
                    </div>
                    {/* Remove */}
                    <button type="button" onClick={() => handleRemoveFile(f)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.3)', padding: 4, flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadedFiles.length === 0 && (
              <p style={{ fontSize: '12px', color: 'rgba(227,226,224,0.3)', textAlign: 'center', marginTop: 8 }}>
                You can skip this step and add files later from the product editor.
              </p>
            )}
          </div>
        )}

        {/* ── Step 5: Cover art ────────────────────────────────────────── */}
        {step === 5 && (
          <div style={{ maxWidth: 520 }}>
            {coverPreview ? (
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverPreview} alt="Cover preview" style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', display: 'block' }} />
                {coverUploading && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,16,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    <span style={{ fontSize: '13px', color: '#a8a4ff', fontWeight: 600 }}>Uploading…</span>
                  </div>
                )}
                {coverDone && (
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(52,211,153,0.9)', borderRadius: 8, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0e0e10" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#0e0e10' }}>Saved</span>
                  </div>
                )}
                {/* Change button */}
                <button type="button" onClick={() => coverInputRef.current?.click()}
                  style={{ position: 'absolute', bottom: 10, right: 10, padding: '8px 14px', borderRadius: 10, background: 'rgba(14,14,16,0.85)', border: '1px solid rgba(255,255,255,0.15)', color: '#e3e2e0', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  Change cover
                </button>
              </div>
            ) : (
              <div onClick={() => coverInputRef.current?.click()}
                style={{ borderRadius: 16, border: '2px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)', padding: '60px 24px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(168,164,255,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(227,226,224,0.6)', margin: 0 }}>Tap to upload cover image</p>
                <p style={{ fontSize: '12px', color: 'rgba(227,226,224,0.3)', margin: 0 }}>JPG, PNG or WebP · max 10 MB · recommended 1200×800</p>
              </div>
            )}

            {coverError && (
              <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: '13px' }}>
                {coverError}
              </div>
            )}

            <p style={{ fontSize: '12px', color: 'rgba(227,226,224,0.3)', marginTop: 12, textAlign: 'center' }}>
              You can skip this step and add a cover later.
            </p>
          </div>
        )}

        {/* ── Step 6: Publish ──────────────────────────────────────────── */}
        {step === 6 && (
          <div style={{ maxWidth: 480 }}>
            {/* Summary card */}
            <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: '20px', marginBottom: 20 }}>
              {coverPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverPreview} alt="cover" style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', borderRadius: 10, marginBottom: 14 }} />
              )}
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: '#e3e2e0', margin: '0 0 4px' }}>{title}</p>
              <p style={{ fontSize: '13px', color: 'rgba(227,226,224,0.5)', margin: '0 0 14px', textTransform: 'capitalize' }}>{selectedType?.replace(/_/g, ' ')}</p>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                {[
                  { label: 'Price', value: price && parseFloat(price) > 0 ? `₹${parseFloat(price).toLocaleString('en-IN')}` : 'Free' },
                  { label: 'GST', value: inclusive ? 'Inclusive' : 'Exclusive' },
                  { label: 'Files', value: `${uploadedFiles.filter(f => f.status === 'done').length} uploaded` },
                  { label: 'Cover', value: coverDone ? 'Added' : 'None' },
                ].map(s => (
                  <div key={s.label}>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>{s.label}</p>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button type="button" onClick={() => handlePublish(false)} disabled={saving}
                style={{ padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontWeight: 700, fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
                Save as Draft
              </button>
              <button type="button" onClick={() => handlePublish(true)} disabled={saving}
                style={{ padding: '14px', borderRadius: 14, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, boxShadow: '0 6px 20px rgba(108,92,231,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {saving
                  ? <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Saving…</>
                  : 'Publish Now'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav bar (hidden on step 6 since it has its own buttons) */}
      {step !== 6 && (
        <div className="flex items-center justify-between px-4 sm:px-8 py-3 shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
          <button type="button" onClick={handleBack} disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.5)', fontSize: '14px', padding: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            {step > 1 ? 'Back' : 'Exit'}
          </button>
          <button type="button" onClick={handleNext} disabled={!canNext || saving}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 14, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontWeight: 700, fontSize: '15px', border: 'none', cursor: !canNext || saving ? 'not-allowed' : 'pointer', opacity: !canNext || saving ? 0.5 : 1, boxShadow: '0 6px 20px rgba(108,92,231,0.3)' }}>
            {saving
              ? <><svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Saving…</>
              : <>{step === 5 ? 'Next' : 'Next'}<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
            }
          </button>
        </div>
      )}
    </div>
  )
}
