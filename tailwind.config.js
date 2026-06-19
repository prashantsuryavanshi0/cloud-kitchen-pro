/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#FFB627',
        darkbg: '#0F172A',
        light: '#FFFFFF',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(255, 107, 53, 0.18)',
        glow: '0 0 60px rgba(255, 182, 39, 0.18)',
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top, rgba(255,107,53,0.14), transparent 35%), radial-gradient(circle at bottom right, rgba(255,182,39,0.18), transparent 20%)',
        'accent-radial': 'radial-gradient(circle, rgba(255,107,53,0.18), transparent 55%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite',
        pulseglow: 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 30px rgba(255, 182, 39, 0.28)' },
          '50%': { boxShadow: '0 0 48px rgba(255, 107, 53, 0.42)' },
        },
      },
    },
  },
  plugins: [],
}
