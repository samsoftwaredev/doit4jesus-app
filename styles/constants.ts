export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
  tablet: 768,
  desktop: 1024,
} as const;

export const colors = {
  backgroundDark: '#0b1c2b',
  primaryLight: '#00bcd4',
  primaryMain: '#163755',
  secondaryMain: '#e8d1cb',
  warningLight: '#955f27',
  warningMain: '#ff9800',
  warningDark: '#844d42',
  errorLight: '#c09397',
  errorMain: '#b47a84',
  errorDark: '#9f4435',
  successLight: '#a69540',
  successMain: '#009688',
  black: '#000000',
  white: '#ffffff',
  dark: '#71706a',
  gray: '#cfcec7',
  light: '#f3f2eb',
} as const;

export const sizes = {
  borderRadius: '10px',
  sideNavWidth: '250px',
} as const;

export const media = {
  tablet: `@media (min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.desktop}px)`,
} as const;
