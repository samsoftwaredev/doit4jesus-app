import { Button, Container, Typography } from '@mui/material';
import Link from 'next/link';

import { NAV_MAIN_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';

import styles from './callToAction.module.scss';

const CallToAction = () => {
  const { t } = useLanguageContext();
  return (
    <Container maxWidth="md" className={styles.container}>
      <Typography pb={5} component="h2" className={styles.title}>
        {t.footerCTA}
      </Typography>
      <Link passHref href={NAV_MAIN_LINKS.signup.link}>
        <Button
          size="large"
          color="secondary"
          variant="contained"
          aria-label="Sign up for free to start praying with others"
        >
          {t.signUp}
        </Button>
      </Link>
    </Container>
  );
};

export default CallToAction;
