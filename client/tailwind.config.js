/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        navy: {
          950: '#070C16',
          900: '#0B1220',
          850: '#0E1A2E',
          800: '#122036',
          700: '#182B47',
          600: '#213A5E',
        },
        accent: {
          50: '#EFF9FF',
          100: '#DCF2FE',
          200: '#B8E5FE',
          300: '#7DD2FD',
          400: '#3AB8F8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#036BA1',
        },
        surface: {
          DEFAULT: '#F4F6F9',
          card: '#FFFFFF',
          border: '#E6EAF0',
        },
        ink: {
          900: '#0F172A',
          700: '#334155',
          500: '#64748B',
          400: '#94A3B8',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 8px rgba(15, 23, 42, 0.04)',
        pop: '0 12px 32px rgba(15, 23, 42, 0.14)',
        nav: '1px 0 0 rgba(255,255,255,0.06)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
