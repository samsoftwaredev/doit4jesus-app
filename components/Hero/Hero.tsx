import { Button, Container, Grid, Typography } from "@mui/material";
import styles from "./hero.module.scss";
import { NAV_APP_LINKS } from "@/constants/nav";
import { useRouter } from "next/router";

const Hero = () => {
  const router = useRouter();

  const goToApp = () => {
    router.push(NAV_APP_LINKS.app.link);
  };

  return (
    <Container maxWidth={false} className={styles.container}>
      <Typography variant="h1" className={styles.title}>
        Find Peace in the Rosary
      </Typography>
      <Typography variant="h5" className={styles.subTitle}>
        Pray with millions around the world and multiply your blessings
      </Typography>
      <Grid container justifyContent="center" mt={5}>
        <Button className={styles.cta} onClick={goToApp} variant="contained">
          Start Today
        </Button>
      </Grid>
    </Container>
  );
};

export default Hero;
