import { Button, Container, Typography } from '@mui/material';
import Link from 'next/link';

import { NAV_MAIN_LINKS } from '@/constants/nav';

import styles from './callToAction.module.scss';

const CallToAction = () => {
  return (
    <Container maxWidth="md" className={styles.container}>
      <Typography pb={5} component="h2" className={styles.title}>
        Start praying with others today!
      </Typography>
      <Link passHref href={NAV_MAIN_LINKS.signup.link}>
        <Button
          size="large"
          color="secondary"
          variant="contained"
          aria-label="Sign up for free to start praying with others"
        >
          Sign Up For Free
        </Button>
      </Link>
    </Container>
  );
};

export default CallToAction;
