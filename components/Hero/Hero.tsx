import { Button, Container, Grid, Typography } from "@mui/material";
import styles from "./hero.module.scss";
import { NAV_APP_LINKS } from "@/constants/nav";

const Hero = () => {
  return (
    <Container maxWidth="sm" className={styles.container}>
      <Typography variant="h6">Everything you do...</Typography>
      <Typography variant="h1">Do it 4 Jesus</Typography>
      <Grid container justifyContent="center">
        <Button href={NAV_APP_LINKS.app.link} variant="contained">
          Start Today
        </Button>
      </Grid>
    </Container>
  );
};

export default Hero;
