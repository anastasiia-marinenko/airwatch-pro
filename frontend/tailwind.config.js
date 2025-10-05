/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          800: '#1e293b',
          900: '#0f172a',
        },
        purple: {
          400: '#c084fc',
          500: '#a855f7',
          900: '#581c87',
        },
        pink: {
          500: '#ec4899',
        }
      }
    },
  },
  plugins: [],
}