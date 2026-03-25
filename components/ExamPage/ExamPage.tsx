'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Alert,
  Box,
  Collapse,
  Container,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { CardDeck } from '@/components';
import { SelectVocation } from '@/components/SelectExamOfConscience';
import { useLanguageContext } from '@/context/LanguageContext';
import type { ExamQuestion, Vocation } from '@/interfaces/examOfConscience';
import { filterByVocation, getExamBySlug } from '@/services/examOfConscience';

const STORAGE_KEY_WARNING = 'exam-dismiss-warning';
const STORAGE_KEY_NOTE = 'exam-dismiss-note';

interface ExamPageProps {
  slug: string;
}

const ExamPage = ({ slug }: ExamPageProps) => {
  const { t, lang } = useLanguageContext();
  const router = useRouter();
  const exam = useMemo(() => getExamBySlug(slug), [lang]);
  const questions: ExamQuestion[] = useMemo(
    () => exam?.questions?.[lang] ?? [],
    [exam, lang],
  );
  const [activeStep, setActiveStep] = useState(0);
  const [showVocation, setShowVocation] = useState(slug === 'adult');
  const [openWarning, setOpenWarning] = useState(true);
  const [openNote, setOpenNote] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY_WARNING) === 'true') {
      setOpenWarning(false);
    }
    if (localStorage.getItem(STORAGE_KEY_NOTE) === 'true') {
      setOpenNote(false);
    }
  }, []);

  useEffect(() => {
    // Reset state when slug changes
    setActiveStep(0);
  }, [lang]);

  const progress =
    questions.length > 0 ? (activeStep / questions.length) * 100 : 0;

  const dismissWarning = () => {
    setOpenWarning(false);
    localStorage.setItem(STORAGE_KEY_WARNING, 'true');
  };

  const dismissNote = () => {
    setOpenNote(false);
    localStorage.setItem(STORAGE_KEY_NOTE, 'true');
  };

  const onVocationSelected = useCallback(
    (vocation: Vocation) => {
      const filtered = filterByVocation(questions, vocation);
      setActiveStep(0);
      setShowVocation(false);
      return filtered;
    },
    [questions, lang],
  );

  console.log('ExamPage render', {
    slug,
    exam,
    questions,
    activeStep,
    progress,
  });

  if (!exam) return null;

  return (
    <Container className="container-box" maxWidth="sm">
      <Box display="flex" alignItems="center" gap={1} mt={1} mb={1}>
        <IconButton
          onClick={() => router.push('/app/confession')}
          aria-label={t.back}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1" color="text.primary">
          {exam?.label}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" mb={2} px={1}>
        {t[exam?.descriptionKey as keyof typeof t]}
      </Typography>
      <Box display="flex" gap={1} flexDirection="column">
        <Collapse in={openWarning}>
          <Alert severity="warning" onClose={dismissWarning}>
            {t.scrupulosityWarning}
          </Alert>
        </Collapse>
        <Collapse in={openNote}>
          <Alert severity="info" onClose={dismissNote}>
            {t.mortalSinConditions}
          </Alert>
        </Collapse>
      </Box>
      {showVocation ? (
        <SelectVocation onVocationSelected={onVocationSelected} />
      ) : (
        <Box className="appCard" mt={1}>
          <LinearProgress
            color="error"
            variant="determinate"
            value={progress}
          />
          <CardDeck
            steps={questions}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        </Box>
      )}
    </Container>
  );
};

export default ExamPage;
