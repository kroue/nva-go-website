import type { APIRoute } from 'astro';
import { markSvg } from '../lib/mark';

export const GET: APIRoute = () =>
  new Response(markSvg({ size: 64 }), { headers: { 'Content-Type': 'image/svg+xml' } });
