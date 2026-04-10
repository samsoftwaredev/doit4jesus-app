import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  keyframes,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import Logo from '../Logo';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const FullScreenContainer = styled(Box)(({ theme }) => ({
  zIndex: 1000,
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  animation: `${fadeIn} 0.3s ease-in`,
  '& img': {
    width: '400px',
    margin: '0 20px',
    animation: `${pulse} 2s ease-in-out infinite`,
  },
}));

const CenteredContent = styled(Box)({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const FeatureContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '50px',
  gap: '12px',
});

interface Props {
  isFeature?: boolean;
  description?: string;
}

const Loading = ({ isFeature = false, description }: Props) => {
  const theme = useTheme();

  if (isFeature) {
    return (
      <FeatureContainer>
        <CircularProgress size={32} />
        <Typography variant="body2" color="text.secondary">
          {description || 'Loading...'}
        </Typography>
      </FeatureContainer>
    );
  }

  return (
    <FullScreenContainer>
      <CenteredContent>
        <Logo type={theme.palette.mode === 'dark' ? 'white' : 'black'} />
        <LinearProgress
          sx={{
            width: '80%',
            maxWidth: 320,
            mt: 3,
            borderRadius: 1,
          }}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, textAlign: 'center' }}
        >
          {description || 'Loading...'}
        </Typography>
      </CenteredContent>
    </FullScreenContainer>
  );
};

export default Loading;
