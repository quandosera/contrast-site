import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import markdoc from '@astrojs/markdoc';
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // SWITCHING TO SERVER MODE:
  // This is required so that server-side logic (like the Astro.redirect
  // check in your Layout frontmatter) runs on every single visit, 
  // instead of only running once when the site is built.
  output: 'server',

  // The Vercel adapter handles turning the SSR app into 
  // Vercel Serverless functions automatically.
  adapter: vercel(),

  integrations: [
    tailwind(), // Standard Astro-Tailwind integration
    react(), 
    markdoc(), 
    keystatic()
  ],
});