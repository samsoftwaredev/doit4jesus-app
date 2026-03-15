import styled from '@emotion/styled';
import { Box, CircularProgress } from '@mui/material';

import Logo from '../Logo';

const FullScreenContainer = styled(Box)({
  zIndex: 1000,
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundColor: '#163755',
  '& img': {
    width: '400px',
    margin: '0 20px',
  },
});

const CenteredContent = styled(Box)({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});

const FeatureContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '50px',
});

interface Props {
  isFeature?: boolean;
}

const Loading = ({ isFeature = false }: Props) => {
  if (isFeature) {
    return (
      <FeatureContainer>
        <CircularProgress color="secondary" />
      </FeatureContainer>
    );
  }

  return (
    <FullScreenContainer>
      <CenteredContent>
        <Logo type="white" />
        <CircularProgress sx={{ px: '1em' }} color="secondary" />
      </CenteredContent>
    </FullScreenContainer>
  );
};

export default Loading;
