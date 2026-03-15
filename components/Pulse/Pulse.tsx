import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';

const pulsing = keyframes`
  0% { transform: scale(0); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0; }
`;

const PulseLoader = styled('div')(({ theme }) => ({
  width: '4em',
  height: '4em',
  borderRadius: '4em',
  backgroundColor: theme.palette.secondary.main,
  outline: '1px solid transparent',
  animation: `${pulsing} 1.2s ease-in-out infinite`,
}));

const Pulse = () => {
  return <PulseLoader />;
};

export default Pulse;
