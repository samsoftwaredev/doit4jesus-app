import { Alert, Box, Collapse, Container } from '@mui/material';
import { useState } from 'react';

import { SelectExamOfConscience } from '@/components';
import { useLanguageContext } from '@/context/LanguageContext';

const ConfessionGuide = () => {
  const { t } = useLanguageContext();
  const [openWarning, setOpenWarning] = useState(true);
  const [openNote, setOpenNote] = useState(true);

  return (
    <Container className="container-box" maxWidth="sm">
      <Box display="flex" gap={1} flexDirection="column">
        <Collapse in={openWarning}>
          <Alert severity="warning" onClose={() => setOpenWarning(false)}>
            {t.scrupulosityWarning}
          </Alert>
        </Collapse>
        <Collapse in={openNote}>
          <Alert severity="info" onClose={() => setOpenNote(false)}>
            {t.mortalSinConditions}
          </Alert>
        </Collapse>
      </Box>
      <SelectExamOfConscience />
    </Container>
  );
};

export default ConfessionGuide;
