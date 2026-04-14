import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          900: '#581c87',
        },
        hot:  '#ef4444',
        good: '#22c55e',
        skip: '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
