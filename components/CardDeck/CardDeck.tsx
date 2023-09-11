import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { CardProps } from "@/interfaces/index";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { StarButton } from "@/components";
import { useToastContext } from "@/context/ToastContext";

interface Props {
  steps: CardProps[];
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

function CardDeck({ steps, setActiveStep, activeStep }: Props) {
  const { setToast } = useToastContext();
  const [sinsCommitted, setSinsCommitted] = React.useState<CardProps[]>([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
    sinsCommitted.pop();
  };

  const handleReset = () => {
    setActiveStep(0);
    setSinsCommitted([]);
  };

  const handleSaveSin = (index: number) => {
    handleNext();
    setSinsCommitted([...sinsCommitted, steps[index]]);
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleFinishExam = () => {
    setActiveStep(steps.length);
  };

  const handelSave = () => {
    // TODO: API call to save
    console.log("saved");
    setToast({ open: true, message: "Question saved!", type: "success" });
  };

  return (
    <Box>
      {steps
        .map((step, index) => (
          <Box key={step.question} my={2}>
            <Grid container height="250px" flexDirection="column">
              <Grid
                width="100%"
                item
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <h5>{step.title}</h5>
                <StarButton onClick={handelSave} />
              </Grid>
              <Grid item>
                <p>{step.question}</p>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-around">
              <Grid item md={4} sm={4} textAlign="center">
                <Tooltip title="Back">
                  <span>
                    <IconButton
                      disabled={index === 0}
                      onClick={handleBack}
                      style={{ transform: "scale(1.8)" }}
                    >
                      <ArrowCircleLeftIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
              <Grid item md={4} sm={4} textAlign="center">
                <Tooltip title="Yes">
                  <IconButton
                    onClick={() => handleSaveSin(index)}
                    style={{ transform: "scale(1.8)" }}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item md={4} sm={4} textAlign="center">
                <Tooltip title="No">
                  <IconButton
                    onClick={handleSkip}
                    style={{ transform: "scale(1.8)" }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container justifyContent="center" my={5} textAlign="center">
              <Button
                onClick={handleFinishExam}
                variant="outlined"
                size="small"
              >
                Finish Exam
              </Button>
            </Grid>
          </Box>
        ))
        .slice(activeStep, activeStep + 1)}
      {activeStep === steps.length && (
        <Box>
          <p>Examination of Conscience completed</p>
          {sinsCommitted.length > 0 ? (
            <h5>List of sins to confess:</h5>
          ) : (
            <h5>Great! No need to go to confession.</h5>
          )}
          {sinsCommitted.map((step) => (
            <Grid px={2} py={1}>
              <h6>{step.title}</h6>
              <p>{step.question}</p>
            </Grid>
          ))}
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{ mt: 1, mr: 1 }}
          >
            Reset
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default CardDeck;
