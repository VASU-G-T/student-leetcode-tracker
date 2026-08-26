/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0b0f17',
          850: '#0f172a',
          800: '#111827',
          750: '#182234',
          700: '#1e293b',
          600: '#334155',
          500: '#475569',
        },
        leetcode: {
          easy: '#00b8a3',
          easyBg: 'rgba(0, 184, 163, 0.12)',
          medium: '#ffc01e',
          mediumBg: 'rgba(255, 192, 30, 0.12)',
          hard: '#ff375f',
          hardBg: 'rgba(255, 55, 95, 0.12)',
          brand: '#ffa116',
        },
        github: {
          dark: '#0d1117',
          border: '#30363d',
          green: '#238636',
          purple: '#8957e5',
          blue: '#58a6ff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
