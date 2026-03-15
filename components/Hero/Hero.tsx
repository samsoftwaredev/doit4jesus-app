import styled from '@emotion/styled';
import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import { NAV_MAIN_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';
import smartPhoneHand from '@/public/assets/images/hero/smartPhoneHand.svg';

const Content = styled('section')({
  position: 'relative',
  color: '#ffffff',
  background: 'linear-gradient(180deg, #163755 0%, #b71c1c 53%, #ffffff 100%)',
});

const HeroContainer = styled(Container)({
  minHeight: '1200px',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: '400px 780px',
  textAlign: 'center',
  '@media (min-width: 768px)': {
    gridTemplateRows: '400px 1fr',
  },
});

const Header = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
});

const CTAButton = styled(Button)({
  marginBottom: '20px',
  padding: '5px 40px',
  scale: 1,
  '@media (min-width: 768px)': {
    scale: 1.1,
  },
  '@media (min-width: 1024px)': {
    scale: 1.3,
  },
});

const Title = styled(Typography)({
  paddingTop: '150px',
  width: '280px',
  '@media (min-width: 768px)': {
    width: '100%',
  },
});

const SubTitle = styled(Typography)({
  letterSpacing: '5px',
  width: '260px',
  '@media (min-width: 768px)': {
    width: '100%',
  },
});

const ImageBottomGradient = styled('div')({
  position: 'absolute',
  bottom: 0,
  zIndex: 100,
  height: '200px',
  width: '100%',
  background:
    'linear-gradient(180deg, transparent 0%, #ffffff 90%, #ffffff 100%)',
});

const HeroImage = styled(Image)({
  width: '350px',
  justifySelf: 'center',
  '@media (min-width: 768px)': {
    width: '600px',
  },
  '@media (min-width: 1024px)': {
    width: '700px',
  },
});

const Hero = () => {
  const { t } = useLanguageContext();
  return (
    <Content aria-labelledby="hero-title">
      <HeroContainer maxWidth={false} role="banner">
        <Header>
          <Title id="hero-title" variant="h3" className="sectionTitle">
            {t.heroTitle}
          </Title>
          <SubTitle mb={2} variant="body1" className="sectionSubTitle">
            {t.headline}
          </SubTitle>
          <Link
            style={{ padding: '1em 0' }}
            passHref
            href={NAV_MAIN_LINKS.signup.link}
          >
            <CTAButton variant="contained" size="large" aria-label={t.heroCTA}>
              {t.heroCTA}
            </CTAButton>
          </Link>
        </Header>
        <HeroImage src={smartPhoneHand} alt={'Hand holding phone'} priority />
      </HeroContainer>
      <ImageBottomGradient aria-hidden="true" />
    </Content>
  );
};

export default Hero;
