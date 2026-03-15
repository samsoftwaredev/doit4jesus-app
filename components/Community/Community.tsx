import styled from '@emotion/styled';
import { Box, Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';

import { useLanguageContext } from '@/context/LanguageContext';
import rosary from '@/public/assets/images/rosary.svg';

const Section = styled('section')({
  minHeight: '900px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  textShadow: '1px 1px 3px #000000',
  color: '#ffffff',
  background: 'linear-gradient(180deg, #163755 0%, #163755 20%, #844d42 100%)',
  '& img': {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
});

const Title = styled(Typography)({
  position: 'relative',
  textShadow: '1px 1px 3px #000000',
  zIndex: 100,
});

const Content = styled(Box)({
  marginBottom: '150px',
  marginTop: '50px',
  position: 'relative',
  zIndex: 10,
  maxWidth: '500px',
});

const Description = styled(Typography)({
  fontSize: '1em',
  '@media (min-width: 768px) and (max-width: 1023px)': {
    fontSize: '1.2em',
  },
  '@media (min-width: 1024px)': {
    fontSize: '1.5em',
  },
});

const Hero = () => {
  const { t } = useLanguageContext();
  return (
    <Section>
      <Container component="div" maxWidth="md">
        <Grid component="div">
          <Title my={5} className="sectionTitle" variant="h2">
            {t.aboutRosaryTitle}
          </Title>
          <Image
            style={{ opacity: 0.4 }}
            src={rosary}
            alt="Illustration of a Rosary"
            priority
          />
          <Content>
            <Description>{t.aboutRosaryDescription}</Description>
          </Content>
        </Grid>
      </Container>
    </Section>
  );
};

export default Hero;
