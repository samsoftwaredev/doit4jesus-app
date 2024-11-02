import { Button, Container, Typography } from '@mui/material';
import Link from 'next/link';

import { NAV_MAIN_LINKS } from '@/constants/nav';

import styles from './callToAction.module.scss';

const WhyPrayRosary = () => {
  return (
    <Container maxWidth="md" className={styles.container}>
      <Typography pb={5} component="h1" className={styles.title}>
        Start praying with others today!
      </Typography>
      <Link passHref href={NAV_MAIN_LINKS.signup.link}>
        <Button size="large" color="secondary" variant="contained">
          Sign Up For Free
        </Button>
      </Link>
    </Container>
  );
};

export default WhyPrayRosary;
