import { Box, CircularProgress } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import {
  type ShareCardData,
  generateShareCard,
} from '@/utils/shareCardGenerator';

interface Props {
  data: ShareCardData;
}

const ShareCardPreview = ({ data }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    generateShareCard(canvas, data);
    setIsReady(true);
  }, [data]);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        mx: 'auto',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        position: 'relative',
      }}
    >
      {!isReady && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CircularProgress sx={{ color: '#ffd700' }} />
        </Box>
      )}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
      />
    </Box>
  );
};

export default ShareCardPreview;
