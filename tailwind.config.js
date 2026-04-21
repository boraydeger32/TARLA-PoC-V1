import flowbitePlugin from 'flowbite/plugin';
import { colors } from './src/theme/colors.js';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{html,js}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      transitionProperty: {
        width: 'width',
      },
    },
  },
  plugins: [flowbitePlugin],
};
