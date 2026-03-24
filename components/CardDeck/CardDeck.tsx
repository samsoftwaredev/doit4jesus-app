import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as React from 'react';

import { StarButton } from '@/components';
import { useLanguageContext } from '@/context/LanguageContext';
import { CardProps } from '@/interfaces';

interface Props {
  steps: CardProps[];
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

function CardDeck({ steps, setActiveStep, activeStep }: Props) {
  const { t } = useLanguageContext();
  const theme = useTheme();
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

  return (
    <Box>
      {steps
        .map((step, index) => (
          <Box key={step.question} my={2}>
            <Grid mx={1} container minHeight="250px" flexDirection="column">
              <Grid
                width="100%"
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Typography color="secondary.main" variant="h5" component="h3">
                  {index + 1}) {step.title}
                </Typography>
              </Grid>
              <Grid mx={2}>
                <Typography color="secondary.main" component="p">
                  {step.question}
                </Typography>
              </Grid>
              {(step.commandment ||
                step.type ||
                step.description ||
                (step.category && step.category.length > 0) ||
                (step.saints && step.saints.length > 0) ||
                (step.counsels && step.counsels.length > 0) ||
                (step.prevention && step.prevention.length > 0)) && (
                <Accordion
                  disableGutters
                  elevation={0}
                  sx={{
                    mt: 1,
                    '&:before': { display: 'none' },
                    bgcolor: 'transparent',
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" color="text.secondary">
                      {t.moreDetails}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Box display="flex" flexDirection="column" gap={1}>
                      {step.type && (
                        <Box display="flex" gap={1} alignItems="center">
                          <Typography variant="body2" fontWeight="bold">
                            {t.sinType}:
                          </Typography>
                          <Chip
                            label={
                              step.type === 'mortal' ? t.mortalSin : t.venialSin
                            }
                            size="small"
                            color={step.type === 'mortal' ? 'error' : 'warning'}
                          />
                        </Box>
                      )}
                      {step.commandment && (
                        <Typography variant="body2">
                          <strong>{t.commandment}:</strong> {step.commandment}
                        </Typography>
                      )}
                      {step.description && (
                        <Typography variant="body2" color="text.secondary">
                          {step.description}
                        </Typography>
                      )}
                      {step.saints && step.saints.length > 0 && (
                        <Box mt={1}>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            gutterBottom
                          >
                            🙏 {t.patronSaints}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            mb={0.5}
                          >
                            {t.saintsIntercession}
                          </Typography>
                          <Box display="flex" gap={0.5} flexWrap="wrap">
                            {step.saints.map((saint) => (
                              <Chip
                                key={saint}
                                label={saint}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      {step.counsels && step.counsels.length > 0 && (
                        <Box mt={1}>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            gutterBottom
                          >
                            📖 {t.counsels}
                          </Typography>
                          <List dense disablePadding>
                            {step.counsels.map((counsel) => (
                              <ListItem key={counsel} disableGutters>
                                <ListItemIcon sx={{ minWidth: 28 }}>
                                  <MenuBookIcon
                                    sx={{ fontSize: 16 }}
                                    color="info"
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={counsel}
                                  primaryTypographyProps={{
                                    variant: 'body2',
                                    color: 'text.secondary',
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                      {step.prevention && step.prevention.length > 0 && (
                        <Box mt={1}>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            gutterBottom
                          >
                            🛡️ {t.prevention}
                          </Typography>
                          <List dense disablePadding>
                            {step.prevention.map((tip) => (
                              <ListItem key={tip} disableGutters>
                                <ListItemIcon sx={{ minWidth: 28 }}>
                                  <HealthAndSafetyIcon
                                    sx={{ fontSize: 16 }}
                                    color="success"
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={tip}
                                  primaryTypographyProps={{
                                    variant: 'body2',
                                    color: 'text.secondary',
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}
            </Grid>
            <Grid container justifyContent="space-around">
              <Grid size={{ md: 4, sm: 4 }} textAlign="center">
                <Tooltip title={t.back}>
                  <span>
                    <IconButton
                      disabled={index === 0}
                      onClick={handleBack}
                      style={{ transform: 'scale(1.8)' }}
                    >
                      <ArrowCircleLeftIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
              <Grid size={{ md: 4, sm: 4 }} textAlign="center">
                <Tooltip title={t.yes}>
                  <Button
                    variant="contained"
                    onClick={() => handleSaveSin(index)}
                    startIcon={<CheckCircleIcon />}
                  >
                    {t.yes}
                  </Button>
                </Tooltip>
              </Grid>
              <Grid size={{ md: 4, sm: 4 }} textAlign="center">
                <Tooltip title={t.no}>
                  <Button
                    onClick={handleSkip}
                    variant="contained"
                    startIcon={<CancelIcon />}
                  >
                    No
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container justifyContent="center" mt={5} textAlign="center">
              <Button
                onClick={handleFinishExam}
                variant="outlined"
                size="small"
              >
                {t.finishExam}
              </Button>
            </Grid>
          </Box>
        ))
        .slice(activeStep, activeStep + 1)}
      {activeStep === steps.length && (
        <Box minHeight="250px" display="flex" flexDirection="column">
          <Typography variant="h5" my={2} textAlign={'center'}>
            {t.examCompleted}
          </Typography>
          {sinsCommitted.length > 0 ? (
            <Typography color="secondary.main" component="h5">
              {t.sinsToConfess}
            </Typography>
          ) : (
            <Typography
              textAlign="center"
              mb={3}
              color="text.secondary"
              component="h5"
            >
              {t.noSinsToConfess}
            </Typography>
          )}
          {sinsCommitted.map((step, index) => (
            <Grid key={step.title} px={2} py={1}>
              <Typography color="secondary.main" variant="h5">
                {index + 1}) {step.title}
              </Typography>
              <Typography color="secondary.main" ml={2} mb={1}>
                {step.question}
              </Typography>
              {step.saints && step.saints.length > 0 && (
                <Box ml={2} mb={1}>
                  <Typography variant="caption" color="text.secondary">
                    🙏 {t.saintsIntercession}
                  </Typography>
                  <Box display="flex" gap={0.5} flexWrap="wrap" mt={0.5}>
                    {step.saints.map((saint) => (
                      <Chip
                        key={saint}
                        label={saint}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              )}
              <Divider
                sx={{
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.24)'
                      : 'rgba(0, 0, 0, 0.24)',
                }}
              />
            </Grid>
          ))}
          <Box alignSelf="center">
            <Button
              variant="contained"
              color="error"
              onClick={handleReset}
              sx={{ mt: 1, mr: 1, width: '300px' }}
            >
              {t.startOver}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default CardDeck;
