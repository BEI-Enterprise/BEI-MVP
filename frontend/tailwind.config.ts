import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bei-black': '#050505',
        'bei-dark': '#0a0a0a',
        'bei-card': '#111111',
        'bei-border': '#1a1a1a',
        'bei-gold': '#C8A24A',
        'bei-gold-light': '#d4af62',
        'bei-gold-dim': '#8a6e32',
        'bei-text': '#ffffff',
        'bei-muted': '#888888',
        'bei-subtle': '#444444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
