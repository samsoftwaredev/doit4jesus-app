import { Box, Button, Container, Typography } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';

const Unauthorized = () => (
  <>
    <Head>
      <title>Unauthorized — DoIt4Jesus</title>
    </Head>
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        textAlign="center"
        gap={2}
      >
        <Typography variant="h3" fontWeight={800}>
          403
        </Typography>
        <Typography variant="h6" color="text.secondary">
          You don&apos;t have permission to access this page.
        </Typography>
        <Button component={Link} href="/" variant="contained" sx={{ mt: 2 }}>
          Go Home
        </Button>
      </Box>
    </Container>
  </>
);

export default Unauthorized;
