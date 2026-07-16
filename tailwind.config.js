/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'luxury-black': '#0B0B0B',
        'luxury-gold': '#D4AF37',
        'luxury-gold-light': '#F0D060',
        'luxury-gold-dark': '#A88A1A',
        'luxury-maroon': '#5B0A1A',
        'luxury-maroon-light': '#8B1A2A',
        'luxury-cream': '#F8F8F8',
      },
      fontFamily: {
        'heading': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'body': ['"Poppins"', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #A88A1A 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0B0B0B 0%, #1a0a0a 100%)',
        'hero-gradient': 'linear-gradient(to bottom, rgba(11,11,11,0.7) 0%, rgba(91,10,26,0.4) 50%, rgba(11,11,11,0.9) 100%)',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '108': '1.08',
        '110': '1.10',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'spark': 'spark 1.5s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { textShadow: '0 0 10px #D4AF37, 0 0 20px #D4AF37' },
          'to': { textShadow: '0 0 20px #D4AF37, 0 0 40px #D4AF37, 0 0 60px #D4AF37' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        spark: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)' },
        },
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 0 40px rgba(212, 175, 55, 0.5)',
        'luxury': '0 25px 50px rgba(0, 0, 0, 0.6)',
        'card': '0 10px 40px rgba(0, 0, 0, 0.4)',
      },
      maxHeight: {
        '0': '0px',
        '20': '5rem',
      },
    },
  },
  plugins: [],
}
