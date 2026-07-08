import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('tailwindcss').Config} */
export default {
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
        'pal-bg': '#f5f5f5',
        'pal-surface': '#ffffff',
        'pal-muted': '#fafafa',
        'pal-text': '#363636',
        'pal-text-muted': '#7a7a7a',
        'pal-border': '#dbdbdb',
        'pal-accent': '#3273dc',
        'pal-accent-hover': '#2366d1',
      },
    },
  },
  plugins: [],
};
