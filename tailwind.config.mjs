/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          accent: '#ff3b3b',  // Your original great red
          dark: '#141414',    // Soft, matte onyx gray
          surface: '#1f1f1f', // Distinctly lighter gray for the cards to show depth
        }
      }
    },
  },
  plugins: [],
}