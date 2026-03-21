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
import { useEffect, useState } from 'react';

import { CardDeck } from '@/components';
import { SelectVocation } from '@/components/SelectExamOfConscience';
import { useLanguageContext } from '@/context/LanguageContext';
import type { CardProps } from '@/interfaces';
import type { ExamQuestion, Vocation } from '@/interfaces/examOfConscience';
import { filterByVocation, getExamBySlug } from '@/services/examOfConscience';

const STORAGE_KEY_WARNING = 'exam-dismiss-warning';
const STORAGE_KEY_NOTE = 'exam-dismiss-note';

interface ExamPageProps {
  slug: string;
}

const ExamPage = ({ slug }: ExamPageProps) => {
  const { t } = useLanguageContext();
  const router = useRouter();
  const exam = getExamBySlug(slug);

  const [activeStep, setActiveStep] = useState(0);
  const [questions, setQuestions] = useState<ExamQuestion[]>(
    exam?.questions ?? [],
  );
  const [showVocation, setShowVocation] = useState(slug === 'adult');
  const [openWarning, setOpenWarning] = useState(true);
  const [openNote, setOpenNote] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY_WARNING) === 'true')
      setOpenWarning(false);
    if (localStorage.getItem(STORAGE_KEY_NOTE) === 'true') setOpenNote(false);
  }, []);

  if (!exam) return null;

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

  const onVocationSelected = (vocation: Vocation) => {
    const filtered = filterByVocation(exam.questions, vocation);
    setQuestions(filtered);
    setActiveStep(0);
    setShowVocation(false);
  };

  const cardSteps: CardProps[] = questions.map((q) => ({
    title: q.title,
    question: q.question,
    description: q.description || undefined,
    categories: q.categories,
    commandment: q.commandment,
    type: q.type,
  }));

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
          {exam.label}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" mb={2} px={1}>
        {t[exam.descriptionKey as keyof typeof t]}
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
            steps={cardSteps}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        </Box>
      )}
    </Container>
  );
};

export default ExamPage;
