/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line is crucial. It tells Tailwind to scan all .js, .ts, .jsx, and .tsx files inside the src folder.
  ],
  safelist: [
    'font-size-small',
    'font-size-normal',
    'font-size-large',
    'font-size-xlarge',
    // You can also use regular expressions for patterns
    // { pattern: /bg-(red|green|blue)-(100|500)/ },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}