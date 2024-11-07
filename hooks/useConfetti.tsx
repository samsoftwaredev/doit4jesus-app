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
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.2}
      />
    )
  );
};

export default useConfetti;
