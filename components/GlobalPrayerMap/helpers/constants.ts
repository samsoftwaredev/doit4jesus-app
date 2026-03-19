/** Theme-aligned colour tokens for the prayer map. */
export const MAP_COLORS = {
  bgDefault: '#0b1c2b',
  bgPaper: '#163755',
  land: '#163755',
  landStroke: '#1d4569',
  water: '#0b1c2b',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.7)',
  textDisabled: 'rgba(255,255,255,0.5)',
  divider: 'rgba(255,255,255,0.12)',
  successLight: '#81c784',
  successMain: '#4caf50',
  successDark: '#388e3c',
  glowOuter: 'rgba(76,175,80,0.25)',
  glowInner: 'rgba(129,199,132,0.6)',
  choroplethLow: '#163755',
  choroplethHigh: '#4caf50',
  tooltipBg: 'rgba(11,28,43,0.94)',
  tooltipBorder: 'rgba(76,175,80,0.4)',
} as const;

/** Base SVG viewBox dimensions (used by the projection fitter). */
export const MAP_WIDTH = 960;
export const MAP_HEIGHT = 500;

/** Marker radius range [min, max] in SVG units. */
export const MARKER_RADIUS = { min: 3.5, max: 20 } as const;

/** Animation durations (ms). */
export const ANIM = {
  pulseMs: 2400,
  transitionMs: 600,
} as const;
