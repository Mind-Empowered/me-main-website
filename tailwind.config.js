/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    colors: {
      'glass-white': 'rgba(255, 255, 255, 0.2)',
    },
    backdropFilter: {
      blur: 'blur(10px)',
    },
    boxShadow: {
      glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
    },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [
    require('tailwindcss-filters'),
  ],
}