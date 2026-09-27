/** The ink-drop logo mark as an SVG string, shared by the favicon and generated icons. */
const DROP = 'M20 1.5C20 1.5 3 21.2 3 33.6a17 17 0 0 0 34 0C37 21.2 20 1.5 20 1.5z';
const SHINE = 'M11.5 34a8.5 8.5 0 0 0 6 8';
const GRADIENT =
  '<defs><linearGradient id="g" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="#00AEEF"/><stop offset="0.55" stop-color="#EC008C"/><stop offset="1" stop-color="#FFD400"/></linearGradient></defs>';

export const markSvg = ({ size = 64, background }: { size?: number; background?: string } = {}) => {
  // Padded square canvas when a background is used (app icons), tight square otherwise (favicon).
  const vb = background ? '-16 -10 72 72' : '-6 0 52 52';
  const bg = background ? `<rect x="-16" y="-10" width="72" height="72" fill="${background}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${vb}">${GRADIENT}${bg}<path d="${DROP}" fill="url(#g)"/><path d="${SHINE}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/></svg>`;
};
