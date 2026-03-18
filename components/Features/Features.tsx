import { Box, Container, Grid, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Image from 'next/image';

import { useLanguageContext } from '@/context/LanguageContext';
import jesusPrayingHands from '@/public/assets/images/art/jesusPrayingHands.jpeg';
import josephPraying from '@/public/assets/images/art/josephPraying.jpeg';
import maryMoon from '@/public/assets/images/art/maryMoon.jpeg';

const Section = styled('section')({
  minHeight: '100vh',
  margin: '100px 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

const ArcBox = styled(Box)({
  margin: '20px auto',
  borderTopLeftRadius: '200px',
  borderTopRightRadius: '200px',
  height: '300px',
  maxWidth: '200px',
  border: '10px solid',
  textAlign: 'center',
  '& img': {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: '200px',
    borderTopRightRadius: '200px',
  },
});

const Features = () => {
  const { t } = useLanguageContext();
  const theme = useTheme();

  const features = [
    {
      thumbnail: maryMoon,
      title: t.useTheAppToTitle1,
      description: t.useTheAppToDescription1,
      alt: 'Artistic depiction of Mary under the moonlight',
    },
    {
      thumbnail: jesusPrayingHands,
      title: t.useTheAppToTitle2,
      description: t.useTheAppToDescription2,
      alt: 'Artistic depiction of Jesus with praying hands',
    },
    {
      thumbnail: josephPraying,
      title: t.useTheAppToTitle3,
      description: t.useTheAppToDescription3,
      alt: 'Artistic depiction of Joseph praying',
    },
  ];
  return (
    <Section aria-labelledby="features-title">
      <Container>
        <Typography
          id="features-title"
          textAlign="center"
          className="sectionTitle"
          variant="h2"
          gutterBottom
        >
          {t.theRosaryAppTitle}
        </Typography>
        <Grid container justifyContent="space-around">
          {features.map(({ thumbnail, title, description, alt }) => (
            <Grid
              key={title}
              size={{ md: 3 }}
              textAlign="center"
              component="article"
              aria-labelledby={`${title.replace(/\s+/g, '-').toLowerCase()}-title`}
            >
              <ArcBox
                sx={{
                  borderColor: theme.palette.secondary.main,
                }}
              >
                <Image src={thumbnail} alt={alt} />
              </ArcBox>
              <Typography
                id={`${title.replace(/\s+/g, '-').toLowerCase()}-title`}
                variant="h5"
                gutterBottom
              >
                {title}
              </Typography>
              <Typography
                className="description"
                variant="subtitle1"
                gutterBottom
              >
                {description}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default Features;
