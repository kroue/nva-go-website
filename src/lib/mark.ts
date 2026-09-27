/**
 * The ink-drop mark from the NVA logo: a cyan drop sitting on stacked
 * magenta, yellow and black layers. Used for the favicon and app icons.
 */
const LAYERS = [
  { dy: 15, fill: '#141414' },
  { dy: 10, fill: '#FFC400' },
  { dy: 5, fill: '#FF00CC' },
];
const DROP = 'M20 1C20 1 6 18.5 6 27.5a14 14 0 0 0 28 0C34 18.5 20 1 20 1z';

export const markSvg = ({ size = 64, background }: { size?: number; background?: string } = {}) => {
  // Drop spans x 6–34, y 1–56.5 (with layers). Square canvas centred on it.
  const vb = background ? '-10 -4.5 60 66' : '-8 0 56 57';
  const bg = background ? `<rect x="-10" y="-4.5" width="60" height="66" fill="${background}"/>` : '';
  const layers = LAYERS.map((l) => `<ellipse cx="20" cy="${27.5 + l.dy}" rx="14" ry="14" fill="${l.fill}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${vb}">${bg}${layers}<path d="${DROP}" fill="#00E5F5"/></svg>`;
};
