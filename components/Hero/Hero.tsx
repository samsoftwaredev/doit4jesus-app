import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import { NAV_MAIN_LINKS } from '@/constants/nav';
import smartPhoneHand from '@/public/assets/images/hero/smartPhoneHand.svg';
import { css } from '@/utils';

import styles from './hero.module.scss';

const Hero = () => {
  return (
    <div className={styles.content}>
      <Container maxWidth={false} className={styles.container}>
        <Box className={styles.header}>
          <Typography
            component="h1"
            className={css(styles.title, 'sectionTitle')}
          >
            Find Peace In The Rosary
          </Typography>
          <Typography
            mb={2}
            component="h5"
            className={css(styles.subTitle, 'sectionSubTitle')}
          >
            Pray with millions around the world and multiply your blessings
          </Typography>
          <Link
            style={{ padding: '1em 0' }}
            passHref
            href={NAV_MAIN_LINKS.signup.link}
          >
            <Button className={styles.cta} variant="contained" size="large">
              Start Today
            </Button>
          </Link>
        </Box>
        <Image
          className={styles.image}
          src={smartPhoneHand}
          alt="Hand holding phone"
        />
      </Container>
      <div className={styles.imageBottomGradient} />
    </div>
  );
};

export default Hero;
