import { Box, Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';

import rosary from '@/public/assets/images/rosary.svg';
import { css } from '@/utils/helpers';

import styles from './rosaryWeapon.module.scss';

const RosaryWeapon = () => {
  return (
    <div className={styles.container}>
      <Container maxWidth="md">
        <Grid>
          <Typography
            my={5}
            className={css(styles.title, 'sectionTitle')}
            variant="h2"
          >
            Become A Soldier
          </Typography>
          <Image style={{ opacity: 0.4 }} src={rosary} alt="Rosary" />
          <Box className={styles.content}>
            <iframe
              style={{ width: '100%', height: '100%' }}
              src="https://www.youtube-nocookie.com/embed/x1tH_zQ-Cz0?si=0lnC4o44EfJRf-Cu"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
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

export default RosaryWeapon;
