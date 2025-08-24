/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0f1e',
        primary: '#00f6ff',
        secondary: '#d900ff',
        third: '#0dd442',
        fourth: '#f50000',
        text: '#e1e1e1',
        error: '#ff4d4d',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        mono: ['Share Tech Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { textShadow: '0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor' },
          to: { textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};