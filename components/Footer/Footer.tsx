import { Button, Container } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { NAV_FOOTER_LINKS, NAV_MAIN_LINKS } from '@/constants';

import Logo from '../Logo/Logo';
import { YouTubeSubscribe } from '../YouTubeVideo';
import styles from './footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Container className={styles.container} maxWidth={false}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.copyRights}>
        &copy; {currentYear} DoIt4Jesus. All rights reserved.
      </div>
      <div className={styles.socialMedia}>
        <YouTubeSubscribe />
      </div>
      <Link passHref href={NAV_FOOTER_LINKS.about.link}>
        <Button className={styles.about}>{NAV_FOOTER_LINKS.about.label}</Button>
      </Link>
      <Link passHref href={NAV_FOOTER_LINKS.resources.link}>
        <Button className={styles.resources}>
          {NAV_FOOTER_LINKS.resources.label}
        </Button>
      </Link>
      <Link passHref href={NAV_FOOTER_LINKS.contact.link}>
        <Button className={styles.contact}>
          {NAV_FOOTER_LINKS.contact.label}
        </Button>
      </Link>
      <Link passHref href={NAV_FOOTER_LINKS.termsOfService.link}>
        <Button className={styles.termsOfService}>
          {NAV_FOOTER_LINKS.termsOfService.label}
        </Button>
      </Link>
      <Link passHref href={NAV_FOOTER_LINKS.privacyPolicy.link}>
        <Button className={styles.privacyPolicy}>
          {NAV_FOOTER_LINKS.privacyPolicy.label}
        </Button>
      </Link>
      <Link passHref href={NAV_MAIN_LINKS.login.link}>
        <Button className={styles.login}>{NAV_MAIN_LINKS.login.label}</Button>
      </Link>
    </Container>
  );
};

export default Footer;
