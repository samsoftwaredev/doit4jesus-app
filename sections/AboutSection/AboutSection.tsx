import Image from "next/image";
import { Container, Typography } from "@mui/material";
import virginPrayingHeaven from "@/public/assets/images/art/virginPrayingHeaven.jpeg";
import styles from "./aboutSection.module.scss";

const AboutSection = () => {
  return (
    <Container maxWidth="md" className={styles.container}>
      <Image
        className={styles.image}
        src={virginPrayingHeaven}
        alt="Mary holding the Holy Rosary"
      />
      <Typography className={styles.title} component="h1" variant="h2">
        About
      </Typography>
      <Typography className={styles.content}>
        Welcome to DoIt4Jesus app, where faith unites us, prayers strengthens us
        and community empowers us. We are dedicated to fostering a deeper
        connection thought the sacred practice of praying the Holy Rosary
        together. Our mission is rooted in the profound belief that communal
        prayer has the power to combat evil, built a vibrant spiritual
        community, and offer solace to souls in purgatory.
      </Typography>
    </Container>
  );
};

export default AboutSection;
