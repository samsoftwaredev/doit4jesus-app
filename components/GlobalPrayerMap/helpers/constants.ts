import type { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

/** Build theme-aware colour tokens for the prayer map. */
export const getMapColors = (theme: Theme) => {
  const isDark = theme.palette.mode === 'dark';
  const p = theme.palette;

  return {
    bgDefault: p.background.default,
    bgPaper: p.background.paper,
    land: isDark ? '#163755' : '#c8dce8',
    landStroke: isDark ? '#1d4569' : '#9bbcd4',
    water: isDark ? p.background.default : '#e8f0f6',
    textPrimary: p.text.primary,
    textSecondary: p.text.secondary,
    textDisabled: p.text.disabled,
    divider: p.divider,
    successLight: p.success.light,
    successMain: p.success.main,
    successDark: p.success.dark,
    glowOuter: alpha(p.success.main, 0.25),
    glowInner: alpha(p.success.light, 0.6),
    choroplethLow: isDark ? '#163755' : '#c8dce8',
    choroplethHigh: p.success.main,
    tooltipBg: isDark ? 'rgba(11,28,43,0.94)' : alpha(p.background.paper, 0.96),
    tooltipBorder: alpha(p.success.main, 0.4),
  };
};

export type MapColors = ReturnType<typeof getMapColors>;

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
