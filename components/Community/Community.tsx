import { Box, Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';

import rosary from '@/public/assets/images/rosary.svg';
import { css } from '@/utils/helpers';

import styles from './community.module.scss';

const Hero = () => {
  return (
    <section className={styles.container}>
      <Container component="div" maxWidth="md">
        <Grid component="div">
          <Typography
            component="h2"
            my={5}
            className={css(styles.title, 'sectionTitle')}
            variant="h2"
          >
            About The Rosary
          </Typography>
          <Image
            style={{ opacity: 0.4 }}
            src={rosary}
            alt="Illustration of a Rosary"
            priority
          />
          <Box component="div" className={styles.content}>
            <Typography component="p" className={styles.description}>
              The purpose of the Rosary lies in bringing people together in
              prayer to combat darkness and work towards the salvation of souls.
            </Typography>
            <Typography component="p" className={styles.description}>
              The Mother of God, in an apparition to Santo Domingo, taught him
              to pray the Rosary, in the year 1208. She told him to spread this
              devotion and use it as a powerful weapon against the enemies of
              the Faith.
            </Typography>
          </Box>
        </Grid>
      </Container>
    </section>
  );
};

export default Hero;
