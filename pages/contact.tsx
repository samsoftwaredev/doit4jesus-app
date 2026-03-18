import { Box } from '@mui/material';
import type { NextPage } from 'next';

import { Meta } from '@/components';
import { ContactSection } from '@/components/Sections';
import { MainLayout } from '@/components/Templates';

const Contact: NextPage = () => {
  return (
    <MainLayout>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Meta pageTitle="Contact Us" />
        <ContactSection />
      </Box>
    </MainLayout>
  );
};

export default Contact;
