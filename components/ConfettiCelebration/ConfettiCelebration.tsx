import Confetti from 'react-confetti';

function getPageDimensions() {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  return { width, height };
}

const ConfettiCelebration = () => {
  const { width, height } = getPageDimensions();
  return (
    <Confetti
      style={{ zIndex: 1100, position: 'fixed' }}
      width={width}
      height={height}
      confettiSource={{ x: width / 2, y: height / 2, w: 10, h: 10 }}
      recycle={false}
      numberOfPieces={200}
      gravity={0.1}
    />
  );
};

export default ConfettiCelebration;
