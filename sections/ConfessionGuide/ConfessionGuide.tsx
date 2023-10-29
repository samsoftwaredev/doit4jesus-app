import React, { useState } from "react";
import { CardProps, ExamTypes } from "@/interfaces/index";
import { TitleNav, CardDeck } from "@/components";
import adultExamOfConscience from "@/data/adultExamOfConscience.json";
import teenExamOfConscience from "@/data/teenExamOfConscience.json";
import childExamOfConscience from "@/data/childExamOfConscience.json";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";

enum ActiveScreen {
  selectExam = 0,
  examOfConscience = 1,
}

const exams: ExamTypes = {
  child: {
    label: "Child Examination of Conscience",
    value: childExamOfConscience,
  },
  teen: {
    label: "Teen Examination of Conscience",
    value: teenExamOfConscience,
  },
  adult: {
    label: "Adult Examination of Conscience",
    value: adultExamOfConscience,
  },
};

const ConfessionGuide = () => {
  const router = useRouter();
  const [exam, setExam] = useState<CardProps[]>(exams.adult.value);
  const [activeStep, setActiveStep] = useState(0);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(
    ActiveScreen.selectExam
  );
  const [openWarning, setOpenWarning] = useState(true);
  const [openNote, setOpenNote] = useState(true);
  const progress = (activeStep / exam.length) * 100;
  const examTypes = Object.values(exams).map(
    (examOfConscience) => examOfConscience
  );

  const handelBack = () => {
    history.back();
  };

  const handelCloseWarning = () => {
    setOpenWarning(false);
  };

  const handelCloseNote = () => {
    setOpenNote(false);
  };

  const onExamSelected = (type: string) => {
    setActiveScreen(ActiveScreen.examOfConscience);
  };

  return (
    <>
      <LinearProgress variant="determinate" value={progress} />
      <Container maxWidth="sm">
        <Box my={2}>
          <TitleNav
            onBack={handelBack}
            subTitle="Confession (Reconciliation)"
            title="Exam of Conscience"
            description="A Step by Step Guide"
          />
        </Box>
        <Collapse in={openWarning}>
          <Alert severity="warning" onClose={handelCloseWarning}>
            A warning should be given to souls who are inclined to scrupulosity.
            Such souls are disturbed by reading lists of sins, because they
            wrongly think themselves to guilty where they are not. They should
            have permissions of their confessor before they start the
            examination.
          </Alert>
        </Collapse>
        <Collapse in={openNote}>
          <Alert severity="info" onClose={handelCloseNote}>
            Note that <b>mortal sin</b> is not committed unless three conditions
            are preset:&nbsp;
            <b>
              sufficient reflection, full consent of will, and a violation of
              God's law in a serious matter
            </b>
            .
          </Alert>
        </Collapse>
        {activeScreen === ActiveScreen.selectExam && (
          <>
            <Typography>Select type of conscience examination:</Typography>
            <Box display="flex" flexDirection="column" gap="1em">
              {examTypes.map(({ label }) => (
                <Button
                  onClick={() => onExamSelected(label)}
                  variant="contained"
                  fullWidth
                  key={label}
                >
                  {label}
                </Button>
              ))}
            </Box>
          </>
        )}
        {activeScreen === ActiveScreen.examOfConscience && (
          <CardDeck
            steps={exam}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        )}
      </Container>
    </>
  );
};

export default ConfessionGuide;
