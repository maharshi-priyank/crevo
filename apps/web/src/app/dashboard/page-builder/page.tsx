'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { saveStorefrontBlocks, getMyProfile, updateProfile } from '@/lib/api'

// ─── Core types ───────────────────────────────────────────────────────────────

type BlockType =
  | 'profile_header'
  | 'link_button'
  | 'text_block'
  | 'image_block'
  | 'product_card'
  | 'course_block'
  | 'social_icons'
  | 'video_embed'
  | 'testimonial'
  | 'divider'

type LeftTab = 'blocks' | 'layers' | 'styles' | 'settings'
type DeviceMode = 'mobile' | 'tablet' | 'desktop'

type FieldKind =
  | { kind: 'text';     key: string; label: string; placeholder?: string }
  | { kind: 'textarea'; key: string; label: string; placeholder?: string; rows?: number }
  | { kind: 'select';   key: string; label: string; options: { value: string; label: string }[] }
  | { kind: 'toggle';   key: string; label: string }
  | { kind: 'color';    key: string; label: string }
  | { kind: 'url';      key: string; label: string; placeholder?: string }

interface BlockMeta {
  label: string
  desc: string
  category: 'basic' | 'products' | 'social' | 'media'
  icon: React.ReactNode
  accent: string
  defaultConfig: Record<string, string>
  fields: FieldKind[]
}

interface Block {
  id: string
  type: BlockType
  visible: boolean
  config: Record<string, string>
}

interface Profile {
  displayName: string
  bio: string
  verified: boolean
  avatarUrl: string | null
}

interface PageMeta {
  title: string
  slug: string
  description: string
}

interface PageStyles {
  accent:        string
  bgStyle:       'dark' | 'cream' | 'gradient' | 'pure' | 'deep'
  buttonStyle:   'filled' | 'outline' | 'pill'
  cornerRadius:  'sharp' | 'medium' | 'full'
  fontPair:      'default' | 'mono' | 'humanist' | 'editorial'
  productLayout: 'list' | 'grid'
}

interface ThemePreset {
  id:           string
  name:         string
  description:  string
  accent:       string
  bgStyle:      PageStyles['bgStyle']
  buttonStyle:  PageStyles['buttonStyle']
  cornerRadius: PageStyles['cornerRadius']
  fontPair:     PageStyles['fontPair']
}

// ─── SVG icon helpers ─────────────────────────────────────────────────────────

const Svg = ({ d, ...p }: { d: string; width?: number; height?: number; stroke?: string; fill?: string }) => (
  <svg width={p.width ?? 15} height={p.height ?? 15} viewBox="0 0 24 24" fill={p.fill ?? 'none'}
    stroke={p.stroke ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const Icons = {
  profile:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  link:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  text:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  image:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  product:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  course:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  social:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  video:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  quote:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>,
  divider:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>,
  eye:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  trash:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  up:       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>,
  down:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  drag:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  check:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  plus:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  desktop:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  mobile:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  tablet:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  blocks:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  layers:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  styles:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>,
  settings: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M5.34 5.34L3.93 6.75M21 12h-2M5 12H3M19.07 19.07l-1.41-1.41M5.34 18.66l-1.41 1.41M12 21v-2M12 5V3"/></svg>,
  moon:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  sun:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  globe:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  palette:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
list:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  grid:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
}

// ─── Block registry (single source of truth) ──────────────────────────────────

const BLOCK_REGISTRY: Record<BlockType, BlockMeta> = {
  profile_header: {
    label: 'Profile Header', desc: 'Name & bio', category: 'basic', icon: Icons.profile, accent: '#a8a4ff',
    defaultConfig: { displayName: '', bio: '', verified: 'false', avatarStyle: 'gradient' },
    fields: [
      { kind: 'text',   key: 'displayName', label: 'Display Name', placeholder: 'Your name' },
      { kind: 'textarea', key: 'bio', label: 'Biography', placeholder: 'Tell your story...', rows: 3 },
      { kind: 'toggle', key: 'verified', label: 'Verified Badge' },
      { kind: 'select', key: 'avatarStyle', label: 'Avatar Style', options: [{ value: 'gradient', label: 'Gradient' }, { value: 'image', label: 'Upload Image' }, { value: 'initials', label: 'Initials' }] },
    ],
  },
  link_button: {
    label: 'Link Button', desc: 'Link or button', category: 'basic', icon: Icons.link, accent: '#60a5fa',
    defaultConfig: { label: 'Visit my website', url: 'https://', style: 'filled', emoji: '' },
    fields: [
      { kind: 'text',   key: 'label', label: 'Label', placeholder: 'Visit my website' },
      { kind: 'url',    key: 'url', label: 'URL', placeholder: 'https://example.com' },
      { kind: 'text',   key: 'emoji', label: 'Emoji (optional)', placeholder: '🚀' },
      { kind: 'select', key: 'style', label: 'Button Style', options: [{ value: 'filled', label: 'Filled' }, { value: 'outline', label: 'Outline' }, { value: 'ghost', label: 'Ghost' }, { value: 'pill', label: 'Pill Gradient' }] },
    ],
  },
  text_block: {
    label: 'Text', desc: 'Heading or text', category: 'basic', icon: Icons.text, accent: '#e3e2e0',
    defaultConfig: { content: 'Your message here', size: 'md', align: 'center', weight: 'regular' },
    fields: [
      { kind: 'textarea', key: 'content', label: 'Content', placeholder: 'Type something...', rows: 3 },
      { kind: 'select', key: 'size', label: 'Size', options: [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }, { value: 'xl', label: 'Headline' }] },
      { kind: 'select', key: 'align', label: 'Alignment', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
      { kind: 'select', key: 'weight', label: 'Weight', options: [{ value: 'regular', label: 'Regular' }, { value: 'semibold', label: 'Semibold' }, { value: 'bold', label: 'Bold' }] },
    ],
  },
  image_block: {
    label: 'Image', desc: 'Photo', category: 'basic', icon: Icons.image, accent: '#34d399',
    defaultConfig: { url: '', alt: '', caption: '', borderRadius: 'medium' },
    fields: [
      { kind: 'url',    key: 'url', label: 'Image URL', placeholder: 'https://...' },
      { kind: 'text',  key: 'alt', label: 'Alt text', placeholder: 'Describe the image' },
      { kind: 'text',  key: 'caption', label: 'Caption (optional)', placeholder: 'Photo by...' },
      { kind: 'select', key: 'borderRadius', label: 'Corners', options: [{ value: 'none', label: 'Sharp' }, { value: 'medium', label: 'Rounded' }, { value: 'full', label: 'Circle' }] },
    ],
  },
  product_card: {
    label: 'Product Card', desc: 'Product card', category: 'products', icon: Icons.product, accent: '#f97316',
    defaultConfig: { title: 'Fat Loss Blueprint', description: '12-week intensive transformation guide', price: '₹1,499', ctaLabel: 'Buy Now', imageGradient: 'linear-gradient(135deg,#f97316,#fbbf24)' },
    fields: [
      { kind: 'text',    key: 'title', label: 'Product Title', placeholder: 'Product name' },
      { kind: 'textarea', key: 'description', label: 'Description', placeholder: 'Short tagline' },
      { kind: 'text',    key: 'price', label: 'Price', placeholder: '₹999' },
      { kind: 'text',    key: 'ctaLabel', label: 'Button Label', placeholder: 'Buy Now' },
    ],
  },
  course_block: {
    label: 'Course Block', desc: 'Course card', category: 'products', icon: Icons.course, accent: '#a8a4ff',
    defaultConfig: { title: '21-Day Meal Plan', modules: '7', duration: '3 weeks', price: '₹29', ctaLabel: 'Enroll Now' },
    fields: [
      { kind: 'text', key: 'title', label: 'Course Title', placeholder: '21-Day Meal Plan' },
      { kind: 'text', key: 'modules', label: 'Modules', placeholder: '12' },
      { kind: 'text', key: 'duration', label: 'Duration', placeholder: '4 weeks' },
      { kind: 'text', key: 'price', label: 'Price', placeholder: '₹999' },
      { kind: 'text', key: 'ctaLabel', label: 'Button Label', placeholder: 'Enroll Now' },
    ],
  },
  social_icons: {
    label: 'Social Icons', desc: 'Social links', category: 'social', icon: Icons.social, accent: '#f472b6',
    defaultConfig: { instagram: '', youtube: '', twitter: '', website: '', whatsapp: '' },
    fields: [
      { kind: 'url', key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
      { kind: 'url', key: 'youtube',   label: 'YouTube',   placeholder: 'https://youtube.com/...' },
      { kind: 'url', key: 'twitter',   label: 'Twitter / X', placeholder: 'https://x.com/...' },
      { kind: 'url', key: 'website',   label: 'Website', placeholder: 'https://...' },
      { kind: 'url', key: 'whatsapp',  label: 'WhatsApp', placeholder: '+91 98765 43210' },
    ],
  },
  video_embed: {
    label: 'Video Embed', desc: 'YouTube / Vimeo', category: 'media', icon: Icons.video, accent: '#ef4444',
    defaultConfig: { url: '', caption: '', autoplay: 'false' },
    fields: [
      { kind: 'url',  key: 'url', label: 'Video URL', placeholder: 'https://youtube.com/watch?v=...' },
      { kind: 'text', key: 'caption', label: 'Caption', placeholder: 'Watch my latest video' },
      { kind: 'toggle', key: 'autoplay', label: 'Autoplay' },
    ],
  },
  testimonial: {
    label: 'Testimonial', desc: 'Review quote', category: 'media', icon: Icons.quote, accent: '#fbbf24',
    defaultConfig: { quote: 'This changed everything for me!', author: 'Rohan K.', role: 'Student', rating: '5' },
    fields: [
      { kind: 'textarea', key: 'quote', label: 'Quote', placeholder: 'What they said...', rows: 3 },
      { kind: 'text', key: 'author', label: 'Author Name', placeholder: 'Rohan K.' },
      { kind: 'text', key: 'role',   label: 'Role', placeholder: 'Student' },
      { kind: 'select', key: 'rating', label: 'Star Rating', options: ['5','4','3','2','1'].map(v => ({ value: v, label: `${'★'.repeat(+v)} (${v}/5)` })) },
    ],
  },
  divider: {
    label: 'Divider', desc: 'Separator', category: 'basic', icon: Icons.divider, accent: 'rgba(227,226,224,0.4)',
    defaultConfig: { style: 'line', spacing: 'md' },
    fields: [
      { kind: 'select', key: 'style', label: 'Style', options: [{ value: 'line', label: '— Line' }, { value: 'dots', label: '• • • Dots' }, { value: 'wave', label: '∿ Wave' }, { value: 'gap', label: 'Gap only' }] },
      { kind: 'select', key: 'spacing', label: 'Spacing', options: [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }] },
    ],
  },
}

const BLOCK_CATEGORIES: { id: string; label: string }[] = [
  { id: 'basic',    label: 'Content' },
  { id: 'products', label: 'Store' },
  { id: 'social',   label: 'Social' },
  { id: 'media',    label: 'Media' },
]

const ACCENT_COLORS = [
  '#a8a4ff', '#60a5fa', '#34d399', '#fbbf24',
  '#f97316', '#f472b6', '#ef4444', '#22d3ee',
  '#e3e2e0', '#10b981', '#c084fc', '#fb923c',
]

const THEME_PRESETS: ThemePreset[] = [
  { id: 'midnight', name: 'Midnight',  description: 'Classic dark & purple',   accent: '#a8a4ff', bgStyle: 'dark',     buttonStyle: 'filled',  cornerRadius: 'medium', fontPair: 'default'   },
  { id: 'aurora',   name: 'Aurora',    description: 'Dark with green glow',    accent: '#34d399', bgStyle: 'gradient', buttonStyle: 'pill',    cornerRadius: 'full',   fontPair: 'default'   },
  { id: 'ocean',    name: 'Ocean',     description: 'Deep blue on dark',       accent: '#60a5fa', bgStyle: 'dark',     buttonStyle: 'filled',  cornerRadius: 'medium', fontPair: 'humanist'  },
  { id: 'sunset',   name: 'Sunset',    description: 'Warm orange tones',       accent: '#f97316', bgStyle: 'deep',     buttonStyle: 'pill',    cornerRadius: 'full',   fontPair: 'default'   },
  { id: 'rose',     name: 'Rose',      description: 'Pink on dark',            accent: '#f472b6', bgStyle: 'dark',     buttonStyle: 'pill',    cornerRadius: 'full',   fontPair: 'default'   },
  { id: 'forest',   name: 'Forest',    description: 'Natural emerald green',   accent: '#10b981', bgStyle: 'dark',     buttonStyle: 'filled',  cornerRadius: 'medium', fontPair: 'default'   },
  { id: 'gold',     name: 'Gold',      description: 'Premium warm & minimal',  accent: '#fbbf24', bgStyle: 'dark',     buttonStyle: 'outline', cornerRadius: 'sharp',  fontPair: 'mono'      },
  { id: 'neon',     name: 'Neon',      description: 'Vibrant cyan pop',        accent: '#22d3ee', bgStyle: 'deep',     buttonStyle: 'pill',    cornerRadius: 'full',   fontPair: 'mono'      },
  { id: 'cream',    name: 'Cream',     description: 'Warm light background',   accent: '#6c5ce7', bgStyle: 'cream',    buttonStyle: 'filled',  cornerRadius: 'medium', fontPair: 'default'   },
  { id: 'pure',     name: 'Pure',      description: 'Clean minimal white',     accent: '#1a1a2e', bgStyle: 'pure',     buttonStyle: 'outline', cornerRadius: 'sharp',  fontPair: 'editorial' },
]

const BG_PREVIEW: Record<PageStyles['bgStyle'], { label: string; swatch: string }> = {
  dark:     { label: 'Dark',     swatch: '#07070f' },
  gradient: { label: 'Gradient', swatch: 'linear-gradient(135deg,#07070f,#1a0a2e)' },
  cream:    { label: 'Cream',    swatch: '#f5f0e8' },
  pure:     { label: 'Pure',     swatch: '#fafafa' },
  deep:     { label: 'Deep',     swatch: '#020209' },
}

// ─── Utility functions ────────────────────────────────────────────────────────

function makeId(type: BlockType) { return `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` }

function moveBlock(blocks: Block[], id: string, dir: -1 | 1): Block[] {
  const idx = blocks.findIndex(b => b.id === id)
  if (idx < 0) return blocks
  const next = idx + dir
  if (next < 0 || next >= blocks.length) return blocks
  const arr = [...blocks]
  ;[arr[idx], arr[next]] = [arr[next], arr[idx]]
  return arr
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function PanelLabel({ children }: { children: string }) {
  return <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.38)', textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 10px' }}>{children}</p>
}

function FieldInput({ field, value, onChange }: { field: FieldKind; value: string; onChange: (v: string) => void }) {
  const base: React.CSSProperties = { width: '100%', padding: '9px 11px', borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }
  if (field.kind === 'toggle') {
    const on = value === 'true'
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.7)' }}>{field.label}</span>
        <div onClick={() => onChange(on ? 'false' : 'true')} style={{ width: 36, height: 20, borderRadius: 10, background: on ? '#a8a4ff' : 'rgba(255,255,255,0.12)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 2, left: on ? 17 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
        </div>
      </div>
    )
  }
  if (field.kind === 'select') {
    return (
      <select value={value} onChange={e => onChange(e.target.value)} style={{ ...base, appearance: 'none', cursor: 'pointer' }}>
        {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    )
  }
  if (field.kind === 'textarea') {
    return <textarea value={value} onChange={e => onChange(e.target.value)} rows={field.rows ?? 3} placeholder={'placeholder' in field ? field.placeholder : ''} style={{ ...base, resize: 'none', lineHeight: 1.5 }} />
  }
  if (field.kind === 'color') {
    return (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {ACCENT_COLORS.map(c => (
          <div key={c} onClick={() => onChange(c)} style={{ width: 24, height: 24, borderRadius: '50%', background: c, cursor: 'pointer', border: value === c ? '2px solid white' : '2px solid transparent', outline: value === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }} />
        ))}
      </div>
    )
  }
  return <input type={field.kind === 'url' ? 'url' : 'text'} value={value} onChange={e => onChange(e.target.value)} placeholder={'placeholder' in field ? field.placeholder : ''} style={base} />
}

// ─── Preview renderers (per block type) ──────────────────────────────────────

function PreviewBlock({ block, theme, selected, onClick }: { block: Block; theme: 'light' | 'dark'; selected: boolean; onClick: () => void }) {
  const c = block.config
  const isLight = theme === 'light'
  const text = isLight ? '#0e0e10' : '#e3e2e0'
  const sub = isLight ? 'rgba(0,0,0,0.45)' : 'rgba(227,226,224,0.45)'
  const cardBg = isLight ? '#fff' : '#1e1e2e'
  const selectedBorder = selected ? '1.5px solid #a8a4ff' : '1.5px solid transparent'

  const wrap: React.CSSProperties = { cursor: 'pointer', borderRadius: 10, border: selectedBorder, transition: 'border 0.12s', marginBottom: 6, overflow: 'hidden' }
  const onClick_ = (e: React.MouseEvent) => { e.stopPropagation(); onClick() }

  if (!block.visible) return (
    <div onClick={onClick_} style={{ ...wrap, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 6, opacity: 0.4 }}>
      <span style={{ fontSize: '11px', color: sub }}>{Icons.eyeOff}</span>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: sub }}>{BLOCK_REGISTRY[block.type].label} (hidden)</span>
    </div>
  )

  switch (block.type) {
    case 'profile_header': return (
      <div onClick={onClick_} style={{ ...wrap, background: cardBg, padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#a8a4ff,#6c5ce7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '20px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, color: '#fff' }}>{(c.displayName || 'P')[0]}</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '14px', fontWeight: 700, color: text, margin: '0 0 3px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            {c.displayName || 'Your Name'}
            {c.verified === 'true' && <span style={{ color: '#a8a4ff', fontSize: '10px' }}>✓</span>}
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: sub, margin: 0, lineHeight: 1.4 }}>{c.bio || 'Your bio here'}</p>
        </div>
      </div>
    )
    case 'link_button': {
      const styles: Record<string, React.CSSProperties> = {
        filled:  { background: '#a8a4ff', color: '#0e0e10', border: 'none' },
        outline: { background: 'transparent', color: text, border: `1px solid ${isLight ? '#0e0e10' : '#e3e2e0'}` },
        ghost:   { background: 'rgba(168,164,255,0.1)', color: '#a8a4ff', border: 'none' },
        pill:    { background: 'linear-gradient(135deg,#6c5ce7,#a8a4ff)', color: '#fff', border: 'none', borderRadius: 100 },
      }
      const btnStyle = styles[c.style ?? 'filled']
      return (
        <div onClick={onClick_} style={{ ...wrap, padding: '6px 8px', background: 'transparent' }}>
          <div style={{ padding: '10px 14px', borderRadius: 10, textAlign: 'center', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, ...btnStyle }}>
            {c.emoji && <span style={{ marginRight: 6 }}>{c.emoji}</span>}{c.label || 'Button Text'}
          </div>
        </div>
      )
    }
    case 'text_block': {
      const sizes: Record<string, number> = { sm: 10, md: 12, lg: 15, xl: 20 }
      return (
        <div onClick={onClick_} style={{ ...wrap, padding: '8px 10px', background: 'transparent' }}>
          <p style={{ fontFamily: c.size === 'xl' ? 'Fraunces, serif' : 'DM Sans, sans-serif', fontSize: sizes[c.size ?? 'md'], fontWeight: c.weight === 'bold' ? 700 : c.weight === 'semibold' ? 600 : 400, color: text, textAlign: (c.align as 'left' | 'center' | 'right') ?? 'center', margin: 0, lineHeight: 1.5 }}>
            {c.content || 'Your text here'}
          </p>
        </div>
      )
    }
    case 'image_block': return (
      <div onClick={onClick_} style={{ ...wrap, background: 'transparent' }}>
        {c.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.url} alt={c.alt} style={{ width: '100%', borderRadius: c.borderRadius === 'full' ? '50%' : c.borderRadius === 'medium' ? 10 : 0, display: 'block' }} />
        ) : (
          <div style={{ height: 80, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
            <span style={{ color: 'rgba(227,226,224,0.25)', fontSize: '20px' }}>{Icons.image}</span>
          </div>
        )}
        {c.caption && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', color: sub, textAlign: 'center', margin: '4px 0 0' }}>{c.caption}</p>}
      </div>
    )
    case 'product_card': return (
      <div onClick={onClick_} style={{ ...wrap, background: cardBg, overflow: 'hidden' }}>
        <div style={{ height: 48, background: c.imageGradient || 'linear-gradient(135deg,#f97316,#fbbf24)' }} />
        <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: text, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title || 'Product Name'}</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', color: sub, margin: 0 }}>{c.description || 'Short description'}</p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <div style={{ padding: '5px 10px', borderRadius: 8, background: '#a8a4ff', textAlign: 'center' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: '#0e0e10' }}>{c.price || '₹999'}</span>
            </div>
          </div>
        </div>
      </div>
    )
    case 'course_block': return (
      <div onClick={onClick_} style={{ ...wrap, background: cardBg, padding: '12px' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: text, margin: '0 0 6px' }}>{c.title || 'Course Title'}</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          {[`${c.modules || '?'} modules`, c.duration || '4 weeks'].map(t => (
            <span key={t} style={{ padding: '2px 7px', borderRadius: 5, background: 'rgba(168,164,255,0.12)', fontFamily: 'DM Sans, sans-serif', fontSize: '9px', color: '#a8a4ff', fontWeight: 600 }}>{t}</span>
          ))}
        </div>
        <div style={{ padding: '6px 12px', borderRadius: 8, background: '#a8a4ff', textAlign: 'center' }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: '#0e0e10' }}>{c.ctaLabel || 'Enroll'} · {c.price || '₹999'}</span>
        </div>
      </div>
    )
    case 'social_icons': {
      const SOCIAL_SVGS: Record<string, React.ReactNode> = {
        instagram: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
        youtube:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>,
        twitter:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
        website:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
        whatsapp:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
      }
      const platforms = ['instagram', 'youtube', 'twitter', 'website', 'whatsapp'].filter(k => c[k])
      return (
        <div onClick={onClick_} style={{ ...wrap, background: 'transparent', padding: '8px 10px' }}>
          {platforms.length > 0 ? (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {platforms.map(key => (
                <div key={key} style={{ width: 32, height: 32, borderRadius: 10, background: isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: sub }}>{SOCIAL_SVGS[key]}</div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
              {['instagram', 'youtube', 'website'].map(key => (
                <div key={key} style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: sub, opacity: 0.4 }}>{SOCIAL_SVGS[key]}</div>
              ))}
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', color: sub }}>Add links</span>
            </div>
          )}
        </div>
      )
    }
    case 'video_embed': return (
      <div onClick={onClick_} style={{ ...wrap, background: '#000', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#111"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
        {c.caption && <p style={{ position: 'absolute', bottom: 4, left: 8, fontFamily: 'DM Sans, sans-serif', fontSize: '8px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{c.caption}</p>}
      </div>
    )
    case 'testimonial': return (
      <div onClick={onClick_} style={{ ...wrap, background: cardBg, padding: '12px' }}>
        <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
          {Array.from({ length: Math.min(5, +(c.rating ?? '5')) }).map((_, i) => <span key={i} style={{ fontSize: '9px', color: '#fbbf24' }}>★</span>)}
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontStyle: 'italic', color: text, margin: '0 0 8px', lineHeight: 1.5 }}>&ldquo;{c.quote || 'Amazing testimonial...'}&rdquo;</p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', fontWeight: 700, color: sub, margin: 0 }}>— {c.author || 'Author'}{c.role && `, ${c.role}`}</p>
      </div>
    )
    case 'divider': {
      const spacingMap: Record<string, number> = { sm: 8, md: 16, lg: 24 }
      const v = spacingMap[c.spacing ?? 'md']
      return (
        <div onClick={onClick_} style={{ ...wrap, padding: `${v}px 8px`, background: 'transparent' }}>
          {c.style === 'dots' ? <div style={{ textAlign: 'center', color: sub, letterSpacing: 6, fontSize: '8px' }}>• • • • •</div>
           : c.style === 'wave' ? <div style={{ textAlign: 'center', color: sub, fontSize: '12px', opacity: 0.5 }}>〰〰〰〰</div>
           : c.style === 'gap'  ? <div style={{ height: 4 }} />
           : <div style={{ height: 1, background: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.1)', borderRadius: 1 }} />}
        </div>
      )
    }
    default: return null
  }
}

// ─── Panel: Blocks ────────────────────────────────────────────────────────────

function BlocksPanel({ onAdd }: { onAdd: (type: BlockType) => void }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
      {BLOCK_CATEGORIES.map(cat => {
        const items = Object.entries(BLOCK_REGISTRY).filter(([, m]) => m.category === cat.id) as [BlockType, BlockMeta][]
        if (!items.length) return null
        return (
          <div key={cat.id} style={{ marginBottom: 20 }}>
            <PanelLabel>{cat.label}</PanelLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {items.map(([type, meta]) => (
                <button key={type} type="button" onClick={() => onAdd(type)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 8px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center' }}
                  onMouseEnter={e => { (e.currentTarget.style.background = 'rgba(168,164,255,0.07)'); (e.currentTarget.style.borderColor = 'rgba(168,164,255,0.2)') }}
                  onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(255,255,255,0.03)'); (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)') }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: `${meta.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.accent }}>
                    {meta.icon}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, color: '#e3e2e0', margin: '0 0 1px' }}>{meta.label}</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', color: 'rgba(227,226,224,0.28)', margin: 0 }}>{meta.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Panel: Layers ────────────────────────────────────────────────────────────

function LayersPanel({ blocks, selectedId, onSelect, onToggle, onMove, onRemove }: {
  blocks: Block[]
  selectedId: string | null
  onSelect: (id: string) => void
  onToggle: (id: string) => void
  onMove:   (id: string, dir: -1 | 1) => void
  onRemove: (id: string) => void
}) {
  if (!blocks.length) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(227,226,224,0.3)' }}>{Icons.layers}</div>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.35)', textAlign: 'center', margin: 0 }}>No blocks yet.<br/>Use the Add tab to get started.</p>
    </div>
  )
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
      <PanelLabel>{`${blocks.length} block${blocks.length !== 1 ? 's' : ''}`}</PanelLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {blocks.map((block, i) => {
          const meta = BLOCK_REGISTRY[block.type]
          const isSelected = selectedId === block.id
          return (
            <div key={block.id}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', borderRadius: 10, background: isSelected ? 'rgba(168,164,255,0.1)' : 'rgba(255,255,255,0.03)', border: isSelected ? '1px solid rgba(168,164,255,0.3)' : '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', opacity: block.visible ? 1 : 0.45, transition: 'all 0.12s' }}
              onClick={() => onSelect(block.id)}
            >
              {/* Drag handle */}
              <span style={{ color: 'rgba(227,226,224,0.2)', flexShrink: 0 }}>{Icons.drag}</span>
              {/* Icon + label */}
              <span style={{ color: meta.accent, flexShrink: 0 }}>{meta.icon}</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, color: isSelected ? '#a8a4ff' : '#e3e2e0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{meta.label}</span>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 2, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                <button type="button" onClick={() => onMove(block.id, -1)} disabled={i === 0} title="Move up" style={{ width: 20, height: 20, borderRadius: 5, background: 'none', border: 'none', cursor: i === 0 ? 'default' : 'pointer', color: i === 0 ? 'rgba(227,226,224,0.15)' : 'rgba(227,226,224,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icons.up}</button>
                <button type="button" onClick={() => onMove(block.id, 1)} disabled={i === blocks.length - 1} title="Move down" style={{ width: 20, height: 20, borderRadius: 5, background: 'none', border: 'none', cursor: i === blocks.length - 1 ? 'default' : 'pointer', color: i === blocks.length - 1 ? 'rgba(227,226,224,0.15)' : 'rgba(227,226,224,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icons.down}</button>
                <button type="button" onClick={() => onToggle(block.id)} title={block.visible ? 'Hide' : 'Show'} style={{ width: 20, height: 20, borderRadius: 5, background: 'none', border: 'none', cursor: 'pointer', color: block.visible ? 'rgba(227,226,224,0.4)' : '#a8a4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {block.visible ? Icons.eye : Icons.eyeOff}
                </button>
                <button type="button" onClick={() => onRemove(block.id)} title="Remove" style={{ width: 20, height: 20, borderRadius: 5, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icons.trash}</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Panel: Styles ────────────────────────────────────────────────────────────

function StylesPanel({ styles, onChange }: { styles: PageStyles; onChange: (s: Partial<PageStyles>) => void }) {
  const row = (label: string, children: React.ReactNode) => (
    <div style={{ marginBottom: 18 }}>
      <PanelLabel>{label}</PanelLabel>
      {children}
    </div>
  )

  const optBtn = (active: boolean, label: React.ReactNode, onClick: () => void, tip?: string) => (
    <button type="button" title={tip} onClick={onClick}
      style={{ flex: 1, padding: '8px 4px', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        background: active ? 'rgba(168,164,255,0.15)' : 'rgba(255,255,255,0.04)',
        border: active ? '1px solid rgba(168,164,255,0.35)' : '1px solid rgba(255,255,255,0.08)',
        color: active ? '#a8a4ff' : 'rgba(227,226,224,0.5)',
        fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: active ? 700 : 400, cursor: 'pointer' }}>
      {label}
    </button>
  )

  const FONT_OPTIONS: { id: PageStyles['fontPair']; display: string; sub: string; family: string }[] = [
    { id: 'default',   display: 'Fraunces',         sub: 'Fraunces + DM Sans',    family: 'Fraunces, serif' },
    { id: 'mono',      display: 'Space Mono',        sub: 'Mono + Inter',          family: 'monospace' },
    { id: 'humanist',  display: 'Plus Jakarta Sans', sub: 'Humanist sans-serif',   family: 'sans-serif' },
    { id: 'editorial', display: 'Playfair Display',  sub: 'Playfair + DM Sans',    family: 'Georgia, serif' },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>

      {/* ── Theme presets ─────────────────────────────────────────────── */}
      {row('Themes', (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {THEME_PRESETS.map(preset => {
            const isActive = styles.accent === preset.accent && styles.bgStyle === preset.bgStyle && styles.buttonStyle === preset.buttonStyle
            return (
              <button key={preset.id} type="button"
                onClick={() => onChange({ accent: preset.accent, bgStyle: preset.bgStyle, buttonStyle: preset.buttonStyle, cornerRadius: preset.cornerRadius, fontPair: preset.fontPair })}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 10,
                  background: isActive ? 'rgba(168,164,255,0.1)' : 'rgba(255,255,255,0.03)',
                  border: isActive ? `1.5px solid ${preset.accent}60` : '1px solid rgba(255,255,255,0.07)',
                  cursor: 'pointer', textAlign: 'left' }}>
                {/* Swatch row */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                  <div style={{ width: 18, height: 10, borderRadius: 3, background: BG_PREVIEW[preset.bgStyle]?.swatch ?? '#07070f' }} />
                  <div style={{ width: 18, height: 6, borderRadius: 2, background: preset.accent }} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, color: isActive ? '#a8a4ff' : '#e3e2e0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preset.name}</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', color: 'rgba(227,226,224,0.35)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preset.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      ))}

      {/* ── Accent color ─────────────────────────────────────────────── */}
      {row('Accent Colour', (
        <div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 8 }}>
            {ACCENT_COLORS.map(c => (
              <div key={c} onClick={() => onChange({ accent: c })}
                style={{ width: 26, height: 26, borderRadius: '50%', background: c, cursor: 'pointer',
                  border: styles.accent === c ? '2px solid white' : '2px solid transparent',
                  outline: styles.accent === c ? `2px solid ${c}` : 'none', outlineOffset: 2,
                  transition: 'all 0.15s', flexShrink: 0 }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="color" value={styles.accent} onChange={e => onChange({ accent: e.target.value })}
              style={{ width: 26, height: 26, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none', padding: 0, flexShrink: 0 }} />
            <input type="text" value={styles.accent} onChange={e => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && onChange({ accent: e.target.value })}
              style={{ flex: 1, padding: '5px 8px', borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'monospace', fontSize: '11px', outline: 'none' }} />
          </div>
        </div>
      ))}

      {/* ── Background ───────────────────────────────────────────────── */}
      {row('Background', (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {(Object.entries(BG_PREVIEW) as [PageStyles['bgStyle'], { label: string; swatch: string }][]).map(([key, meta]) => {
            const active = styles.bgStyle === key
            return (
              <button key={key} type="button" onClick={() => onChange({ bgStyle: key })}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '8px 6px', borderRadius: 9,
                  background: active ? 'rgba(168,164,255,0.12)' : 'rgba(255,255,255,0.03)',
                  border: active ? '1.5px solid rgba(168,164,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer' }}>
                <div style={{ width: 28, height: 16, borderRadius: 5, background: meta.swatch, border: '1px solid rgba(255,255,255,0.1)' }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: active ? '#a8a4ff' : 'rgba(227,226,224,0.5)', fontWeight: active ? 700 : 400 }}>{meta.label}</span>
              </button>
            )
          })}
        </div>
      ))}

      {/* ── Buttons ──────────────────────────────────────────────────── */}
      {row('Button Style', (
        <div style={{ display: 'flex', gap: 6 }}>
          {optBtn(styles.buttonStyle === 'filled',  'Filled',  () => onChange({ buttonStyle: 'filled' }))}
          {optBtn(styles.buttonStyle === 'outline', 'Outline', () => onChange({ buttonStyle: 'outline' }))}
          {optBtn(styles.buttonStyle === 'pill',    'Pill',    () => onChange({ buttonStyle: 'pill' }))}
        </div>
      ))}

      {/* ── Corner radius ─────────────────────────────────────────────── */}
      {row('Corners', (
        <div style={{ display: 'flex', gap: 6 }}>
          {optBtn(styles.cornerRadius === 'sharp',  <><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="10" height="10"/></svg> Sharp</>   , () => onChange({ cornerRadius: 'sharp' }))}
          {optBtn(styles.cornerRadius === 'medium', <><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="10" height="10" rx="3"/></svg> Medium</>, () => onChange({ cornerRadius: 'medium' }))}
          {optBtn(styles.cornerRadius === 'full',   <><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="10" height="10" rx="5"/></svg> Full</>   , () => onChange({ cornerRadius: 'full' }))}
        </div>
      ))}

      {/* ── Product layout ────────────────────────────────────────────── */}
      {row('Product Layout', (
        <div style={{ display: 'flex', gap: 6 }}>
          {optBtn(styles.productLayout === 'list', <>{Icons.list} List</>, () => onChange({ productLayout: 'list' }), 'Single column')}
          {optBtn(styles.productLayout === 'grid', <>{Icons.grid} Grid</>, () => onChange({ productLayout: 'grid' }), 'Two columns')}
        </div>
      ))}

      {/* ── Fonts ────────────────────────────────────────────────────── */}
      {row('Fonts', (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {FONT_OPTIONS.map(f => (
            <button key={f.id} type="button" onClick={() => onChange({ fontPair: f.id })}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10,
                background: styles.fontPair === f.id ? 'rgba(168,164,255,0.08)' : 'rgba(255,255,255,0.03)',
                border: styles.fontPair === f.id ? '1px solid rgba(168,164,255,0.3)' : '1px solid rgba(255,255,255,0.07)',
                cursor: 'pointer', textAlign: 'left' }}>
              <div>
                <p style={{ fontFamily: f.family, fontSize: '13px', fontWeight: 700, color: '#e3e2e0', margin: '0 0 1px' }}>{f.display}</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>{f.sub}</p>
              </div>
              {styles.fontPair === f.id && <span style={{ color: '#a8a4ff' }}>{Icons.check}</span>}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Panel: Settings ──────────────────────────────────────────────────────────

function SettingsPanel({ meta, onChange }: { meta: PageMeta; onChange: (m: Partial<PageMeta>) => void }) {
  const field = (label: string, key: keyof PageMeta, placeholder: string, type: 'text' | 'textarea' = 'text') => (
    <div style={{ marginBottom: 14 }}>
      <PanelLabel>{label}</PanelLabel>
      {type === 'textarea' ? (
        <textarea value={meta[key]} onChange={e => onChange({ [key]: e.target.value })} placeholder={placeholder} rows={3} style={{ width: '100%', padding: '9px 11px', borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5 }} />
      ) : (
        <input type="text" value={meta[key]} onChange={e => onChange({ [key]: e.target.value })} placeholder={placeholder} style={{ width: '100%', padding: '9px 11px', borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
      )}
    </div>
  )
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
      <PanelLabel>Page</PanelLabel>
      {field('Page Title', 'title', 'My Creator Store')}
      <div style={{ marginBottom: 14 }}>
        <PanelLabel>URL Slug</PanelLabel>
        <div style={{ padding: '9px 11px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {meta.slug || '—'}
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.3)', margin: '4px 0 0' }}>Set during onboarding — contact support to change</p>
      </div>
      <div style={{ padding: '8px 12px', borderRadius: 9, background: 'rgba(168,164,255,0.08)', border: '1px solid rgba(168,164,255,0.15)', marginBottom: 14, overflow: 'hidden' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#a8a4ff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>crevo.in/<strong>{meta.slug || 'your-slug'}</strong></p>
      </div>
      {field('SEO Description', 'description', 'Describe your page for search engines...', 'textarea')}

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 14, marginTop: 4 }}>
        <PanelLabel>More</PanelLabel>
        {[
          { label: 'Theme',  icon: Icons.palette, href: '/dashboard/page-builder/theme',  desc: 'Colors, fonts & presets' },
          { label: 'Domain', icon: Icons.globe,   href: '/dashboard/page-builder/domain', desc: 'Connect your own domain' },
        ].map(item => (
          <a key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 8, textDecoration: 'none' }}>
            <span style={{ color: 'rgba(227,226,224,0.5)' }}>{item.icon}</span>
            <div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: '#e3e2e0', margin: '0 0 1px' }}>{item.label}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>{item.desc}</p>
            </div>
            <span style={{ marginLeft: 'auto', color: 'rgba(227,226,224,0.25)', flexShrink: 0 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg></span>
          </a>
        ))}
      </div>
    </div>
  )
}

// ─── Right panel: Block settings or Profile ───────────────────────────────────

function RightPanel({ blocks, selectedId, onUpdateConfig, onRemove, profile, onProfileChange, username }: {
  blocks: Block[]
  selectedId: string | null
  onUpdateConfig: (id: string, key: string, value: string) => void
  onRemove: (id: string) => void
  profile: Profile
  onProfileChange: (p: Partial<Profile>) => void
  username: string
}) {
  const selected = blocks.find(b => b.id === selectedId)

  if (selected) {
    const meta = BLOCK_REGISTRY[selected.type]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${meta.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.accent, flexShrink: 0 }}>{meta.icon}</div>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: '#e3e2e0', margin: 0 }}>Edit Block</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>{meta.label}</p>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {meta.fields.map(field => (
              field.kind !== 'toggle' ? (
                <div key={field.key}>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(227,226,224,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>{field.label}</label>
                  <FieldInput field={field} value={selected.config[field.key] ?? ''} onChange={v => onUpdateConfig(selected.id, field.key, v)} />
                </div>
              ) : (
                <FieldInput key={field.key} field={field} value={selected.config[field.key] ?? 'false'} onChange={v => onUpdateConfig(selected.id, field.key, v)} />
              )
            ))}
          </div>
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button type="button" onClick={() => onRemove(selected.id)} style={{ width: '100%', padding: '9px', borderRadius: 10, background: 'none', border: '1px solid rgba(239,68,68,0.15)', color: 'rgba(239,68,68,0.6)', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            Remove
          </button>
        </div>
      </div>
    )
  }

  // Default: Profile panel
  return (
    <div style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(227,226,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Profile</p>
        <span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.12)', fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, color: '#10b981' }}>Active</span>
      </div>

      {/* Avatar */}
      <div>
        <PanelLabel>Profile Avatar</PanelLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#a8a4ff,#6c5ce7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', fontWeight: 700, color: '#fff' }}>{profile.displayName[0]?.toUpperCase() ?? 'P'}</span>
            }
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>Avatar is synced from your profile settings</p>
          </div>
        </div>
      </div>

      {/* Display name */}
      <div>
        <PanelLabel>Display Name</PanelLabel>
        <input type="text" value={profile.displayName} onChange={e => onProfileChange({ displayName: e.target.value })}
          style={{ width: '100%', padding: '9px 11px', borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {/* Bio */}
      <div>
        <PanelLabel>Biography</PanelLabel>
        <textarea value={profile.bio} onChange={e => onProfileChange({ bio: e.target.value })} rows={3}
          style={{ width: '100%', padding: '9px 11px', borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5 }} />
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.3)', margin: '4px 0 0', textAlign: 'right' }}>{profile.bio.length}/150</p>
      </div>

      {/* Verified badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: '#e3e2e0', margin: '0 0 2px' }}>Verified Badge</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.4)', margin: 0 }}>Show verified badge on your profile</p>
        </div>
        <div onClick={() => onProfileChange({ verified: !profile.verified })} style={{ width: 36, height: 20, borderRadius: 10, background: profile.verified ? '#a8a4ff' : 'rgba(255,255,255,0.12)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 2, left: profile.verified ? 17 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
        </div>
      </div>

      {/* Page link */}
      {username ? (
        <a href={`/${username}`} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', textDecoration: 'none', overflow: 'hidden' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8a4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          <div style={{ overflow: 'hidden' }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#a8a4ff', fontWeight: 600 }}>Preview live page</span>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(168,164,255,0.55)', margin: '1px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>localhost:3000/{username}</p>
          </div>
        </a>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(227,226,224,0.3)' }}>Loading your page link…</span>
        </div>
      )}
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

const LEFT_TABS: { id: LeftTab; icon: React.ReactNode; label: string }[] = [
  { id: 'blocks',   icon: Icons.blocks,   label: 'Add' },
  { id: 'layers',   icon: Icons.layers,   label: 'Layers' },
  { id: 'styles',   icon: Icons.styles,   label: 'Style' },
  { id: 'settings', icon: Icons.settings, label: 'Settings' },
]

const DEVICE_TABS: { id: DeviceMode; icon: React.ReactNode; label: string }[] = [
  { id: 'mobile',  icon: Icons.mobile,  label: 'Mobile' },
  { id: 'tablet',  icon: Icons.tablet,  label: 'Tablet' },
  { id: 'desktop', icon: Icons.desktop, label: 'Desktop' },
]

export default function PageBuilderPage() {
  // ─── State ────────────────────────────────────────────────────────────────
  const { getToken } = useAuth()
  const [blocks, setBlocks] = useState<Block[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<LeftTab>('blocks')
  const [device, setDevice] = useState<DeviceMode>('mobile')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState<Profile>({ displayName: '', bio: '', verified: false, avatarUrl: null })
  const [pageMeta, setPageMeta] = useState<PageMeta>({ title: '', slug: '', description: '' })
  const [pageStyles, setPageStyles] = useState<PageStyles>({ accent: '#a8a4ff', bgStyle: 'dark', buttonStyle: 'filled', cornerRadius: 'medium', fontPair: 'default', productLayout: 'list' })
  const [loadingProfile, setLoadingProfile] = useState(true)

  // ─── Load profile + blocks on mount ──────────────────────────────────────
  useEffect(() => {
    getToken().then(async (token) => {
      if (!token) return
      try {
        const creator = await getMyProfile(token) as {
          storefrontBlocks?: (Block & { type: string; config: Record<string, string> })[]
          displayName?: string; bio?: string; username?: string
          isVerified?: boolean; avatarUrl?: string | null
        }

        // Always load profile from API — never show mock data
        setProfile({
          displayName: creator.displayName ?? '',
          bio: creator.bio ?? '',
          verified: creator.isVerified ?? false,
          avatarUrl: creator.avatarUrl ?? null,
        })
        setPageMeta(m => ({
          ...m,
          title: creator.displayName ?? '',
          slug: creator.username ?? '',
        }))

        // Split __settings__ block from content blocks
        const allBlocks: { type: string; config?: Record<string, string> }[] =
          Array.isArray(creator.storefrontBlocks) ? creator.storefrontBlocks as never[] : []
        const settingsEntry = allBlocks.find(b => b.type === '__settings__')
        const contentBlocks = allBlocks.filter(b => b.type !== '__settings__') as Block[]
        if (contentBlocks.length > 0) setBlocks(contentBlocks)
        const cfg = settingsEntry?.config
        if (cfg) {
          setPageMeta(m => ({ ...m, description: cfg.seoDescription ?? '' }))
          setPageStyles(s => ({
            ...s,
            accent:        cfg.accent         ?? s.accent,
            bgStyle:       (cfg.bgStyle        ?? s.bgStyle)        as PageStyles['bgStyle'],
            buttonStyle:   (cfg.buttonStyle    ?? s.buttonStyle)    as PageStyles['buttonStyle'],
            cornerRadius:  (cfg.cornerRadius   ?? s.cornerRadius)   as PageStyles['cornerRadius'],
            fontPair:      (cfg.fontPair       ?? s.fontPair)       as PageStyles['fontPair'],
            productLayout: (cfg.productLayout  ?? s.productLayout)  as PageStyles['productLayout'],
          }))
        }
      } catch {
        // silently fallback to empty state
      } finally {
        setLoadingProfile(false)
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Mutations ────────────────────────────────────────────────────────────
  const addBlock = useCallback((type: BlockType) => {
    const id = makeId(type)
    const meta = BLOCK_REGISTRY[type]
    setBlocks(prev => [...prev, { id, type, visible: true, config: { ...meta.defaultConfig } }])
    setSelectedId(id)
    setActiveTab('layers')
  }, [])

  const updateConfig = useCallback((id: string, key: string, value: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, config: { ...b.config, [key]: value } } : b))
    setSaved(false)
  }, [])

  const toggleVisible = useCallback((id: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, visible: !b.visible } : b))
  }, [])

  const removeBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id))
    setSelectedId(s => s === id ? null : s)
  }, [])

  const moveBlockCb = useCallback((id: string, dir: -1 | 1) => {
    setBlocks(prev => moveBlock(prev, id, dir))
  }, [])

  const handlePublish = useCallback(async () => {
    setSaving(true)
    try {
      const token = await getToken()
      if (!token) return

      // Save profile fields (displayName, bio)
      await updateProfile(token, {
        displayName: profile.displayName,
        bio: profile.bio,
      })

      // Save page settings as a hidden __settings__ entry prepended to blocks
      const settingsEntry = {
        id: '__settings__',
        type: '__settings__',
        visible: false,
        config: {
          seoDescription: pageMeta.description,
          accent:         pageStyles.accent,
          bgStyle:        pageStyles.bgStyle,
          buttonStyle:    pageStyles.buttonStyle,
          cornerRadius:   pageStyles.cornerRadius,
          fontPair:       pageStyles.fontPair,
          productLayout:  pageStyles.productLayout,
        },
      }
      await saveStorefrontBlocks(token, [settingsEntry, ...blocks])

      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error('Failed to save:', err)
    } finally {
      setSaving(false)
    }
  }, [blocks, profile, pageMeta, pageStyles, getToken])

  // ─── Derived ──────────────────────────────────────────────────────────────
  const previewBg = theme === 'light'
    ? (pageStyles.bgStyle === 'cream' ? '#ede8e3' : pageStyles.bgStyle === 'pure' ? '#fafafa' : '#f7f7f7')
    : (pageStyles.bgStyle === 'deep' ? '#020209' : '#0e0e10')
  // Fixed device sizes (inner content area, not including bezels)
  const deviceW = device === 'mobile' ? 390 : device === 'tablet' ? 744 : 1280
  const deviceH = device === 'mobile' ? 780 : device === 'tablet' ? 960 : 800

  return (
    // Fixed overlay — full screen builder that covers AppShell
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#111115', fontFamily: 'DM Sans, sans-serif', zIndex: 50, overflow: 'hidden' }}>

      {/* ── Global topbar ────────────────────────────────────────────────── */}
      <div style={{ height: 48, flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12 }}>
        {/* Back + title */}
        <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'rgba(227,226,224,0.5)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </a>
        <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '15px', color: '#e3e2e0', letterSpacing: '-0.02em' }}>My Crevo Page</span>

{/* Centre: save indicator */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: saved ? '#10b981' : 'rgba(227,226,224,0.3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {saved ? <>{Icons.check} Saved</> : saving ? 'Saving…' : blocks.length > 0 ? 'Unsaved changes' : ''}
          </span>
        </div>

        {/* Device switcher */}
        <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 9, padding: 3 }}>
          {DEVICE_TABS.map(d => (
            <button key={d.id} type="button" title={d.label} onClick={() => setDevice(d.id)} style={{ width: 30, height: 26, borderRadius: 6, background: device === d.id ? 'rgba(168,164,255,0.2)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: device === d.id ? '#a8a4ff' : 'rgba(227,226,224,0.35)' }}>
              {d.icon}
            </button>
          ))}
        </div>

        {/* Theme toggle */}
        <button type="button" title="Toggle preview theme" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(227,226,224,0.5)' }}>
          {theme === 'light' ? Icons.moon : Icons.sun}
        </button>

        <button type="button" onClick={() => pageMeta.slug && window.open(`/${pageMeta.slug}`, '_blank')} disabled={loadingProfile || !pageMeta.slug} style={{ padding: '7px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: loadingProfile || !pageMeta.slug ? 'rgba(227,226,224,0.25)' : '#e3e2e0', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, cursor: loadingProfile || !pageMeta.slug ? 'not-allowed' : 'pointer' }}>{loadingProfile ? 'Loading…' : 'Preview'}</button>
        <button type="button" onClick={handlePublish} disabled={saving} style={{ padding: '7px 18px', borderRadius: 9, background: 'linear-gradient(135deg,#6c5ce7,#a8a4ff)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, border: 'none', cursor: saving ? 'wait' : 'pointer', boxShadow: '0 3px 12px rgba(108,92,231,0.4)', opacity: saving ? 0.8 : 1 }}>
          {saving ? 'Publishing…' : 'Publish'}
        </button>
      </div>

      {/* ── Main 3-column layout ─────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left: tab icon rail + panel */}
        <div style={{ display: 'flex', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          {/* Icon tab rail */}
          <div style={{ width: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10, gap: 2, borderRight: '1px solid rgba(255,255,255,0.06)', background: '#0e0e10' }}>
            {LEFT_TABS.map(tab => (
              <button key={tab.id} type="button" title={tab.label} onClick={() => setActiveTab(tab.id)}
                style={{ width: 40, height: 40, borderRadius: 10, background: activeTab === tab.id ? 'rgba(168,164,255,0.15)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, color: activeTab === tab.id ? '#a8a4ff' : 'rgba(227,226,224,0.3)', transition: 'all 0.12s' }}>
                {tab.icon}
                <span style={{ fontSize: '7px', fontWeight: 700, letterSpacing: '0.04em' }}>{tab.label}</span>
              </button>
            ))}
            {/* Help */}
            <div style={{ flex: 1 }} />
            <button type="button" title="Help" style={{ width: 40, height: 40, borderRadius: 10, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(227,226,224,0.25)', marginBottom: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </button>
          </div>

          {/* Panel content */}
          <div style={{ width: 240, display: 'flex', flexDirection: 'column', background: '#141417', overflow: 'hidden' }}>
            {activeTab === 'blocks'   && <BlocksPanel onAdd={addBlock} />}
            {activeTab === 'layers'   && <LayersPanel blocks={blocks} selectedId={selectedId} onSelect={setSelectedId} onToggle={toggleVisible} onMove={moveBlockCb} onRemove={removeBlock} />}
            {activeTab === 'styles'   && <StylesPanel styles={pageStyles} onChange={s => setPageStyles(prev => ({ ...prev, ...s }))} />}
            {activeTab === 'settings' && <SettingsPanel meta={pageMeta} onChange={m => setPageMeta(prev => ({ ...prev, ...m }))} />}

            {/* Bottom status */}
            <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(227,226,224,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blocks.length} block{blocks.length !== 1 ? 's' : ''}{pageMeta.slug ? ` · /${pageMeta.slug}` : ''}</span>
            </div>
          </div>
        </div>

        {/* Centre: preview canvas */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'repeating-linear-gradient(0deg,rgba(255,255,255,0.018) 0px,rgba(255,255,255,0.018) 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,rgba(255,255,255,0.018) 0px,rgba(255,255,255,0.018) 1px,transparent 1px,transparent 32px)', position: 'relative', overflow: 'hidden' }}
          onClick={() => setSelectedId(null)}
        >
          {/* ── Device frame ─────────────────────────────────────────────── */}
          {device === 'mobile' ? (
            /* iPhone 14 Pro frame — fixed 390×780 inner, scales down to fit */
            <div style={{ transform: 'scale(var(--phone-scale,0.82))', transformOrigin: 'top center', transition: 'transform 0.25s ease' }}
              ref={el => {
                if (!el) return
                const parent = el.parentElement
                if (!parent) return
                const availH = parent.clientHeight - 48
                const availW = parent.clientWidth - 48
                const scaleH = availH / (780 + 32)
                const scaleW = availW / (390 + 24)
                el.style.setProperty('--phone-scale', String(Math.min(scaleH, scaleW, 1).toFixed(3)))
              }}>
              {/* Outer shell */}
              <div style={{ width: 414, height: 844, borderRadius: 55, background: '#1c1c1e', padding: 12, boxShadow: '0 0 0 2px #3a3a3c, 0 40px 100px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.08)', position: 'relative', flexShrink: 0 }}>
                {/* Side buttons */}
                <div style={{ position: 'absolute', left: -3, top: 120, width: 3, height: 36, background: '#3a3a3c', borderRadius: '2px 0 0 2px' }} />
                <div style={{ position: 'absolute', left: -3, top: 170, width: 3, height: 64, background: '#3a3a3c', borderRadius: '2px 0 0 2px' }} />
                <div style={{ position: 'absolute', left: -3, top: 248, width: 3, height: 64, background: '#3a3a3c', borderRadius: '2px 0 0 2px' }} />
                <div style={{ position: 'absolute', right: -3, top: 168, width: 3, height: 80, background: '#3a3a3c', borderRadius: '0 2px 2px 0' }} />
                {/* Screen */}
                <div style={{ width: '100%', height: '100%', borderRadius: 44, overflow: 'hidden', background: previewBg, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  {/* Status bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px 4px', background: theme === 'dark' ? '#000' : '#fff', flexShrink: 0, position: 'relative' }}>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, color: theme === 'dark' ? '#fff' : '#000', letterSpacing: '-0.3px' }}>9:41</span>
                    {/* Dynamic Island */}
                    <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, background: '#000', borderRadius: 20 }} />
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                      <svg width="16" height="12" viewBox="0 0 16 12" fill={theme === 'dark' ? '#fff' : '#000'}><rect x="0" y="3" width="3" height="9" rx="1" opacity="0.3"/><rect x="4.5" y="2" width="3" height="10" rx="1" opacity="0.5"/><rect x="9" y="1" width="3" height="11" rx="1" opacity="0.7"/><rect x="13.5" y="0" width="3" height="12" rx="1"/></svg>
                      <svg width="15" height="12" viewBox="0 0 15 12" fill="none" stroke={theme === 'dark' ? '#fff' : '#000'} strokeWidth="1.5"><path d="M7.5 3C9.8 3 11.9 4 13.3 5.7M1.7 5.7C3.1 4 5.2 3 7.5 3"/><path d="M7.5 6.5C8.8 6.5 9.9 7.1 10.7 8M4.3 8C5.1 7.1 6.2 6.5 7.5 6.5"/><circle cx="7.5" cy="10.5" r="1" fill={theme === 'dark' ? '#fff' : '#000'} stroke="none"/></svg>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <div style={{ width: 22, height: 11, borderRadius: 3, border: `1.5px solid ${theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'}`, padding: '1.5px', display: 'flex', alignItems: 'center' }}>
                          <div style={{ height: '100%', width: '80%', borderRadius: 1.5, background: '#34c759' }} />
                        </div>
                        <div style={{ width: 2, height: 5, background: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)', borderRadius: 1 }} />
                      </div>
                    </div>
                  </div>

                  {/* Scrollable content */}
                  <div style={{ flex: 1, overflowY: 'auto', background: previewBg }} onClick={e => e.stopPropagation()}>
                    {/* Profile header */}
                    <div style={{ background: theme === 'dark' ? '#111' : '#fff', padding: '20px 16px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#a8a4ff,#6c5ce7)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {profile.avatarUrl
                          ? <img src={profile.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 700, color: '#fff' }}>{profile.displayName[0]?.toUpperCase() ?? 'P'}</span>
                        }
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: 700, color: theme === 'dark' ? '#e3e2e0' : '#0e0e10', margin: '0 0 3px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                          {profile.displayName || <span style={{ opacity: 0.3 }}>Your Name</span>}
                          {profile.verified && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: 5, background: 'rgba(168,164,255,0.15)', color: '#a8a4ff' }}>✓</span>}
                        </p>
                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: theme === 'dark' ? 'rgba(227,226,224,0.5)' : 'rgba(0,0,0,0.5)', margin: 0, lineHeight: 1.4, maxWidth: 220 }}>{profile.bio || <span style={{ opacity: 0.3 }}>Your bio will appear here</span>}</p>
                      </div>
                    </div>
                    {/* Blocks */}
                    <div style={{ padding: '8px 12px 32px' }}>
                      {blocks.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', opacity: 0.4 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, color: 'rgba(227,226,224,0.4)' }}>{Icons.plus}</div>
                          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(227,226,224,0.35)', textAlign: 'center', margin: 0 }}>Add blocks from the library</p>
                        </div>
                      ) : blocks.map(block => (
                        <PreviewBlock key={block.id} block={block} theme={theme} selected={selectedId === block.id} onClick={() => { setSelectedId(block.id) }} />
                      ))}
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div style={{ background: theme === 'dark' ? '#000' : '#fff', padding: '8px 0 10px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 134, height: 5, borderRadius: 3, background: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)' }} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Tablet / desktop — simple bordered frame */
            <div style={{ width: deviceW, height: deviceH, borderRadius: device === 'tablet' ? 20 : 8, border: '4px solid #2a2a35', boxShadow: '0 24px 64px rgba(0,0,0,0.6)', background: previewBg, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, overflowY: 'auto', background: previewBg }} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '8px 12px 24px' }}>
                  {blocks.map(block => (
                    <PreviewBlock key={block.id} block={block} theme={theme} selected={selectedId === block.id} onClick={() => { setSelectedId(block.id) }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom canvas toolbar */}
          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, background: 'rgba(20,20,23,0.9)', backdropFilter: 'blur(12px)', borderRadius: 14, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button type="button" title="Undo" style={{ width: 28, height: 28, borderRadius: 7, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
            </button>
            <button type="button" title="Redo" style={{ width: 28, height: 28, borderRadius: 7, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(227,226,224,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>
            </button>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
            <button type="button" title="Add Block" onClick={() => setActiveTab('blocks')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 8, background: 'rgba(168,164,255,0.15)', border: '1px solid rgba(168,164,255,0.25)', color: '#a8a4ff', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
              {Icons.plus} Add Block
            </button>
            <button type="button" title="Done" onClick={() => window.location.href = '/dashboard'} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 8, background: 'linear-gradient(135deg,#6c5ce7,#a8a4ff)', border: 'none', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
              Done
            </button>
          </div>
        </div>

        {/* Right: context settings */}
        <div style={{ width: 260, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)', background: '#141417', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <RightPanel blocks={blocks} selectedId={selectedId} onUpdateConfig={updateConfig} onRemove={removeBlock} profile={profile} onProfileChange={p => setProfile(prev => ({ ...prev, ...p }))} username={pageMeta.slug} />
        </div>
      </div>
    </div>
  )
}
