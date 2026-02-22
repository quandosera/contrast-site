/** @type {import('tailwindcss').Config} */
export default {
  // This 'content' array is the most important part. 
  // It tells Tailwind to look at every file in your src folder.
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // You can add your brand colors here if you want to use them as Tailwind classes
      colors: {
        brand: {
          purple: '#9b51e0',
          dark: '#13111C',
          surface: '#1E1B29',
        }
      }
    },
  },
  plugins: [],
}