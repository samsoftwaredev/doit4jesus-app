import { Container, Typography } from '@mui/material';
import Image from 'next/image';

import virginPrayingHeaven from '@/public/assets/images/art/virginPrayingHeaven.jpeg';

import styles from './aboutSection.module.scss';

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
        Welcome to the DoIt4Jesus app, a platform that brings together people of
        faith to pray the Holy Rosary as a community. Our mission is to create a
        stronger connection among believers through the sacred practice of
        prayer. We firmly believe that praying together has the power to fight
        evil, foster a vibrant spiritual community, and offer comfort to souls
        in purgatory. Join us in our mission and let us grow in faith together!
      </Typography>
    </Container>
  );
};

export default AboutSection;
