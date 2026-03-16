import { Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

import { NAV_MAIN_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';

const StyledContainer = styled(Container)({
  minHeight: '10vh',
  textAlign: 'center',
  marginBottom: '5em',
});

const Title = styled(Typography)({
  fontSize: '2.5em',
  fontWeight: 100,
});

const CallToAction = () => {
  const { t } = useLanguageContext();
  return (
    <StyledContainer maxWidth="md">
      <Title pb={5}>{t.footerCTA}</Title>
      <Link passHref href={NAV_MAIN_LINKS.signup.link}>
        <Button
          size="large"
          variant="contained"
          aria-label="Sign up for free to start praying with others"
        >
          {t.signUp}
        </Button>
      </Link>
    </StyledContainer>
  );
};

export default CallToAction;
