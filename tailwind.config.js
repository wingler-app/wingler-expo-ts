/** @type {import('tailwindcss').Config} */

const colors = require('./src/styles/colors');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors,
    },
  },
  plugins: [],
};
