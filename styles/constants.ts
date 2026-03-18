export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
  tablet: 768,
  desktop: 1024,
} as const;

export const sizes = {
  borderRadius: '10px',
  sideNavWidth: '250px',
} as const;

export const media = {
  tablet: `@media (min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.desktop}px)`,
} as const;
