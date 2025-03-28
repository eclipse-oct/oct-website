/** @type {import('tailwindcss').Config} */
const baseConfig = require('../tailwind/base.tailwind.config')

module.exports = {
    ...baseConfig,
    content: [
        './layouts/**/*.html',
        './content/**/*.html',
        './themes/hugo-geekdoc/layouts/**/*.html'
    ]
}