import { Box, Container, Grid, Typography } from '@mui/material';

import { useLanguageContext } from '@/context/LanguageContext';
import { css } from '@/utils/helpers';

import styles from './whyPrayRosary.module.scss';

const features = [
  {
    title: 'Strengthen Faith',
    description:
      'Join our community as we embark on a transformative journey, praying the Rosary together for spiritual fortitude.',
  },
  {
    title: 'Save Souls',
    description:
      "By praying the Rosary, we intercede for the salvation of souls, asking for God's mercy and grace to be bestowed upon those in need.",
  },
  {
    title: 'Combat Darkness',
    description:
      "Let's stand united against the challenges of our times, seeking solace and strength in the power of collective prayer.",
  },
];

const WhyPrayRosary = () => {
  const { t } = useLanguageContext();
  return (
    <section
      className={styles.container}
      id="why-pray-rosary"
      aria-labelledby="why-pray-rosary-title"
    >
      <Container>
        <Typography
          id="why-pray-rosary-title"
          className={css(styles.title, 'sectionTitle')}
          variant="h2"
        >
          {t.whyPraySectionTitle}
        </Typography>
        <Grid gap={1} container justifyContent="space-around">
          {features.map(({ title, description }, index) => (
            <Grid
              item
              key={title}
              md={3}
              textAlign="center"
              component="article"
              aria-labelledby={`feature-title-${index}`}
            >
              <Box
                id={styles[`arc-${index + 1}` as string]}
                className={styles.arcs}
              >
                <Typography className={styles.step}>{index + 1}</Typography>
                <Typography
                  id={`feature-title-${index}`}
                  variant="h5"
                  gutterBottom
                >
                  {title}
                </Typography>
                <Box>
                  <Typography
                    className={styles.description}
                    variant="body1"
                    gutterBottom
                  >
                    {description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </section>
  );
};

export default WhyPrayRosary;
