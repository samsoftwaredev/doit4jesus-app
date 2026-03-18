import { Box, Container, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { MainLayout, Meta } from '@/components';

interface Props {
  pageTitle: string;
  title: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

const AuthLayout = ({ pageTitle, title, header, footer, children }: Props) => {
  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <MainLayout>
        <Meta pageTitle={pageTitle} />
        <Container maxWidth="xs">
          <Typography color="text.primary" mt={3} variant="h4" component="h1">
            {title}
          </Typography>
          {header ? (
            <Typography color="text.secondary" variant="body1" component="p">
              {header}
            </Typography>
          ) : null}
          <Box my={2}>{children}</Box>
          {footer ? (
            <Typography
              color="text.secondary"
              textAlign="center"
              variant="body1"
              component="p"
            >
              {footer}
            </Typography>
          ) : null}
        </Container>
      </MainLayout>
    </Box>
  );
};

export default AuthLayout;
