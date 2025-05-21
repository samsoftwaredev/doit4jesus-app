import { Box, Typography } from '@mui/material';

import { useLanguageContext } from '@/context/LanguageContext';

const AppIntroduction = () => {
  const { t } = useLanguageContext();
  return (
    <Box sx={{ display: 'none' }} mb={8}>
      <Typography component="h2" variant="h4" gutterBottom>
        {t.whatIsTheApp}
      </Typography>
      <Typography paragraph>{t.whatIsTheAppAbout}</Typography>
      <Typography paragraph>{t.whatIsTheAppAboutDescription}</Typography>
    </Box>
  );
};

export default AppIntroduction;
