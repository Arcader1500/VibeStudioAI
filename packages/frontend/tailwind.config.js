/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // VibeStudio brand palette
        brand: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c3d5fe',
          300: '#9ab4fd',
          400: '#7090fb',
          500: '#4f6ef7',   // primary
          600: '#3a4fe3',
          700: '#2e3dc9',
          800: '#2733a1',
          900: '#263080',
          950: '#1a1f52',
        },
        surface: {
          900: '#0d0e14',
          800: '#12141f',
          700: '#191b28',
          600: '#1f2234',
          500: '#252840',
          400: '#2e3250',
        },
        accent: {
          purple: '#a855f7',
          cyan:   '#22d3ee',
          green:  '#4ade80',
          amber:  '#fbbf24',
          red:    '#f87171',
        },
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up':     'slideUp 0.4s ease-out',
        'fade-in':      'fadeIn 0.3s ease-out',
        'glow':         'glow 2s ease-in-out infinite alternate',
        'shimmer':      'shimmer 1.5s infinite',
        'spin-slow':    'spin 3s linear infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 5px rgba(79,110,247,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(79,110,247,0.8), 0 0 40px rgba(79,110,247,0.3)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='g' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23ffffff08' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [],
}
