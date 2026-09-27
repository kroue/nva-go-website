import { defineConfig, envField, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { SITE_URL } from './src/config/site';

const fs = (file: string) => `./node_modules/${file}`;

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  adapter: vercel({
    // Remote and local photos are resized and served as AVIF/WebP by Vercel's image CDN.
    imageService: true,
    imagesConfig: {
      sizes: [320, 480, 640, 828, 1080, 1200, 1600],
      formats: ['image/avif', 'image/webp'],
      domains: ['images.unsplash.com'],
      minimumCacheTTL: 60 * 60 * 24 * 30,
    },
  }),
  image: {
    domains: ['images.unsplash.com'],
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/quote/sent'),
    }),
  ],
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      QUOTE_TO_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      QUOTE_FROM_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  // Self-hosted fonts (from Fontsource packages). Astro generates metric-matched
  // fallbacks so text doesn't jump when the web font swaps in.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Archivo Black',
      cssVariable: '--font-archivo',
      fallbacks: ['Arial Black', 'Arial', 'sans-serif'],
      options: {
        variants: [
          { src: [fs('@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff2')], weight: 400, style: 'normal' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Cormorant SC',
      cssVariable: '--font-cormorant',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          { src: [fs('@fontsource/cormorant-sc/files/cormorant-sc-latin-600-normal.woff2')], weight: 600, style: 'normal' },
          { src: [fs('@fontsource/cormorant-sc/files/cormorant-sc-latin-700-normal.woff2')], weight: 700, style: 'normal' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Figtree',
      cssVariable: '--font-figtree',
      fallbacks: ['Arial', 'sans-serif'],
      options: {
        variants: [
          { src: [fs('@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2')], weight: '300 900', style: 'normal' },
        ],
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
