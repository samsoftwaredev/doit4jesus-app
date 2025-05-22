import { Container, Grid, Typography } from '@mui/material';

import { useLanguageContext } from '@/context/LanguageContext';

import styles from './rosaryWeapon.module.scss';

const RosaryWeapon = () => {
  const { t } = useLanguageContext();
  return (
    <div className={styles.container}>
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Typography
            id="features-title"
            textAlign="center"
            className="sectionTitle"
            variant="h2"
            gutterBottom
          >
            {t.rosaryWeaponTitle}
          </Typography>
          <Grid item xs={12} md={6} className={styles.descriptionContainer}>
            <Typography>{t.rosaryWeaponDescription}</Typography>
          </Grid>
          <Grid item xs={12} md={6} minHeight={300}>
            <iframe
              style={{ width: '100%', height: '100%' }}
              src="https://www.youtube-nocookie.com/embed/x1tH_zQ-Cz0?si=0lnC4o44EfJRf-Cu"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default RosaryWeapon;
