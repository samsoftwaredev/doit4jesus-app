import { Box, Container, Grid, Typography } from '@mui/material';

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
  return (
    <div className={styles.container} id="why-pray-rosary">
      <Container>
        <Typography className={css(styles.title, 'sectionTitle')} variant="h2">
          Why Pray The Rosary?
        </Typography>
        <Grid gap={1} container justifyContent="space-around">
          {features.map(({ title, description }, index) => (
            <Grid item key={title} md={3} textAlign="center">
              <Box
                id={styles[`arc-${index + 1}` as string]}
                className={styles.arcs}
              >
                <Typography className={styles.step}>{index + 1}</Typography>
                <Typography variant="h5" gutterBottom>
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
    </div>
  );
};

export default WhyPrayRosary;
