import { Container } from '@mui/material';

import { SelectExamOfConscience } from '@/components';

const ConfessionGuide = () => {
  return (
    <Container className="container-box" maxWidth="sm">
      <SelectExamOfConscience />
    </Container>
  );
};

export default ConfessionGuide;
