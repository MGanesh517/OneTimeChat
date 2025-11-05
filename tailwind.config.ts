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
        'hacker-green': '#00ff00',
        'hacker-dark': '#0a0a0a',
        'hacker-darker': '#050505',
        'hacker-border': '#00ff0040',
        'hacker-text': '#00ff88',
        'hacker-error': '#ff0040',
        'hacker-warning': '#ffaa00',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 0.3s infinite',
        'pulse-green': 'pulse-green 2s infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 1s infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'pulse-green': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: '#00ff00' },
        },
      },
    },
  },
  plugins: [],
}
export default config

