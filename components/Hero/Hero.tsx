import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import { NAV_MAIN_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';
import smartPhoneHand from '@/public/assets/images/hero/smartPhoneHand.svg';
import { css } from '@/utils';

import styles from './hero.module.scss';

const Hero = () => {
  const { t } = useLanguageContext();
  return (
    <section className={styles.content} aria-labelledby="hero-title">
      <Container
        maxWidth={false}
        className={styles.container}
        component="div"
        role="banner"
      >
        <Box className={styles.header}>
          <Typography
            id="hero-title"
            component="h1"
            variant="h3" // Use Material-UI's responsive typography
            className={css(styles.title, 'sectionTitle')}
          >
            {t.heroTitle}
          </Typography>
          <Typography
            mb={2}
            component="p"
            variant="body1" // Use responsive body text
            className={css(styles.subTitle, 'sectionSubTitle')}
          >
            {t.headline}
          </Typography>
          <Link
            style={{ padding: '1em 0' }}
            passHref
            href={NAV_MAIN_LINKS.signup.link}
          >
            <Button
              className={styles.cta}
              variant="contained"
              size="large"
              aria-label={t.heroCTA}
            >
              {t.heroCTA}
            </Button>
          </Link>
        </Box>
        <Image
          className={styles.image}
          src={smartPhoneHand}
          alt={'Hand holding phone'}
          priority
        />
      </Container>
      <div className={styles.imageBottomGradient} aria-hidden="true" />
    </section>
  );
};

export default Hero;
