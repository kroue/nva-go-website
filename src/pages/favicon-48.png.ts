import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { markSvg } from '../lib/mark';

export const GET: APIRoute = async () => {
  const png = await sharp(Buffer.from(markSvg({ size: 48 }))).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
