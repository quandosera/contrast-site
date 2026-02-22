/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // CHANGE THIS LINE to try different colors (Red: #ff3b3b, Purple: #9b51e0)
          accent: '#ff3b3b', 
          dark: '#13111C',
          surface: '#1E1B29',
        }
      }
    },
  },
  plugins: [],
}