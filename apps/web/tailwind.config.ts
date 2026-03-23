import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  safelist: [
    // Custom color classes used dynamically — force generation
    'bg-gradient-brand', 'bg-gradient-violet', 'bg-gradient-dark',
    'bg-mesh',
    'shadow-violet-glow', 'shadow-orange-glow',
    'text-gradient', 'text-gradient-warm',
    // Ink scale
    'bg-ink-950', 'bg-ink-900', 'bg-ink-800',
    'text-ink-900', 'text-ink-800', 'text-ink-700', 'text-ink-600',
    // Saffron scale
    'bg-saffron-50', 'bg-saffron-100', 'bg-saffron-500',
    'text-saffron-500', 'text-saffron-600', 'text-saffron-700',
    // Violet extras
    'bg-violet-50', 'bg-violet-100',
    'text-violet-600', 'text-violet-700',
    // Font utilities
    'font-display', 'font-mono-nums',
    // Animation
    'animate-page-enter', 'animate-float',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Brand violet — deep, rich
        violet: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7C3AED',   // primary brand
          700: '#6D28D9',   // hover
          800: '#5B21B6',
          900: '#1a0533',   // deep dark
          950: '#0d0118',
        },
        // Saffron/orange — India-native accent
        saffron: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#F97316',   // primary accent
          600: '#ea6c0a',
          700: '#c2570a',
          800: '#9a3f08',
          900: '#7c3207',
        },
        // Ink — near-black for text
        ink: {
          50:  '#f8f8fc',
          100: '#f0f0f8',
          200: '#e2e2f0',
          300: '#c8c8e0',
          400: '#9898b8',
          500: '#6868a0',
          600: '#4a4a80',
          700: '#333360',
          800: '#1e1e48',
          900: '#0f0f2e',
          950: '#07070f',
        },
      },
      borderRadius: {
        sm:   '6px',
        DEFAULT: '10px',
        md:   '10px',
        lg:   '14px',
        xl:   '18px',
        '2xl':'24px',
        '3xl':'32px',
        full: '9999px',
      },
      boxShadow: {
        xs:   '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        sm:   '0 1px 3px 0 rgb(0 0 0 / 0.08)',
        md:   '0 4px 12px 0 rgb(0 0 0 / 0.08)',
        lg:   '0 8px 24px 0 rgb(0 0 0 / 0.10)',
        xl:   '0 16px 40px 0 rgb(0 0 0 / 0.12)',
        card: '0 0 0 1px rgb(0 0 0 / 0.05), 0 2px 8px 0 rgb(0 0 0 / 0.06)',
        'card-hover': '0 0 0 1px rgb(0 0 0 / 0.08), 0 8px 24px 0 rgb(0 0 0 / 0.12)',
        'violet-glow': '0 4px 24px 0 rgba(124, 58, 237, 0.40)',
        'orange-glow': '0 4px 24px 0 rgba(249, 115, 22, 0.35)',
        'inner-violet': 'inset 0 0 0 1px rgba(124, 58, 237, 0.20)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #7C3AED 0%, #F97316 100%)',
        'gradient-violet': 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a12 0%, #0f0f1e 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(249,115,22,0.05) 100%)',
      },
      animation: {
        'page-enter': 'page-enter 0.28s cubic-bezier(0.16, 1, 0.3, 1) both',
        'float':      'float 3s ease-in-out infinite',
        'spin-slow':  'spin 1.4s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
