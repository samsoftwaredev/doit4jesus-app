import { useRouter } from "next/router";
import Image from "next/image";
import { Box, Button, Container, Typography } from "@mui/material";
import smartPhoneHand from "@/public/assets/images/hero/smartPhoneHand.svg";
import { NAV_APP_LINKS } from "@/constants/nav";
import { css } from "@/utils";
import styles from "./hero.module.scss";

const Hero = () => {
  const router = useRouter();

  const goToApp = () => {
    router.push(NAV_APP_LINKS.app.link);
  };

  return (
    <div className={styles.content}>
      <Container maxWidth={false} className={styles.container}>
        <Box className={styles.header}>
          <Typography
            variant="h1"
            className={css(styles.title, "sectionTitle")}
          >
            Find Peace in the Rosary
          </Typography>
          <Typography
            variant="h5"
            className={css(styles.subTitle, "sectionSubTitle")}
          >
            Pray with millions around the world and multiply your blessings
          </Typography>
          <Button
            onClick={goToApp}
            className={styles.cta}
            variant="contained"
            size="large"
          >
            Start Today
          </Button>
        </Box>
        <Image
          className={styles.image}
          src={smartPhoneHand}
          alt="Hand holding phone"
        />
      </Container>
      <div className={styles.imageBottomGradient} />
    </div>
  );
};

export default Hero;
