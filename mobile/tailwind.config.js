/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FF5500',
          dark: '#fe6b00',
        },
        surface: {
          DEFAULT: '#F7F7F8',
          dark: '#191c1f',
        },
        ink: {
          DEFAULT: '#2C2C2E',
          dark: '#eff1f5',
        },
      },
    },
  },
};
