import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'pal-dark': '#0a1628',
        'pal-darker': '#060d1a',
        'pal-primary': '#1e3a5f',
        'pal-secondary': '#2d5a87',
        'pal-accent': '#00d4ff',
        'pal-accent-glow': '#00d4ff40',
        'pal-text': '#e8f4f8',
        'pal-text-muted': '#8fa8bc',
        'pal-border': '#1e3a5f',
        'pal-card': '#112240',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};
