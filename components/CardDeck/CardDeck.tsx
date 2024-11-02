import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import * as React from 'react';

import { StarButton } from '@/components';
import { CardProps } from '@/interfaces/index';
import { theme } from '@/styles/mui-overwrite';

interface Props {
  steps: CardProps[];
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

function CardDeck({ steps, setActiveStep, activeStep }: Props) {
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
  };

  return (
    <Box>
      {steps
        .map((step, index) => (
          <Box key={step.question} my={2}>
            <Grid mx={1} container minHeight="250px" flexDirection="column">
              <Grid
                width="100%"
                item
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Typography variant="h5" component="h3">
                  {index + 1}) {step.title}
                </Typography>
                <StarButton onClick={handelSave} />
              </Grid>
              <Grid mx={2}>
                <Typography color={theme.palette.secondary.main} component="p">
                  {step.question}
                </Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-around">
              <Grid item md={4} sm={4} textAlign="center">
                <Tooltip title="Back">
                  <span>
                    <IconButton
                      color="secondary"
                      disabled={index === 0}
                      onClick={handleBack}
                      style={{ transform: 'scale(1.8)' }}
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
                    style={{ transform: 'scale(1.8)' }}
                    color="error"
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item md={4} sm={4} textAlign="center">
                <Tooltip title="No">
                  <IconButton
                    color="error"
                    onClick={handleSkip}
                    style={{ transform: 'scale(1.8)' }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container justifyContent="center" mt={5} textAlign="center">
              <Button
                onClick={handleFinishExam}
                variant="outlined"
                size="small"
                color="secondary"
              >
                Finish Exam
              </Button>
            </Grid>
          </Box>
        ))
        .slice(activeStep, activeStep + 1)}
      {activeStep === steps.length && (
        <Box minHeight="250px" display="flex" flexDirection="column">
          <Typography variant="h5" my={2} textAlign={'center'}>
            Examination of Conscience Completed!
          </Typography>
          {sinsCommitted.length > 0 ? (
            <Typography color={theme.palette.secondary.main} component="h5">
              List of sins to confess:
            </Typography>
          ) : (
            <Typography textAlign="center" mb={3} color="grey" component="h5">
              Great! No need to go to confession.
            </Typography>
          )}
          {sinsCommitted.map((step, index) => (
            <Grid key={step.title} px={2} py={1}>
              <Typography variant="h5">
                {index + 1}) {step.title}
              </Typography>
              <Typography color={theme.palette.secondary.main} ml={2} mb={2}>
                {step.question}
              </Typography>
              <Divider sx={{ backgroundColor: 'white' }} />
            </Grid>
          ))}
          <Box alignSelf="center">
            <Button
              variant="contained"
              color="error"
              onClick={handleReset}
              sx={{ mt: 1, mr: 1, width: '300px' }}
            >
              Start Over
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default CardDeck;
