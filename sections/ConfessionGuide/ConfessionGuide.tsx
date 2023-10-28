import React, { useState } from "react";
import { CardProps, ExamTypes } from "@/interfaces/index";
import { TitleNav, CardDeck } from "@/components";
import adultExamOfConscience from "@/data/examOfConscience.json";
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

const exams: ExamTypes = {
  adult: {
    label: "Adult Examination of Conscience",
    value: adultExamOfConscience,
  },
  child: {
    label: "Child Examination of Conscience",
    value: adultExamOfConscience,
  },
  teen: {
    label: "Teen Examination of Conscience",
    value: adultExamOfConscience,
  },
};

const ConfessionGuide = () => {
  const router = useRouter();
  const [exam, setExam] = useState<CardProps[]>(exams.adult.value);
  const [activeStep, setActiveStep] = React.useState(0);
  const [openWarning, setOpenWarning] = React.useState(true);
  const [openNote, setOpenNote] = React.useState(true);
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

  return (
    <>
      <LinearProgress variant="determinate" value={progress} />
      <Container maxWidth="sm">
        <TitleNav
          onBack={handelBack}
          subTitle="Confession (Reconciliation)"
          title="Exam of Conscience"
          description="A Step by Step Guide"
        />
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
        <Typography>Select type of conscience examination:</Typography>
        <Box display="flex" flexDirection="column" gap="1em">
          {examTypes.map(({ label }) => (
            <Button variant="contained" fullWidth key={label}>
              {label}
            </Button>
          ))}
        </Box>
        <CardDeck
          steps={exam}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </Container>
    </>
  );
};

export default ConfessionGuide;
