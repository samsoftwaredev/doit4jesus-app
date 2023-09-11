import { Box, Container, Grid, Typography } from "@mui/material";
import { findPeace, prayMore, prayWell } from "@/public/assets/images/hero";
import { css } from "@/utils/helpers";
import styles from "./whyPrayRosary.module.scss";

const features = [
  {
    thumbnail: findPeace,
    title: "Find Peace.",
    description:
      "Let God bring you His peace with the Calm Praylist, Daily Gospel, Rosary, & Night Prayer",
  },
  {
    thumbnail: prayWell,
    title: "Pray Your Way.",
    description:
      "Choose from 5,000+ sessions, 5-30 minute lengths, 3 guides, and 9 background music options including Gregorian chant",
  },
  {
    thumbnail: prayMore,
    title: "Build a Habit.",
    description:
      "Build a real habit of prayer every day by setting goals, journaling, tracking streaks, and setting reminders",
  },
];

const WhyPrayRosary = () => {
  return (
    <div className={styles.container}>
      <Container>
        <Typography className={css(styles.title, "sectionTitle")} variant="h2">
          Why pray the Rosary
        </Typography>
        <Grid gap={1} container justifyContent="space-around">
          {features.map(({ thumbnail, title, description }, index) => (
            <Grid item key={title} md={3} textAlign="center">
              <Box
                id={styles[`arc-${index + 1}` as string]}
                className={styles.arcs}
              >
                <Typography className={styles.step}>{index + 1}</Typography>
                <Typography className="item-title" variant="h5" gutterBottom>
                  {title}
                </Typography>
                <Typography
                  className="description"
                  variant="subtitle1"
                  gutterBottom
                >
                  {description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default WhyPrayRosary;
