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
    <footer className={styles.container}>
      <Container maxWidth="lg">
        <Box className={styles.logo} aria-label="Website Logo">
          <Logo />
        </Box>
        <Box
          className={styles.copyRights}
          gap={1}
          display="flex"
          flexDirection="column"
        >
          <small>&copy; {currentYear} DoIt4Jesus. All rights reserved.</small>
          <Box
            display="flex"
            justifyContent="center"
            gap={1}
            aria-label="Social Media Links"
          >
            <IconButton
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.facebook.com/profile.php?id=61571010650020"
              color="primary"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.youtube.com/@DoIt4Jesus"
              color="primary"
              aria-label="YouTube"
            >
              <YouTubeIcon />
            </IconButton>
            <IconButton
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/doitforjesuschristofnazareth/"
              color="primary"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </IconButton>
          </Box>
        </Box>
        <Box className={styles.socialMedia} aria-label="YouTube Subscription">
          <YouTubeSubscribe />
        </Box>
        <nav aria-label="Footer Navigation Links">
          <Link passHref href={NAV_FOOTER_LINKS.about.link}>
            <Button className={styles.about}>
              {NAV_FOOTER_LINKS.about.label}
            </Button>
          </Link>
          |
          <Link passHref href={NAV_FOOTER_LINKS.resources.link}>
            <Button className={styles.resources}>
              {NAV_FOOTER_LINKS.resources.label}
            </Button>
          </Link>
          |
          <Link passHref href={NAV_FOOTER_LINKS.contact.link}>
            <Button className={styles.contact}>
              {NAV_FOOTER_LINKS.contact.label}
            </Button>
          </Link>
          |
          <Link passHref href={NAV_FOOTER_LINKS.termsOfService.link}>
            <Button className={styles.termsOfService}>
              {NAV_FOOTER_LINKS.termsOfService.label}
            </Button>
          </Link>
          |
          <Link passHref href={NAV_FOOTER_LINKS.privacyPolicy.link}>
            <Button className={styles.privacyPolicy}>
              {NAV_FOOTER_LINKS.privacyPolicy.label}
            </Button>
          </Link>
          |
          <Link passHref href={NAV_MAIN_LINKS.login.link}>
            <Button className={styles.login}>
              {NAV_MAIN_LINKS.login.label}
            </Button>
          </Link>
        </nav>
      </Container>
    </footer>
  );
};

export default Footer;
