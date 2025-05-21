import { Box, Container, Grid, Typography } from '@mui/material';

import { useLanguageContext } from '@/context/LanguageContext';
import { css } from '@/utils/helpers';

import styles from './whyPrayRosary.module.scss';

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
