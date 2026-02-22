import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import markdoc from '@astrojs/markdoc';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // In Astro 5, 'static' is the default and it handles Keystatic's 
  // server routes automatically without needing the 'hybrid' flag.
  adapter: vercel(),

  integrations: [
    react(), 
    markdoc(), 
    keystatic()
  ],
});