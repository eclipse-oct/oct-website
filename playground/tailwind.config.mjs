/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

export default {
  content: ['./index.html', './src/**/*.{mjs,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      black: colors.black,
      white: colors.white,
      gray: {
        50: '#f9fafb',
        100: '#f4f5f7',
        200: '#e5e7eb',
        300: '#d2d6dc',
        400: '#9fa6b2',
        500: '#6b7280'
      }
    }
  },
  plugins: []
}
