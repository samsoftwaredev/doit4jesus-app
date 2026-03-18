import { Box, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useLanguageContext } from '@/context/LanguageContext';
import { getWhyPrayGradient } from '@/styles/theme-tokens';

const Section = styled('section')(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  background: getWhyPrayGradient(theme),
}));

const Title = styled(Typography)(({ theme }) => ({
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.text.primary
      : theme.palette.primary.contrastText,
  marginBottom: '0.5em',
  textAlign: 'center',
}));

const Arcs = styled(Box)(({ theme }) => ({
  margin: '20px auto',
  borderRadius: '200px',
  padding: '5px',
  height: '600px',
  border: `10px solid ${theme.palette.background.paper}`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: '550px',
}));

const Step = styled(Typography)({
  fontSize: '5em',
  margin: '0 10px',
  '@media (min-width: 768px) and (max-width: 1023px)': {
    fontSize: '10em',
  },
  '@media (min-width: 1024px)': {
    fontSize: '12em',
  },
});

const WhyPrayRosary = () => {
  const { t } = useLanguageContext();

  const features = [
    {
      title: t.whyPrayRosaryTitle1,
      description: t.whyPrayRosaryDescription1,
    },
    {
      title: t.whyPrayRosaryTitle2,
      description: t.whyPrayRosaryDescription2,
    },
    {
      title: t.whyPrayRosaryTitle3,
      description: t.whyPrayRosaryDescription3,
    },
  ];
  return (
    <Section id="why-pray-rosary" aria-labelledby="why-pray-rosary-title">
      <Container>
        <Title id="why-pray-rosary-title" className="sectionTitle" variant="h2">
          {t.whyPraySectionTitle}
        </Title>
        <Grid gap={1} container justifyContent="space-around">
          {features.map(({ title, description }, index) => (
            <Grid
              key={title}
              size={{ md: 3 }}
              textAlign="center"
              component="article"
              aria-labelledby={`feature-title-${index}`}
            >
              <Arcs>
                <Step>{index + 1}</Step>
                <Typography
                  id={`feature-title-${index}`}
                  variant="h5"
                  gutterBottom
                >
                  {title}
                </Typography>
                <Box>
                  <Typography variant="body1" gutterBottom>
                    {description}
                  </Typography>
                </Box>
              </Arcs>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default WhyPrayRosary;
