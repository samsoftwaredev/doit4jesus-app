import { Box, Container, Grid, Typography } from "@mui/material";
import { findPeace, prayMore, prayWell } from "@/public/assets/images/hero";
import { theme } from "@/styles/mui-overwrite";
import styles from "./features.module.scss";

const features = [
  {
    thumbnail: findPeace,
    title: "Find Peace.",
    description:
      "The act of praying the Rosary has a calming effect, bringing a sense of tranquility and well-being.",
  },
  {
    thumbnail: prayWell,
    title: "Spiritual Well-Being",
    description:
      "Turn to the Rosary during times of distress, seeking solace and comfort through prayer.",
  },
  {
    thumbnail: prayMore,
    title: "Pray Together",
    description:
      "Prayer unites us and help support millions of souls while sharing our faith and intentions.",
  },
];

const Features = () => {
  return (
    <div className={styles.container}>
      <Container>
        <Typography
          textAlign="center"
          className="sectionTitle"
          variant="h2"
          gutterBottom
        >
          The Rosary App
        </Typography>
        <Grid container justifyContent="space-around">
          {features.map(({ thumbnail, title, description }) => (
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
