import React, { useState } from "react";
import { CardProps, ExamTypes } from "@/interfaces";
import { CardDeck, SelectExamOfConscience } from "@/components";
import adultExamOfConscience from "@/data/adultExamOfConscience.json";
import teenExamOfConscience from "@/data/teenExamOfConscience.json";
import childExamOfConscience from "@/data/childExamOfConscience.json";
import { Alert, Box, Collapse, Container, LinearProgress } from "@mui/material";

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
  const [exam, setExam] = useState<CardProps[]>(exams.adult.value);
  const [activeStep, setActiveStep] = useState(0);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(
    ActiveScreen.selectExam
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
    setActiveScreen(ActiveScreen.examOfConscience);
    switch (type) {
      case "Child Examination of Conscience":
        setExam(exams.child.value);
        break;
      case "Teen Examination of Conscience":
        setExam(exams.teen.value);
        break;
      case "Adult Examination of Conscience":
        setExam(exams.adult.value);
        break;
      default:
        console.error("Invalid type for exam selected " + type);
    }
  };

  return (
    <>
      {/* <LinearProgress variant="determinate" value={progress} /> */}
      <Container className="container-box" maxWidth="sm">
        {/* <Box my={2}>
          <TitleNav
            onBack={handelBack}
            subTitle="Confession (Reconciliation)"
            title="Exam of Conscience"
            description="A Step by Step Guide"
          />
        </Box> */}
        <Box display="flex" gap={1} flexDirection="column">
          <Collapse in={openWarning}>
            <Alert severity="warning" onClose={handelCloseWarning}>
              A warning should be given to souls who are inclined to
              scrupulosity. Such souls are disturbed by reading lists of sins,
              because they wrongly think themselves to guilty where they are
              not. They should have permissions of their confessor before they
              start the examination.
            </Alert>
          </Collapse>
          <Collapse in={openNote}>
            <Alert severity="info" onClose={handelCloseNote}>
              Note that <b>mortal sin</b> is not committed unless three
              conditions are preset:&nbsp;
              <b>
                sufficient reflection, full consent of will, and a violation of
                God&apos;s law in a serious matter
              </b>
              .
            </Alert>
          </Collapse>
        </Box>
        {activeScreen === ActiveScreen.selectExam && (
          <SelectExamOfConscience onExamSelected={onExamSelected} />
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
