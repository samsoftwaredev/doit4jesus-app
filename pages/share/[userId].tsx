import { Box, Button, Container, Typography } from '@mui/material';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { COMPANY } from '@/constants/company';
import { NAV_MAIN_LINKS } from '@/constants/nav';

interface Props {
  userId: string;
}

const ShareLanding: NextPage<Props> = ({ userId }) => {
  const siteUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://doit4jesus.com';
  const ogImageUrl = `${siteUrl}/api/og-share?userId=${encodeURIComponent(userId)}`;

  return (
    <>
      <Head>
        <title>Join the Prayer Battle | {COMPANY.name}</title>
        <meta
          name="description"
          content="Join thousands praying the Rosary worldwide. Battle evil, one bead at a time."
        />
        <meta
          property="og:title"
          content={`Join the Prayer Battle | ${COMPANY.name}`}
        />
        <meta
          property="og:description"
          content="Join thousands praying the Rosary worldwide. Level up your faith!"
        />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Join the Prayer Battle | ${COMPANY.name}`}
        />
        <meta
          name="twitter:description"
          content="Join thousands praying the Rosary worldwide."
        />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0e27, #1a237e, #0d1442)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center', py: 6 }}>
          {/* Glowing cross accent */}
          <Box
            sx={{
              width: 60,
              height: 60,
              mx: 'auto',
              mb: 3,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 4,
                height: 40,
                bgcolor: '#ffd700',
                borderRadius: 1,
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '35%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 28,
                height: 4,
                bgcolor: '#ffd700',
                borderRadius: 1,
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
              },
            }}
          />

          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ color: '#fff', mb: 2 }}
          >
            Join the Battle
          </Typography>

          <Typography
            variant="h6"
            sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}
          >
            Thousands are praying the Rosary worldwide.
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: 'rgba(255,215,0,0.9)', mb: 5 }}
          >
            Level up your faith. Battle evil, one bead at a time.
          </Typography>

          <Link href={NAV_MAIN_LINKS.signup.link} passHref legacyBehavior>
            <Button
              component="a"
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#ffd700',
                color: '#0a0e27',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                px: 5,
                py: 1.5,
                borderRadius: 2,
                '&:hover': { bgcolor: '#ffed4a' },
                mb: 3,
              }}
            >
              Start Praying
            </Button>
          </Link>

          <Typography
            variant="body2"
            sx={{ color: 'rgba(255,255,255,0.4)', mt: 4 }}
          >
            {COMPANY.name} — The Rosary Gamified
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { userId } = context.params as { userId: string };

  return {
    props: {
      userId: userId ?? '',
    },
  };
};

export default ShareLanding;
