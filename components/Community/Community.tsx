import { Box, Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';

import { useLanguageContext } from '@/context/LanguageContext';
import rosary from '@/public/assets/images/rosary.svg';
import { css } from '@/utils';

import styles from './community.module.scss';

const Hero = () => {
  const { t } = useLanguageContext();
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
            {t.aboutRosaryTitle}
          </Typography>
          <Image
            style={{ opacity: 0.4 }}
            src={rosary}
            alt="Illustration of a Rosary"
            priority
          />
          <Box component="div" className={styles.content}>
            <Typography component="p" className={styles.description}>
              {t.aboutRosaryDescription}
            </Typography>
          </Box>
        </Grid>
      </Container>
    </section>
  );
};

export default Hero;
