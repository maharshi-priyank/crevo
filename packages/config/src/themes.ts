export interface ThemeConfig {
  id: string
  name: string
  fontFamily: string
  colors: {
    primary: string
    background: string
    surface: string
    text: string
    muted: string
  }
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    fontFamily: 'Inter',
    colors: { primary: '#6366f1', background: '#0f0f0f', surface: '#1a1a1a', text: '#f5f5f5', muted: '#6b7280' },
  },
  {
    id: 'saffron',
    name: 'Saffron',
    fontFamily: 'Poppins',
    colors: { primary: '#f97316', background: '#fffbf5', surface: '#ffffff', text: '#1c1917', muted: '#78716c' },
  },
  {
    id: 'forest',
    name: 'Forest',
    fontFamily: 'DM Sans',
    colors: { primary: '#16a34a', background: '#f0fdf4', surface: '#ffffff', text: '#14532d', muted: '#6b7280' },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    fontFamily: 'Nunito',
    colors: { primary: '#0ea5e9', background: '#f0f9ff', surface: '#ffffff', text: '#0c4a6e', muted: '#64748b' },
  },
  {
    id: 'rose',
    name: 'Rose',
    fontFamily: 'Lato',
    colors: { primary: '#e11d48', background: '#fff1f2', surface: '#ffffff', text: '#881337', muted: '#9ca3af' },
  },
]

export const DEFAULT_THEME_ID = 'midnight'
