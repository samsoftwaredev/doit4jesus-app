import { Alert, Box, Collapse, Container, LinearProgress } from '@mui/material';
import { useState } from 'react';

import { CardDeck, SelectExamOfConscience, SelectVocation } from '@/components';
import { useLanguageContext } from '@/context/LanguageContext';
import adultExamOfConscience from '@/data/adultExamOfConscience.json';
import childExamOfConscience from '@/data/childExamOfConscience.json';
import teenExamOfConscience from '@/data/teenExamOfConscience.json';
import { CardProps, ExamTypes } from '@/interfaces';

enum ActiveScreen {
  selectExam = 0,
  selectVocation = 1,
  examOfConscience = 2,
}

type Vocation = 'married' | 'single' | 'religious';

const exams: ExamTypes = {
  child: {
    label: 'Child Examination of Conscience',
    value: childExamOfConscience,
  },
  teen: {
    label: 'Teen Examination of Conscience',
    value: teenExamOfConscience,
  },
  adult: {
    label: 'Adult Examination of Conscience',
    value: adultExamOfConscience,
  },
};

const filterByVocation = (
  questions: CardProps[],
  vocation: Vocation,
): CardProps[] => {
  return questions.filter((q) => {
    const categories = (q as any).categories as string[] | undefined;
    if (!categories || categories.length === 0) return true;
    return categories.includes(vocation);
  });
};

const ConfessionGuide = () => {
  const { t } = useLanguageContext();
  const [exam, setExam] = useState<CardProps[]>(exams.adult.value);
  const [activeStep, setActiveStep] = useState(0);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(
    ActiveScreen.selectExam,
  );
  const [openWarning, setOpenWarning] = useState(true);
  const [openNote, setOpenNote] = useState(true);
  const progress = (activeStep / exam.length) * 100;

  const handelCloseWarning = () => {
    setOpenWarning(false);
  };

  const handelCloseNote = () => {
    setOpenNote(false);
  };

  const onExamSelected = (type: string) => {
    switch (type) {
      case 'kids':
        setExam(exams.child.value);
        setActiveScreen(ActiveScreen.examOfConscience);
        break;
      case 'teens':
        setExam(exams.teen.value);
        setActiveScreen(ActiveScreen.examOfConscience);
        break;
      case 'adults':
        setActiveScreen(ActiveScreen.selectVocation);
        break;
      default:
        console.error('Invalid type for exam selected ' + type);
    }
  };

  const onVocationSelected = (vocation: Vocation) => {
    const filtered = filterByVocation(exams.adult.value, vocation);
    setExam(filtered);
    setActiveStep(0);
    setActiveScreen(ActiveScreen.examOfConscience);
  };

  return (
    <>
      <Container className="container-box" maxWidth="sm">
        <Box display="flex" gap={1} flexDirection="column">
          <Collapse in={openWarning}>
            <Alert severity="warning" onClose={handelCloseWarning}>
              {t.scrupulosityWarning}
            </Alert>
          </Collapse>
          <Collapse in={openNote}>
            <Alert severity="info" onClose={handelCloseNote}>
              {t.mortalSinConditions}
            </Alert>
          </Collapse>
        </Box>
        {activeScreen === ActiveScreen.selectExam && (
          <SelectExamOfConscience onExamSelected={onExamSelected} />
        )}
        {activeScreen === ActiveScreen.selectVocation && (
          <SelectVocation onVocationSelected={onVocationSelected} />
        )}
        {activeScreen === ActiveScreen.examOfConscience && (
          <Box className="appCard" mt={1}>
            <LinearProgress
              color="error"
              variant="determinate"
              value={progress}
            />
            <CardDeck
              steps={exam}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          </Box>
        )}
      </Container>
    </>
  );
};

export default ConfessionGuide;
