/** @type {import('tailwindcss').Config} */

const colors = require('./src/styles/colors');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors,
      fontFamily: {
        moon: ['Moon-Regular'],
        moonlight: ['Moon-Light'],
        moonbold: ['Moon-Bold'],
      },
    },
  },
  plugins: [],
};
