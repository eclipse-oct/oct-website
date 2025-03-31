/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')
const baseConfig = require('../tailwind/base.tailwind.config')

export default {
  ...baseConfig,
  content: ['./index.html', './src/**/*.{mjs,js,ts,jsx,tsx}'],
}
