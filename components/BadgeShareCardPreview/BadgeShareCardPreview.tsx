import { Box, CircularProgress } from '@mui/material';
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    generateBadgeShareCard(canvas, data);
    setIsReady(true);
  }, [data]);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 360,
        mx: 'auto',
        borderRadius: 3,
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, rgba(8,24,39,0.9), rgba(15,59,95,0.95))',
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
