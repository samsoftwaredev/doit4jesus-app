import { Box, Container, Grid, Typography } from "@mui/material";
import { findPeace, prayMore, prayWell } from "@/public/assets/images/hero";
import { css } from "@/utils/helpers";
import styles from "./whyPrayRosary.module.scss";

const features = [
  {
    thumbnail: findPeace,
    title: "Strengthen faith",
    description:
      "Join our community as we embark on a transformative journey, praying the Rosary together for spiritual fortitude.",
  },
  {
    thumbnail: prayWell,
    title: "Save souls",
    description:
      "By praying the Rosary, we intercede for the salvation of souls, asking for God's mercy and grace to be bestowed upon those in need.",
  },
  {
    thumbnail: prayMore,
    title: "Combat darkness",
    description:
      "Let's stand united against the challenges of our times, seeking solace and strength in the power of collective prayer.",
  },
];

const WhyPrayRosary = () => {
  return (
    <div className={styles.container} id="why-pray-rosary">
      <Container>
        <Typography className={css(styles.title, "sectionTitle")} variant="h2">
          Why pray the Rosary?
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
