import { Container, Typography } from "@mui/material";
import styles from "./community.module.scss";

const Hero = () => {
  return (
    <Container className={styles.container}>
      <Typography variant="h4">Don't pray alone</Typography>
      <Typography variant="subtitle1">
        Here you will find a community that supports you, prays with you and has
        the best intentions for you.
      </Typography>
    </Container>
  );
};

export default Hero;
