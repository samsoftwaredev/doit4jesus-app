import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    gold: Palette['primary'];
  }
  interface PaletteOptions {
    gold?: PaletteOptions['primary'];
  }
}

const getTheme = (mode: 'light' | 'dark') => {
  const lightPalette = {
    mode: 'light' as const,
    primary: {
      light: '#4a7694',
      main: '#163755',
      dark: '#0d2539',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#d4b2a6',
      main: '#aa8a82',
      dark: '#7e625b',
      contrastText: '#000000',
    },
    warning: {
      light: '#ffb74d',
      main: '#ff9800',
      dark: '#f57c00',
      contrastText: '#ffffff',
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#ffffff',
    },
    info: {
      light: '#64b5f6',
      main: '#2196f3',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    success: {
      light: '#81c784',
      main: '#4caf50',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    gold: {
      light: '#ffed4a',
      main: '#ffd700',
      dark: '#b8960b',
      contrastText: '#163755',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  };

  const darkPalette = {
    mode: 'dark' as const,
    primary: {
      light: '#64b5f6',
      main: '#42a5f5',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#f5e6e0',
      main: '#E8D1CB',
      dark: '#c5a89f',
      contrastText: '#000000',
    },
    warning: {
      light: '#ffb74d',
      main: '#ff9800',
      dark: '#f57c00',
      contrastText: '#ffffff',
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#ffffff',
    },
    info: {
      light: '#64b5f6',
      main: '#2196f3',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    success: {
      light: '#81c784',
      main: '#4caf50',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    gold: {
      light: '#ffed4a',
      main: '#ffd700',
      dark: '#b8960b',
      contrastText: '#0b1c2b',
    },
    background: {
      default: '#0b1c2b',
      paper: '#163755',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  };

  const palette = mode === 'light' ? lightPalette : darkPalette;

  return createTheme({
    palette,
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: '50px',
            padding: '10px 24px',
            fontWeight: 600,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          outlined: {
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
            },
          },
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            borderRadius: 12,
            border:
              mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.12)'
                : '1px solid rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            whiteSpace: 'pre-line',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 12,
          },
        },
      },
    },
  });
};

export const theme = getTheme('dark');
export { getTheme };
