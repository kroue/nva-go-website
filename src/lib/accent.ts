import type { Accent } from '../data/products';

/** Per-accent class sets. Text classes are the AA-safe shades. */
export const accentText: Record<Accent, string> = {
  cyan: 'text-cyan-ink',
  magenta: 'text-magenta-ink',
  yellow: 'text-ink',
  ink: 'text-ink',
};
export const accentFill: Record<Accent, string> = {
  cyan: 'bg-cyan',
  magenta: 'bg-magenta',
  yellow: 'bg-yellow',
  ink: 'bg-ink',
};
export const accentBorder: Record<Accent, string> = {
  cyan: 'border-cyan',
  magenta: 'border-magenta',
  yellow: 'border-yellow',
  ink: 'border-ink',
};
export const accentTint: Record<Accent, string> = {
  cyan: 'bg-cyan-tint',
  magenta: 'bg-magenta-tint',
  yellow: 'bg-yellow-tint',
  ink: 'bg-offwhite',
};
