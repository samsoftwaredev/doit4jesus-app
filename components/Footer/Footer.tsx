import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, Button, Container, IconButton, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

import { Logo, YouTubeSubscribe } from '@/components';
import { NAV_FOOTER_LINKS, NAV_MAIN_LINKS } from '@/constants';

const FooterContainer = styled('footer')({
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridTemplateRows: 'repeat(3, 1fr)',
  gridColumnGap: '0px',
  gridRowGap: '0px',
  paddingBottom: '90px',
  marginTop: '50px',
  textAlign: 'center',
  gridTemplateAreas:
    "'logo logo logo' 'copyRights copyRights copyRights' 'socialMedia socialMedia socialMedia' 'about resources contact'",
  '@media (min-width: 1024px)': {
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    paddingBottom: '70px',
    gridTemplateAreas:
      "'about resources contact logo' 'about resources contact copyRights' 'about resources contact socialMedia'",
  },
});

const LogoArea = styled(Box)({ textAlign: 'center', gridArea: 'logo' });
const CopyRightsArea = styled(Box)({ gridArea: 'copyRights' });
const SocialMediaArea = styled(Box)({ gridArea: 'socialMedia' });

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  const textColor = theme.palette.text.primary;
  const bgColor = theme.palette.background.default;
  const dividerColor = theme.palette.text.secondary;

  return (
    <FooterContainer sx={{ backgroundColor: bgColor, color: textColor }}>
      <Container maxWidth="lg">
        <LogoArea aria-label="Website Logo">
          <Logo />
        </LogoArea>
        <CopyRightsArea gap={1} display="flex" flexDirection="column">
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
              href="https://www.facebook.com/people/DoIt4Jesus/61579821511072/"
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
        </CopyRightsArea>
        <SocialMediaArea aria-label="YouTube Subscription">
          <YouTubeSubscribe />
        </SocialMediaArea>
        <nav aria-label="Footer Navigation Links">
          <Link passHref href={NAV_FOOTER_LINKS.about.link}>
            <Button>{NAV_FOOTER_LINKS.about.label}</Button>
          </Link>
          <Box component="span" sx={{ color: dividerColor }}>
            |
          </Box>
          <Link passHref href={NAV_FOOTER_LINKS.resources.link}>
            <Button>{NAV_FOOTER_LINKS.resources.label}</Button>
          </Link>
          <Box component="span" sx={{ color: dividerColor }}>
            |
          </Box>
          <Link passHref href={NAV_FOOTER_LINKS.contact.link}>
            <Button>{NAV_FOOTER_LINKS.contact.label}</Button>
          </Link>
          <Box component="span" sx={{ color: dividerColor }}>
            |
          </Box>
          <Link passHref href={NAV_FOOTER_LINKS.termsOfService.link}>
            <Button>{NAV_FOOTER_LINKS.termsOfService.label}</Button>
          </Link>
          <Box component="span" sx={{ color: dividerColor }}>
            |
          </Box>
          <Link passHref href={NAV_FOOTER_LINKS.privacyPolicy.link}>
            <Button>{NAV_FOOTER_LINKS.privacyPolicy.label}</Button>
          </Link>
          <Box component="span" sx={{ color: dividerColor }}>
            |
          </Box>
          <Link passHref href={NAV_MAIN_LINKS.login.link}>
            <Button>{NAV_MAIN_LINKS.login.label}</Button>
          </Link>
        </nav>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
