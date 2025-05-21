import { Box, Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';

import { useLanguageContext } from '@/context/LanguageContext';
import jesusPrayingHands from '@/public/assets/images/art/jesusPrayingHands.jpeg';
import josephPraying from '@/public/assets/images/art/josephPraying.jpeg';
import maryMoon from '@/public/assets/images/art/maryMoon.jpeg';
import { theme } from '@/styles/mui-overwrite';

import styles from './features.module.scss';

const Features = () => {
  const { t } = useLanguageContext();

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
    <section className={styles.container} aria-labelledby="features-title">
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
              item
              key={title}
              md={3}
              textAlign="center"
              component="article"
              aria-labelledby={`${title.replace(/\s+/g, '-').toLowerCase()}-title`}
            >
              <Box
                className={styles.arcs}
                sx={{
                  textAlign: 'center',
                  borderColor: theme.palette.secondary.main,
                }}
              >
                <Image src={thumbnail} alt={alt} />
              </Box>
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
    </section>
  );
};

export default Features;
