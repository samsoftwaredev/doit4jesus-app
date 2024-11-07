import { Box, CircularProgress } from '@mui/material';

import Logo from '../Logo';
import styles from './loading.module.scss';

interface Props {
  isFeature?: boolean;
}

const Loading = ({ isFeature = false }: Props) => {
  if (isFeature) {
    return (
      <Box className={styles.featureContainer}>
        <CircularProgress className={styles.featureSpinner} color="secondary" />
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.content}>
        <Logo type="white" />
        <CircularProgress sx={{ px: '1em' }} color="secondary" />
      </Box>
    </Box>
  );
};

export default Loading;
