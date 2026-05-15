import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#08080e',
        bg2: '#0f0f18',
        bg3: '#14141f',
        surface: '#1a1a27',
        surface2: '#22222f',
        border: '#2a2a3d',
        border2: '#353550',
        amber: { DEFAULT: '#f59e0b', light: '#fbbf24', dim: '#7c4f06' },
        text: { DEFAULT: '#e8e8f0', muted: '#9898b0', subtle: '#5a5a72' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
