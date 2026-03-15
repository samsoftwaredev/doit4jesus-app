import styled from '@emotion/styled';
import { Container, Grid, Typography } from '@mui/material';

import { useLanguageContext } from '@/context/LanguageContext';

const StyledContainer = styled('div')({
  minHeight: '530px',
  padding: '20px 0',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

const RosaryWeapon = () => {
  const { t } = useLanguageContext();
  return (
    <StyledContainer>
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
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography>{t.rosaryWeaponDescription}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} minHeight={300}>
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
    </StyledContainer>
  );
};

export default RosaryWeapon;
