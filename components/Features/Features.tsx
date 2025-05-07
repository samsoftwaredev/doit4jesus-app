import { Box, Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';

import jesusPrayingHands from '@/public/assets/images/art/jesusPrayingHands.jpeg';
import josephPraying from '@/public/assets/images/art/josephPraying.jpeg';
import maryMoon from '@/public/assets/images/art/maryMoon.jpeg';
import { theme } from '@/styles/mui-overwrite';

import styles from './features.module.scss';

const features = [
  {
    thumbnail: maryMoon,
    title: 'Find Peace',
    description:
      'The act of praying the Rosary has a calming effect, bringing a sense of tranquility and well-being.',
    alt: 'Artistic depiction of Mary under the moonlight',
  },
  {
    thumbnail: jesusPrayingHands,
    title: 'Spiritual Well-Being',
    description:
      'Turn to the Rosary during times of distress, seeking solace and comfort through prayer.',
    alt: 'Artistic depiction of Jesus with praying hands',
  },
  {
    thumbnail: josephPraying,
    title: 'Pray Together',
    description:
      'Prayer unites us and helps support millions of souls while sharing our faith and intentions.',
    alt: 'Artistic depiction of Joseph praying',
  },
];

const Features = () => {
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
          The Rosary App
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
