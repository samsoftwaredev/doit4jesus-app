import { Box, Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';

import { NAV_MAIN_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';
import virginPrayingHeaven from '@/public/assets/images/art/virginPrayingHeaven.jpeg';

const AboutGrid = styled(Container)({
  marginTop: '60px',
  padding: '0 20px',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr 70px 1fr',
  gap: '20px',
  gridTemplateAreas: `
    'image'
    'title'
    'content'`,
  '@media (min-width: 768px)': {
    gridTemplateColumns: '500px 1fr',
    gridTemplateRows: '70px 1fr',
    gridTemplateAreas: `
      'title image'
      'content image'`,
  },
  '@media (min-width: 1024px)': {
    padding: '0px',
    gridTemplateColumns: '500px 1fr',
    gridTemplateRows: '70px 1fr',
    gridTemplateAreas: `
      'title image'
      'content image'`,
  },
});

const AboutImage = styled(Image)({
  gridArea: 'image',
  width: '100%',
  height: 'auto',
  borderRadius: '20px',
});

const AboutSection = () => {
  const { t } = useLanguageContext();
  return (
    <AboutGrid maxWidth="md">
      <AboutImage
        src={virginPrayingHeaven}
        alt="Mary holding the Holy Rosary"
      />
      <Typography sx={{ gridArea: 'title' }} component="h1" variant="h2">
        {t.about}
      </Typography>
      <Typography sx={{ gridArea: 'content' }}>{t.aboutDescription}</Typography>

      <Box display="flex" flexDirection="column" gap={6} width="100%">
        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            {t.ourStory}
          </Typography>
          <Typography>{t.ourStoryDescription}</Typography>
        </Box>

        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            {t.coreValues}
          </Typography>
          <Box component="ul" sx={{ pl: 3, m: 0 }}>
            <li>
              <Typography>{t.faithAndPrayer}</Typography>
            </li>
            <li>
              <Typography>{t.community}</Typography>
            </li>
            <li>
              <Typography>{t.compassion}</Typography>
            </li>
            <li>
              <Typography>{t.unityInChrist}</Typography>
            </li>
            <li>
              <Typography>{t.devotionToMary}</Typography>
            </li>
          </Box>
        </Box>

        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            {t.howItWorksTitle}
          </Typography>
          <Typography>{t.howItWorksDescription}</Typography>
        </Box>

        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            {t.whoItsFor}
          </Typography>
          <Typography>{t.whoItsForDescription}</Typography>
        </Box>

        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            {t.joinUs}
          </Typography>
          <Typography mb={2}>{t.joinUsDescription}</Typography>
          <Link href={NAV_MAIN_LINKS.signup.link} passHref legacyBehavior>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{
                maxWidth: { xs: '100%', sm: 300 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
              }}
            >
              {t.signUpNow}
            </Button>
          </Link>
        </Box>
      </Box>
    </AboutGrid>
  );
};

export default AboutSection;
