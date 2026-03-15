import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Card from '../Card';
import Logo from '../Logo';

const FullScreenContainer = styled(Box)(({ theme }) => ({
  zIndex: 1000,
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

const CenteredContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  justifyContent: 'center',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  '& img': {
    textAlign: 'center',
    width: '400px',
    margin: '0 20px',
  },
});

interface Props {
  text: string;
  isPage?: boolean;
}

const ErrorPage = ({ text, isPage = false }: Props) => {
  if (isPage === false) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Card>
          <Typography variant="h2" my={2}>
            Error
          </Typography>
          <Typography my={2}>{text}</Typography>
        </Card>
      </Box>
    );
  }

  return (
    <FullScreenContainer>
      <CenteredContent>
        <Logo type="white" />
        <Typography my={2}>{text}</Typography>
      </CenteredContent>
    </FullScreenContainer>
  );
};

export default ErrorPage;
