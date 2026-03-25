/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef1f8',
          100: '#d0d8ec',
          200: '#a1b1d9',
          300: '#7289c6',
          400: '#4361b3',
          500: '#1a2744',
          600: '#162039',
          700: '#11192e',
          800: '#0d1223',
          900: '#080b18',
        },
        gold: {
          50:  '#fdf8ec',
          100: '#f9edcc',
          200: '#f3d999',
          300: '#edc566',
          400: '#e7b133',
          500: '#c9a84c',
          600: '#a8882a',
          700: '#876820',
          800: '#664816',
          900: '#45280c',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}