import * as React from "react";
import {
  Box,
  Step,
  StepContent,
  Button,
  Paper,
  Typography,
  LinearProgress,
} from "@mui/material";
import { CardProps } from "@/interfaces/index";

interface Props {
  steps: CardProps[];
}

function CardDeck({ steps }: Props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const progress = (activeStep / steps.length) * 100;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <LinearProgress variant="determinate" value={progress} />
      {steps
        .map((step, index) => (
          <Box key={step.title}>
            <Typography>{step.question}</Typography>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ mt: 1, mr: 1 }}
              >
                {index === steps.length - 1 ? "Finish" : "Continue"}
              </Button>
              <Button
                disabled={index === 0}
                onClick={handleBack}
                sx={{ mt: 1, mr: 1 }}
              >
                Back
              </Button>
            </Box>
          </Box>
        ))
        .slice(activeStep, activeStep + 1)}
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default CardDeck;
