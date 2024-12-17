import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, Button, Container, IconButton } from '@mui/material';
import Link from 'next/link';

import { NAV_FOOTER_LINKS, NAV_MAIN_LINKS } from '@/constants';

import Logo from '../Logo/Logo';
import { YouTubeSubscribe } from '../YouTubeVideo';
import styles from './footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Container className={styles.container} maxWidth={false}>
      <Box className={styles.logo}>
        <Logo />
      </Box>
      <Box
        className={styles.copyRights}
        gap={1}
        display="flex"
        flexDirection="column"
      >
        <small>&copy; {currentYear} DoIt4Jesus. All rights reserved.</small>
        <Box display="flex" justifyContent="center" gap={1}>
          <IconButton
            target="media"
            href="https://www.facebook.com/profile.php?id=61571010650020"
            color="primary"
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            target="media"
            href="https://www.youtube.com/@DoIt4Jesus"
            color="primary"
          >
            <YouTubeIcon />
          </IconButton>
          <IconButton
            target="media"
            href="https://www.instagram.com/doitforjesuschristofnazareth/"
            color="primary"
          >
            <InstagramIcon />
          </IconButton>
        </Box>
      </Box>
      <Box className={styles.socialMedia}>
        <YouTubeSubscribe />
      </Box>
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
