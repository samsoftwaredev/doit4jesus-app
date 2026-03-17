import { Box, CircularProgress } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';

import {
  type BadgeShareCardData,
  generateBadgeShareCard,
} from '@/utils/badgeShareCardGenerator';

interface Props {
  data: BadgeShareCardData;
}

const BadgeShareCardPreview = ({ data }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    generateBadgeShareCard(canvas, {
      ...data,
      colors: {
        backgroundStart:
          data.colors?.backgroundStart ?? theme.palette.background.default,
        backgroundMid: data.colors?.backgroundMid ?? theme.palette.primary.dark,
        backgroundEnd: data.colors?.backgroundEnd ?? theme.palette.gold.dark,
        halo: data.colors?.halo ?? alpha(theme.palette.gold.light, 0.75),
        shapeOverlay:
          data.colors?.shapeOverlay ??
          alpha(
            theme.palette.common.white,
            theme.palette.mode === 'dark' ? 0.08 : 0.18,
          ),
        border:
          data.colors?.border ??
          alpha(
            theme.palette.common.white,
            theme.palette.mode === 'dark' ? 0.24 : 0.3,
          ),
        accent: data.colors?.accent ?? theme.palette.gold.light,
        title: data.colors?.title ?? theme.palette.common.white,
        body:
          data.colors?.body ??
          alpha(
            theme.palette.common.white,
            theme.palette.mode === 'dark' ? 0.9 : 0.95,
          ),
        muted:
          data.colors?.muted ??
          alpha(
            theme.palette.common.white,
            theme.palette.mode === 'dark' ? 0.72 : 0.84,
          ),
        panel:
          data.colors?.panel ??
          alpha(
            theme.palette.background.default,
            theme.palette.mode === 'dark' ? 0.28 : 0.42,
          ),
        panelStrong:
          data.colors?.panelStrong ??
          alpha(
            theme.palette.background.default,
            theme.palette.mode === 'dark' ? 0.72 : 0.8,
          ),
      },
    });
    setIsReady(true);
  }, [data, theme]);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 360,
        mx: 'auto',
        borderRadius: 3,
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${alpha(
          theme.palette.background.default,
          0.96,
        )}, ${alpha(theme.palette.primary.dark, 0.96)})`,
        boxShadow: '0 18px 50px rgba(6, 16, 28, 0.4)',
        position: 'relative',
      }}
    >
      {!isReady && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
        }}
      />
    </Box>
  );
};

export default BadgeShareCardPreview;
