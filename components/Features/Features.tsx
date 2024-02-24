import { Box, Container, Grid, Typography } from "@mui/material";
import { theme } from "@/styles/mui-overwrite";
import josephPraying from "@/public/assets/images/art/josephPraying.jpeg";
import jesusPrayingHands from "@/public/assets/images/art/jesusPrayingHands.jpeg";
import maryMoon from "@/public/assets/images/art/maryMoon.jpeg";
import styles from "./features.module.scss";
import Image from "next/image";

const features = [
  {
    thumbnail: maryMoon,
    title: "Find Peace",
    description:
      "The act of praying the Rosary has a calming effect, bringing a sense of tranquility and well-being.",
  },
  {
    thumbnail: jesusPrayingHands,
    title: "Spiritual Well-Being",
    description:
      "Turn to the Rosary during times of distress, seeking solace and comfort through prayer.",
  },
  {
    thumbnail: josephPraying,
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
                <Image src={thumbnail} alt={title} />
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
