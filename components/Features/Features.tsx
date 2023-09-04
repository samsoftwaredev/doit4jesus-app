import { Container, Grid, Typography } from "@mui/material";
import { findPeace, prayMore, prayWell } from "@/public/assets/images/hero";
import styles from "./features.module.scss";

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

const Features = () => {
  return (
    <div className={styles.content}>
      <div className={styles.topGradient} />
      <Container className={styles.container}>
        <Typography className="title" variant="h3" gutterBottom>
          Let's do this together...
        </Typography>
        <Grid container justifyContent="space-between">
          {features.map(({ thumbnail, title, description }) => (
            <Grid item key={title} md={3}>
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
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Features;
