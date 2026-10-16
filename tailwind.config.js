/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sole: {
          50: '#faf7f2',
          100: '#f4ede1',
          200: '#e8d9c2',
          300: '#d7be9b',
          400: '#c59f72',
          500: '#ba8551',
          600: '#ad6f44',
          700: '#905639',
          800: '#754633',
          900: '#603a2c',
          950: '#341d16',
        },
      },
    },
  },
  plugins: [],
}
