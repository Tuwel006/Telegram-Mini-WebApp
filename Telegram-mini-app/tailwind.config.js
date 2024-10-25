/** @type {import('tailwindcss').Config} */
import colors, { red } from 'tailwindcss/colors';
module.exports = {
  content: ["./src/**/*.{html,js,jsx}",],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...colors,
        red: colors.red,
        blue: colors.blue,
      }
    },
  },
  plugins: [],
}