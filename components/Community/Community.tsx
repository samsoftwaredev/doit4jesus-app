import { Box, Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';

import rosary from '@/public/assets/images/rosary.svg';
import { css } from '@/utils/helpers';

import styles from './community.module.scss';

const Hero = () => {
  return (
    <div className={styles.container}>
      <Container maxWidth="md">
        <Grid>
          <Typography
            my={5}
            className={css(styles.title, 'sectionTitle')}
            variant="h2"
          >
            About The Rosary
          </Typography>
          <Image style={{ opacity: 0.4 }} src={rosary} alt="Rosary" />
          <Box className={styles.content}>
            <Typography className={styles.description}>
              The purpose of the Rosary lies in bringing people together in
              prayer to combat darkness and work towards the salvation of souls.
            </Typography>
            <Typography className={styles.description}>
              The Mother of God, in an apparition to Santo Domingo, taught him
              to pray the Rosary, in the year 1208. She told him to spread this
              devotion and use it as a powerful weapon against the enemies of
              the Faith.
            </Typography>
          </Box>
        </Grid>
      </Container>
    </div>
  );
};

export default Hero;
