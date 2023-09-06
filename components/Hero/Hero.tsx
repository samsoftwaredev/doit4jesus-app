import { Box, Button, Container, Grid, Typography } from "@mui/material";
import styles from "./hero.module.scss";
import { NAV_APP_LINKS } from "@/constants/nav";
import { useRouter } from "next/router";
import Image from "next/image";
import smartPhoneHand from "@/public/assets/images/hero/smartPhoneHand.svg";

const Hero = () => {
  const router = useRouter();

  const goToApp = () => {
    router.push(NAV_APP_LINKS.app.link);
  };

  return (
    <div className={styles.content}>
      <Container maxWidth={false} className={styles.container}>
        <Box>
          <Typography variant="h1" className={styles.title}>
            Find Peace in the Rosary
          </Typography>
          <Typography variant="h5" className={styles.subTitle}>
            Pray with millions around the world and multiply your blessings
          </Typography>
        </Box>
        <Box />
        <Box mt={10}>
          <Image
            className={styles.image}
            src={smartPhoneHand}
            alt="Hand holding phone"
          />
        </Box>
      </Container>
      <div className={styles.imageBottomGradient} />
    </div>
  );
};

export default Hero;
