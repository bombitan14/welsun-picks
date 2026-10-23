/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#080b14',
          900: '#0b1020',
          800: '#111830',
          700: '#1a2342',
          600: '#243056',
        },
        brand: {
          red: '#e11d48',
          'red-dark': '#be123c',
          'red-light': '#fb7185',
          gold: '#f59e0b',
          'gold-dark': '#d97706',
          'gold-light': '#fbbf24',
        },
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(225,29,72,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(225,29,72,0.5)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.8s ease-out both',
        'slide-down': 'slide-down 0.3s ease-out both',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
