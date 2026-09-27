import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/site';

// Crawling stays allowed even in DEMO_MODE so search engines can see the noindex tag on each page.
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${new URL('/sitemap-index.xml', SITE_URL).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
