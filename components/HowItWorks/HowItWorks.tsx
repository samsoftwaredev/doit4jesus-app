import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

const HowItWorks = () => {
  return (
    <Box sx={{ display: 'none' }} mb={8}>
      <Typography component="h2" variant="h4" gutterBottom>
        How It Works
      </Typography>
      <Grid container spacing={4}>
        {[
          ['Sign Up', 'Create your free account to get started.'],
          ['Choose a Mystery', 'Pick the Rosary mystery you wish to pray.'],
          ['Pray Together', 'Join others in real-time and grow spiritually.'],
        ].map(([title, desc], i) => (
          <Grid item xs={12} md={4} key={i}>
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
