import { Box, Container, Grid, Typography } from "@mui/material";
import { findPeace, prayMore, prayWell } from "@/public/assets/images/hero";
import { theme } from "@/styles/mui-overwrite";
import styles from "./features.module.scss";
import { css } from "@/utils/helpers";

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
    <div className={styles.container}>
      <Container>
        <h2 className={css(styles.title, "sectionTitle")}>The Rosary App</h2>
        <Grid container justifyContent="space-around">
          {features.map(({ title, description }) => (
            <Grid item key={title} md={3} textAlign="center">
              <Box
                className={styles.arcs}
                sx={{
                  textAlign: "center",
                  borderColor: theme.palette.secondary.main,
                }}
              >
                {/* <Image src={thumbnail} alt={title} /> */}
              </Box>
              <h5 className={styles.label}>{title}</h5>
              <p className={styles.description}>{description}</p>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Features;
