import { Box, Typography } from '@mui/material';

import Card from '../Card';
import Logo from '../Logo';
import styles from './ErrorPage.module.scss';

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
    <Box className={styles.container}>
      <Box className={styles.content}>
        <Logo type="white" />
        <Typography my={2}>{text}</Typography>
      </Box>
    </Box>
  );
};

export default ErrorPage;
