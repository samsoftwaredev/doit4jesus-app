import { Theme, alpha } from '@mui/material/styles';

export const getHeroGradient = (theme: Theme) =>
  theme.palette.mode === 'dark'
    ? `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 30%, ${theme.palette.secondary.light} 100%)`
    : `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.light} 53%, ${theme.palette.background.paper} 100%)`;

export const getHeroBottomFadeGradient = (theme: Theme) =>
  theme.palette.mode === 'dark'
    ? `linear-gradient(180deg, transparent 0%, ${theme.palette.background.default} 90%, ${theme.palette.background.default} 100%)`
    : `linear-gradient(180deg, transparent 0%, ${theme.palette.background.paper} 90%, ${theme.palette.background.paper} 100%)`;

export const getCommunityGradient = (theme: Theme) =>
  theme.palette.mode === 'dark'
    ? `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 20%, ${theme.palette.secondary.dark} 100%)`
    : `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.main} 20%, ${theme.palette.secondary.dark} 100%)`;

export const getWhyPrayGradient = (theme: Theme) =>
  theme.palette.mode === 'dark'
    ? `linear-gradient(180deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.background.default} 80%, ${theme.palette.background.default} 100%)`
    : `linear-gradient(180deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.background.paper} 80%, ${theme.palette.background.paper} 100%)`;

export const getContentTextShadow = (theme: Theme, opacity = 0.5) =>
  `1px 1px 3px ${alpha(theme.palette.common.black, opacity)}`;
