import { Alert, Box, Collapse, Container } from '@mui/material';
import { useState } from 'react';

import { SelectExamOfConscience } from '@/components';
import { useLanguageContext } from '@/context/LanguageContext';

const ConfessionGuide = () => {
  return (
    <Container className="container-box" maxWidth="sm">
      <SelectExamOfConscience />
    </Container>
  );
};

export default ConfessionGuide;
