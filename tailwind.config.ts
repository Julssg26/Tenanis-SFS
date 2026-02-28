import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a237e',
          dark: '#141a6b',
          light: '#283593',
        },
        brand: {
          blue: '#1a237e',
          green: '#16a34a',
          pink: '#e91e8c',
        },
      },
      fontFamily: {
        sans: ['var(--font-barlow)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
