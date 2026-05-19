/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ── Brand / Primary ─────────────────────── */
        'primary': 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',

        /* Legacy aliases for existing component references */
        'accent': 'var(--color-primary)',
        'workflow-primary': 'var(--color-primary)',
        'workflow-primary-600': 'var(--color-primary-hover)',
        'sapphire': 'var(--color-primary)',

        /* ── Backgrounds ─────────────────────────── */
        'bg': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-tertiary': 'var(--color-bg-tertiary)',
        'surface': 'var(--color-card-bg)',
        'surface-elevated': 'var(--color-bg-secondary)',
        'private': 'var(--color-bg-primary)',
        'white': '#FFFFFF',

        /* ── Text ────────────────────────────────── */
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-tertiary)',

        /* ── Borders ─────────────────────────────── */
        'border': 'var(--color-border-primary)',
        'border-primary': 'var(--color-border-primary)',
        'border-secondary': 'var(--color-border-secondary)',
        'border-focus': 'var(--color-border-focus)',

        /* ── Status / Semantic ────────────────────── */
        'success': {
          DEFAULT: 'var(--color-success)',
          'bg': 'var(--color-success-bg)',
          '50': '#E6F4E6',
          '100': '#CCE9CC',
          '500': '#107C10',
          '600': '#0B5A0B',
        },
        'error': {
          DEFAULT: 'var(--color-error)',
          'bg': 'var(--color-error-bg)',
          '50': '#FDE7E9',
          '100': '#FBCFD2',
          '500': '#D13438',
          '600': '#A52729',
        },
        'warning': {
          DEFAULT: 'var(--color-warning)',
          'bg': 'var(--color-warning-bg)',
          '50': '#FFF4E5',
          '100': '#FFE9CC',
          '500': '#FF8C00',
          '600': '#CC7000',
        },
        'info': {
          DEFAULT: 'var(--color-info)',
          'bg': 'var(--color-info-bg)',
        },

        /* ── Sidebar ─────────────────────────────── */
        'sidebar': {
          'bg': 'var(--color-sidebar-bg)',
          'text': 'var(--color-sidebar-text)',
          'active': 'var(--color-sidebar-text-active)',
          'item-active': 'var(--color-sidebar-item-active)',
          'item-hover': 'var(--color-sidebar-item-hover)',
          'border': 'var(--color-sidebar-border)',
          'icon': 'var(--color-sidebar-icon)',
          'icon-active': 'var(--color-sidebar-icon-active)',
        },

        /* ── Nav ─────────────────────────────────── */
        'nav': {
          'bg': 'var(--color-nav-bg)',
          'text': 'var(--color-nav-text)',
          'hover': 'var(--color-nav-text-hover)',
          'border': 'var(--color-nav-border)',
          'active': 'var(--color-nav-active)',
        },

        /* ── Cards ───────────────────────────────── */
        'card': {
          'bg': 'var(--color-card-bg)',
          'border': 'var(--color-card-border)',
        },

        /* ── Stat card borders ───────────────────── */
        'stat': {
          'blue': 'var(--color-stat-border-1)',
          'green': 'var(--color-stat-border-2)',
          'amber': 'var(--color-stat-border-3)',
          'purple': 'var(--color-stat-border-4)',
        },

        /* ── Secondary shades (used in some components) */
        'secondary': {
          '100': '#F5F5F5',
          '200': '#E0E0E0',
          '300': '#C8C8C8',
          '400': '#A0A0A0',
          '500': '#767676',
          '600': '#444444',
        },

        /* ── Dark section colors ─────────────────── */
        'dark': {
          'bg': '#0B1120',
          'surface': '#0F172A',
          'surface-elevated': '#1E293B',
          'border': 'rgba(255, 255, 255, 0.08)',
          'text': '#F8FAFC',
          'text-secondary': '#CBD5E1',
          'text-muted': '#94A3B8',
          'accent': 'var(--color-primary)',
        },

        'ink': '#1A1A1A',
        'ink-light': '#444444',
        'bg-bg': 'var(--color-bg-primary)',
        'bg-elevated': 'var(--color-bg-secondary)',
      },
      fontFamily: {
        'sans': ['Inter', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'display': ['Inter', 'Segoe UI', 'sans-serif'],
        'mono': ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.035em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
        'full': '9999px',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 16px rgba(0, 120, 212, 0.12)',
        'modal': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'nav': '0 1px 4px rgba(0, 0, 0, 0.08)',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(0, 120, 212, 0.15)',
        'glow-lg': '0 0 40px rgba(0, 120, 212, 0.2)',
        'primary-glow': '0 0 20px rgba(0, 120, 212, 0.15)',
        'primary-glow-hover': '0 0 30px rgba(0, 120, 212, 0.25)',
        'glass': '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-in',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      minHeight: {
        'touch': '44px',
        'screen-safe': '100dvh',
      },
      minWidth: {
        'touch': '44px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(250px, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
};
