import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

import { useLanguageContext } from '@/context/LanguageContext';

const HowItWorks = () => {
  const { t } = useLanguageContext();
  return (
    <Box sx={{ display: 'none' }} mb={8}>
      <Typography component="h2" variant="h4" gutterBottom>
        {t.howItWorks}
      </Typography>
      <Grid container spacing={4}>
        {[
          [t.howItWorksSignUp, t.howItWorksSignUpDesc],
          [t.howItWorksChooseMystery, t.howItWorksChooseMysteryDesc],
          [t.howItWorksPrayTogether, t.howItWorksPrayTogetherDesc],
        ].map(([title, desc], i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Card sx={{ height: '100%' }} elevation={3}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body2">{desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HowItWorks;
