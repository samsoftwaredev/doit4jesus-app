import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import { NAV_MAIN_LINKS } from '@/constants/nav';
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
        DoIt4Jesus is a faith-based platform created to bring together people of
        faith to pray the Holy Rosary as a community. We believe in the
        transformative power of prayer to fight evil, foster spiritual growth,
        and offer comfort to souls in purgatory. Together, we grow stronger in
        faith.
      </Typography>

      <Box display="flex" flexDirection="column" gap={6} width="100%">
        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            Our Story
          </Typography>
          <Typography>
            Born from a desire to build a digital space where faith and
            community intersect, DoIt4Jesus was founded to make praying the
            Rosary together easier and more impactful. We’re inspired by
            centuries of tradition and the urgency of spiritual unity in today’s
            world.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            Core Values
          </Typography>
          <Box component="ul" sx={{ pl: 3, m: 0 }}>
            <li>
              <Typography>Faith & Prayer</Typography>
            </li>
            <li>
              <Typography>Community</Typography>
            </li>
            <li>
              <Typography>Compassion</Typography>
            </li>
            <li>
              <Typography>Unity in Christ</Typography>
            </li>
            <li>
              <Typography>Devotion to Mary</Typography>
            </li>
          </Box>
        </Box>

        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            How It Works
          </Typography>
          <Typography>
            Sign in, choose your mystery, and pray the Holy Rosary alongside
            others in real-time. The more people praying the same mystery
            together, the faster everyone progresses. Our app is built for both
            solo prayer and powerful group devotion.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            Who It&apos;s For
          </Typography>
          <Typography>
            DoIt4Jesus is for anyone seeking a deeper connection with God
            through the Rosary — Catholics, prayer groups, or individuals
            longing for peace and community.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            Join Us
          </Typography>
          <Typography mb={2}>
            Ready to strengthen your faith and join a global prayer movement?
          </Typography>
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
              Sign Up Now
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default AboutSection;
