'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import {
  getProduct,
  updateProduct,
  deleteProduct,
  getUploadUrl,
  finalizeFileUpload,
  deleteProductFile,
} from '@/lib/api'

interface ProductFile {
  id: string
  filename: string
  fileSizeBytes: number
  mimeType: string
  r2Key: string
}

interface Product {
  id: string
  title: string
  description: string
  productType: string
  priceInr: number
  isFree: boolean
  isPublished: boolean
  coverImageUrl: string | null
  files: ProductFile[]
}

interface UploadingFile {
  tempId: string
  filename: string
  size: number
  mimeType: string
  progress: number
  status: 'uploading' | 'error'
  error?: string
}

const MAX_FILE_SIZE = 500 * 1024 * 1024
const MAX_COVER_SIZE = 10 * 1024 * 1024
const ALLOWED_COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / (1024 * 1024)).toFixed(1)} MB`
}

export default function EditProductPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const { getToken } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [isFree, setIsFree] = useState(false)

  const [files, setFiles] = useState<ProductFile[]>([])
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverUploading, setCoverUploading] = useState(false)
  const [coverError, setCoverError] = useState<string | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function tok() {
    const t = await getToken()
    if (!t) throw new Error('Not authenticated')
    return t
  }

  useEffect(() => {
    if (!id) return
    getToken().then(async (t) => {
      if (!t) return
      try {
        const p = await getProduct(t, id) as Product
        setProduct(p)
        setTitle(p.title)
        setDescription(p.description ?? '')
        setPrice(p.priceInr > 0 ? String(Number(p.priceInr)) : '')
        setIsFree(p.isFree)
        setFiles(p.files ?? [])
        if (p.coverImageUrl) setCoverPreview(p.coverImageUrl)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    })
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave() {
    if (!product) return
    setSaving(true); setError(null); setSaved(false)
    try {
      const t = await tok()
      await updateProduct(t, product.id, {
        title: title.trim(),
        description: description.trim(),
        priceInr: isFree ? 0 : parseFloat(price) || 0,
        isFree,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleTogglePublish() {
    if (!product) return
    setSaving(true); setError(null)
    try {
      const t = await tok()
      await updateProduct(t, product.id, { isPublished: !product.isPublished })
      setProduct(p => p ? { ...p, isPublished: !p.isPublished } : p)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!product || !confirm('Delete this product permanently? This cannot be undone.')) return
    try {
      const t = await tok()
      await deleteProduct(t, product.id)
      router.push('/dashboard/products')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!selected.length || !product) return

    for (const file of selected) {
      if (file.size > MAX_FILE_SIZE) {
        setUploading(prev => [...prev, { tempId: `err-${Date.now()}`, filename: file.name, size: file.size, mimeType: file.type, progress: 0, status: 'error', error: 'File too large (max 500 MB)' }])
        continue
      }
      const tempId = `temp-${Date.now()}-${Math.random()}`
      setUploading(prev => [...prev, { tempId, filename: file.name, size: file.size, mimeType: file.type, progress: 0, status: 'uploading' }])

      try {
        const t1 = await tok()
        const { uploadUrl, r2Key } = await getUploadUrl(t1, product.id, file.name, file.type)
        const xhr = new XMLHttpRequest()
        await new Promise<void>((resolve, reject) => {
          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable) {
              setUploading(prev => prev.map(f => f.tempId === tempId ? { ...f, progress: Math.round((evt.loaded / evt.total) * 100) } : f))
            }
          }
          xhr.onload = () => xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`))
          xhr.onerror = () => reject(new Error('Network error'))
          xhr.open('PUT', uploadUrl)
          xhr.setRequestHeader('Content-Type', file.type)
          xhr.send(file)
        })
        const t2 = await tok()
        const saved = await finalizeFileUpload(t2, product.id, { r2Key, filename: file.name, fileSizeBytes: file.size, mimeType: file.type }) as ProductFile
        setFiles(prev => [...prev, saved])
        setUploading(prev => prev.filter(f => f.tempId !== tempId))
      } catch (err: unknown) {
        setUploading(prev => prev.map(f => f.tempId === tempId ? { ...f, status: 'error', error: err instanceof Error ? err.message : 'Upload failed' } : f))
      }
    }
  }, [product, getToken]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDeleteFile(fileId: string) {
    if (!product) return
    try {
      const t = await tok()
      await deleteProductFile(t, product.id, fileId)
    } catch { /* best-effort */ }
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleCoverSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !product) return
    if (!ALLOWED_COVER_TYPES.includes(file.type)) { setCoverError('Only JPG, PNG, WebP or GIF allowed'); return }
    if (file.size > MAX_COVER_SIZE) { setCoverError('Cover must be under 10 MB'); return }

    const localUrl = URL.createObjectURL(file)
    setCoverPreview(localUrl); setCoverError(null); setCoverUploading(true)
    try {
      const t1 = await tok()
      const ext = file.name.split('.').pop() ?? 'jpg'
      const { uploadUrl, publicUrl } = await getUploadUrl(t1, product.id, `cover.${ext}`, file.type, 'cover')
      const res = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
      if (!res.ok) throw new Error(`Cover upload failed: ${res.status}`)
      if (publicUrl) {
        const t2 = await tok()
        await updateProduct(t2, product.id, { coverImageUrl: publicUrl })
      }
    } catch (err: unknown) {
      setCoverError(err instanceof Error ? err.message : 'Cover upload failed')
      URL.revokeObjectURL(localUrl)
      setCoverPreview(product.coverImageUrl)
    } finally {
      setCoverUploading(false)
    }
  }, [product, getToken]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0e0e10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: '#0e0e10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ color: 'rgba(227,226,224,0.5)', fontFamily: 'DM Sans, sans-serif' }}>Product not found.</p>
      <button onClick={() => router.push('/dashboard/products')} style={{ color: '#a8a4ff', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>← Back to Products</button>
    </div>
  )

  const isUploading = uploading.some(f => f.status === 'uploading') || coverUploading

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e10', fontFamily: 'DM Sans, sans-serif' }}>

      <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={handleFileSelect}
        accept=".pdf,.zip,.mp4,.mov,.mp3,.wav,.epub,.docx,.pptx,.xlsx,.csv,.psd,.ai,.sketch,.fig" />
      <input ref={coverInputRef} type="file" style={{ display: 'none' }} accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleCoverSelect} />

      {/* Topbar */}
      <div style={{ height: 52, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0e0e10', position: 'sticky', top: 0, zIndex: 10, gap: 12 }}>
        <button onClick={() => router.push('/dashboard/products')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.5)', fontSize: '13px', padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          <span className="hidden sm:inline">Products</span>
        </button>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#e3e2e0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title || 'Edit Product'}</span>
        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: product?.isPublished ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.08)', color: product?.isPublished ? '#34d399' : 'rgba(227,226,224,0.4)', letterSpacing: '0.04em' }}>
          {product?.isPublished ? 'LIVE' : 'DRAFT'}
        </span>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 20px 100px' }}>

        {error && (
          <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {/* Details */}
        <section style={{ marginBottom: 32 }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#a8a4ff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Product Details</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Product title"
                style={{ width: '100%', padding: '13px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what buyers get..." rows={4}
                style={{ width: '100%', padding: '13px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const, resize: 'none' as const, lineHeight: 1.6 }} />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section style={{ marginBottom: 32 }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#a8a4ff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Pricing</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Sale Price (INR)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '18px', fontWeight: 700, color: 'rgba(227,226,224,0.5)' }}>₹</span>
                <input type="number" min="0" value={isFree ? '0' : price} onChange={e => { setPrice(e.target.value); setIsFree(false) }} placeholder="0"
                  style={{ width: '100%', padding: '13px 14px', paddingLeft: 32, borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#e3e2e0', fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
            </div>
            <div onClick={() => { setIsFree(!isFree); if (!isFree) setPrice('0') }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#e3e2e0', margin: 0 }}>Free product</p>
                <p style={{ fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>Buyers get it at no cost</p>
              </div>
              <div style={{ width: 42, height: 24, borderRadius: 12, background: isFree ? '#a8a4ff' : 'rgba(255,255,255,0.12)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 3, left: isFree ? 20 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Cover image */}
        <section style={{ marginBottom: 32 }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#a8a4ff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Cover Image</p>
          {coverPreview ? (
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', maxWidth: 400 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverPreview} alt="Cover" style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', display: 'block' }} />
              {coverUploading && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,16,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  <span style={{ fontSize: '13px', color: '#a8a4ff', fontWeight: 600 }}>Uploading…</span>
                </div>
              )}
              <button onClick={() => coverInputRef.current?.click()}
                style={{ position: 'absolute', bottom: 10, right: 10, padding: '7px 14px', borderRadius: 10, background: 'rgba(14,14,16,0.85)', border: '1px solid rgba(255,255,255,0.15)', color: '#e3e2e0', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                Change
              </button>
            </div>
          ) : (
            <div onClick={() => coverInputRef.current?.click()}
              style={{ borderRadius: 16, border: '2px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', maxWidth: 400 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(168,164,255,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(227,226,224,0.2)" strokeWidth="1.5" style={{ margin: '0 auto 10px', display: 'block' }}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(227,226,224,0.5)', margin: '0 0 4px' }}>Upload cover image</p>
              <p style={{ fontSize: '12px', color: 'rgba(227,226,224,0.3)', margin: 0 }}>JPG, PNG, WebP · max 10 MB</p>
            </div>
          )}
          {coverError && <p style={{ marginTop: 8, fontSize: '12px', color: '#fca5a5' }}>{coverError}</p>}
        </section>

        {/* Files */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#a8a4ff', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Files ({files.length})</p>
            <button onClick={() => fileInputRef.current?.click()}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: 'rgba(168,164,255,0.1)', border: '1px solid rgba(168,164,255,0.25)', color: '#a8a4ff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add File
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {files.map(f => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(52,211,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#e3e2e0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.filename}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>{formatBytes(Number(f.fileSizeBytes))}</p>
                </div>
                <button onClick={() => handleDeleteFile(f.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.5)', padding: 4, flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
            {uploading.map(f => (
              <div key={f.tempId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: f.status === 'error' ? 'rgba(239,68,68,0.06)' : 'rgba(168,164,255,0.06)', border: `1px solid ${f.status === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(168,164,255,0.15)'}` }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(168,164,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {f.status === 'error'
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    : <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#e3e2e0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.filename}</p>
                  {f.status === 'error'
                    ? <p style={{ fontSize: '11px', color: '#fca5a5', margin: 0 }}>{f.error}</p>
                    : <div style={{ marginTop: 4 }}>
                        <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                          <div style={{ height: '100%', width: `${f.progress}%`, background: '#a8a4ff', borderRadius: 2, transition: 'width 0.3s' }} />
                        </div>
                        <p style={{ fontSize: '11px', color: 'rgba(227,226,224,0.4)', margin: '3px 0 0' }}>{f.progress}%</p>
                      </div>}
                </div>
                {f.status === 'error' && (
                  <button onClick={() => setUploading(prev => prev.filter(u => u.tempId !== f.tempId))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.3)', padding: 4 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
            ))}
            {files.length === 0 && uploading.length === 0 && (
              <p style={{ fontSize: '13px', color: 'rgba(227,226,224,0.3)', textAlign: 'center', padding: '20px 0' }}>No files attached yet.</p>
            )}
          </div>
        </section>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={handleSave} disabled={saving || isUploading || !title.trim()}
            style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'linear-gradient(135deg, #6c5ce7, #a8a4ff)', color: '#fff', fontWeight: 700, fontSize: '15px', border: 'none', cursor: saving || !title.trim() ? 'not-allowed' : 'pointer', opacity: saving || !title.trim() ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 20px rgba(108,92,231,0.3)' }}>
            {saving ? <><svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Saving…</>
              : saved ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> Saved!</>
              : 'Save Changes'}
          </button>
          <button onClick={handleTogglePublish} disabled={saving}
            style={{ width: '100%', padding: '14px', borderRadius: 14, background: product?.isPublished ? 'rgba(239,68,68,0.08)' : 'rgba(52,211,153,0.08)', color: product?.isPublished ? '#fca5a5' : '#34d399', fontWeight: 700, fontSize: '14px', border: `1px solid ${product?.isPublished ? 'rgba(239,68,68,0.2)' : 'rgba(52,211,153,0.2)'}`, cursor: 'pointer' }}>
            {product?.isPublished ? 'Unpublish (move to draft)' : 'Publish to store'}
          </button>
          <button onClick={handleDelete}
            style={{ width: '100%', padding: '13px', borderRadius: 14, background: 'none', color: 'rgba(239,68,68,0.55)', fontWeight: 600, fontSize: '13px', border: '1px solid rgba(239,68,68,0.12)', cursor: 'pointer' }}>
            Delete Product
          </button>
        </div>
      </div>
    </div>
  )
}
