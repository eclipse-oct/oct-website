/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        richBlack: '#020E22',
        columbiaBlue: '#CBD3E7',
        eminence: '#643B88',
        brightGray: '#E6EAF4'
      },
      fontFamily: {
        barlow: ['Barlow','sans-serif'],
        urbanist: ['Urbanist','sans-serif']
      },
    },
  },
  plugins: [],
}
