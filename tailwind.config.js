/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        surface: '#FFF7ED',
      },
      borderRadius: {
        clay: '20px',
      },
      boxShadow: {
        clay: '0 4px 0 0 rgba(0,0,0,0.12), 0 8px 24px rgba(249,115,22,0.12)',
        'clay-sm': '0 2px 0 0 rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)',
        'clay-blue': '0 4px 0 0 rgba(37,99,235,0.3), 0 8px 24px rgba(37,99,235,0.15)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
