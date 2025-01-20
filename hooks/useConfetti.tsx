import { Box } from '@mui/material';
import Confetti from 'react-confetti';

function getPageDimensions() {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  return { width, height };
}

const useConfetti = (showConfetti: boolean) => {
  const { width, height } = getPageDimensions();
  return (
    showConfetti && (
      <Confetti
        style={{ zIndex: 1100, position: 'fixed' }}
        width={width}
        height={height}
        recycle={true}
        numberOfPieces={200}
        gravity={0.1}
      />
    )
  );
};

export default useConfetti;
