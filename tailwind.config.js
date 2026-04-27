// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   darkMode: 'class',
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           50:  '#eef2ff',
//           100: '#e0e7ff',
//           500: '#6366f1',
//           600: '#4f46e5',
//           700: '#4338ca',
//         }
//       }
//     },
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5b8fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark:    '#0f172a',
        },
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-aurora':  'linear-gradient(135deg, #f093fb 0%, #f5576c 25%, #4facfe 75%, #00f2fe 100%)',
        'gradient-glass':   'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      },
      animation: {
        'fade-in':       'fadeIn 0.4s ease-out',
        'fade-up':       'fadeUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right':'slideInRight 0.3s ease-out',
        'scale-in':      'scaleIn 0.3s ease-out',
        'bounce-in':     'bounceIn 0.6s cubic-bezier(0.36,0.07,0.19,0.97)',
        'pulse-glow':    'pulseGlow 2s ease-in-out infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'float':         'float 3s ease-in-out infinite',
        'spin-slow':     'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn:      { from: { opacity: '0' },                          to: { opacity: '1' } },
        fadeUp:      { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft: { from: { transform: 'translateX(-100%)' },        to: { transform: 'translateX(0)' } },
        slideInRight:{ from: { transform: 'translateX(100%)' },         to: { transform: 'translateX(0)' } },
        scaleIn:     { from: { opacity: '0', transform: 'scale(0.9)' }, to: { opacity: '1', transform: 'scale(1)' } },
        bounceIn:    { '0%': { transform: 'scale(0.8)', opacity: '0' }, '60%': { transform: 'scale(1.05)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        pulseGlow:   { '0%,100%': { boxShadow: '0 0 5px rgba(99,102,241,0.4)' }, '50%': { boxShadow: '0 0 20px rgba(99,102,241,0.8), 0 0 40px rgba(99,102,241,0.3)' } },
        shimmer:     { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:       { '0%,100%': { transform: 'translateY(0px)' },     '50%': { transform: 'translateY(-6px)' } },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'glow':      '0 0 15px rgba(99,102,241,0.4)',
        'glow-lg':   '0 0 30px rgba(99,102,241,0.5)',
        'glass':     '0 8px 32px 0 rgba(31,38,135,0.15)',
        'card':      '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
        'card-hover':'0 20px 40px -8px rgba(0,0,0,0.12), 0 8px 16px -4px rgba(0,0,0,0.08)',
        'inner-glow':'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
};