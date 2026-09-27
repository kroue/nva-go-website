/**
 * Generates the 1200×630 Open Graph / Twitter card image at build time.
 * Fonts are read from the Fontsource packages (satori needs WOFF/TTF, not WOFF2).
 */
import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { site } from '../config/site';

type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

const font = (file: string) => readFile(join(process.cwd(), 'node_modules', file));

export const GET: APIRoute = async () => {
  const [archivo, cormorant] = await Promise.all([
    font('@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff'),
    font('@fontsource/cormorant-sc/files/cormorant-sc-latin-700-normal.woff'),
  ]);

  const logoPng = await readFile(join(process.cwd(), 'src/assets/logo-transparent.png'));
  const logo = `data:image/png;base64,${logoPng.toString('base64')}`;
  const dots = `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><circle cx="9" cy="9" r="2.2" fill="#EC008C" fill-opacity="0.22"/></svg>`,
  ).toString('base64')}`;

  const tree = h(
    'div',
    { width: 1200, height: 630, display: 'flex', flexDirection: 'column', background: '#FFFFFF', position: 'relative', fontFamily: 'Archivo' },
    [
      h('div', { position: 'absolute', top: 0, right: 0, width: 560, height: 630, backgroundImage: `url(${dots})`, backgroundRepeat: 'repeat', display: 'flex' }),
      h('div', { display: 'flex', height: 14, width: '100%' }, [
        h('div', { flex: 1, background: '#00AEEF' }),
        h('div', { flex: 1, background: '#EC008C' }),
        h('div', { flex: 1, background: '#FFD400' }),
        h('div', { flex: 1, background: '#141414' }),
      ]),
      h('div', { display: 'flex', flex: 1, padding: '44px 72px 40px', alignItems: 'center', gap: 56 }, [
        h('div', { display: 'flex', flexDirection: 'column', flex: 1 }, [
          h('img', { width: 272, height: 140 }, undefined, { src: logo, width: 272, height: 140 }),
          h('div', { fontSize: 66, lineHeight: 1.04, color: '#141414', marginTop: 36, letterSpacing: -1, display: 'flex', flexWrap: 'wrap' }, [
            h('span', {}, 'One stop shop for your '),
            h('span', { borderBottom: '10px solid #FF00CC', paddingBottom: 0 }, 'printing'),
            h('span', {}, ' needs.'),
          ]),
          h(
            'div',
            { fontFamily: 'Cormorant', fontSize: 30, color: '#141414', marginTop: 34, letterSpacing: 2 },
            'Tarpaulins · Signage · Custom merch · Corporate giveaways',
          ),
          h('div', { display: 'flex', alignItems: 'center', marginTop: 18, fontSize: 22, color: '#00739E' }, `Divisoria, Cagayan de Oro City  ·  ${site.phone.mobile.label}`),
        ]),
      ]),
      h('div', { display: 'flex', height: 14, width: '100%', backgroundImage: 'linear-gradient(90deg, #00AEEF, #EC008C, #FFD400)' }),
    ],
  );

  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Archivo', data: archivo, weight: 400, style: 'normal' },
      { name: 'Cormorant', data: cormorant, weight: 700, style: 'normal' },
    ],
  });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
