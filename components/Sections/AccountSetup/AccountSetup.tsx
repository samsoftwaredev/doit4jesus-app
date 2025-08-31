import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

import { ConfettiCelebration } from '@/components';
import { NAV_APP_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import joinedAppBadge from '@/public/assets/images/badges/divineRosaryPrayerParticipationBadge.png';
import jesusCross from '@/public/assets/images/hero/jesusCross.svg';
import jesusFish from '@/public/assets/images/hero/jesusFish.svg';
import maryRosary from '@/public/assets/images/rosary.svg';
import { theme } from '@/styles/mui-overwrite';

import styles from './accountSetup.module.scss';

interface StepProps {
  prevStep: () => void;
  nextStep: (skipToEnd?: boolean) => void;
}

const WhatsTheRosary = ({ nextStep, prevStep }: StepProps) => {
  const { t } = useLanguageContext();
  return (
    <Box className={styles.stepperContent}>
      <Typography variant="h3" className={styles.title}>
        {t.whatIsTheRosary}
      </Typography>
      <Typography
        my={5}
        textAlign="center"
        color="secondary"
        className={styles.body}
      >
        {t.whatIsTheRosaryDescription}
      </Typography>
      <Grid mt={2} container justifyContent="space-between">
        <Button
          size="large"
          color="secondary"
          variant="text"
          startIcon={<ChevronLeft />}
          onClick={() => prevStep()}
        >
          {t.back}
        </Button>
        <Button
          size="large"
          color="secondary"
          variant="contained"
          endIcon={<ChevronRight />}
          onClick={() => nextStep()}
        >
          {t.continue}
        </Button>
      </Grid>
    </Box>
  );
};

const WhyPray = ({ prevStep, nextStep }: StepProps) => {
  const { t } = useLanguageContext();
  return (
    <Box className={styles.stepperContent}>
      <Typography variant="h3" className={styles.title}>
        {t.whyPrayTheRosary}
      </Typography>
      <Typography my={3} color="secondary" className={styles.body}>
        {t.whyPrayTheRosaryDescription}
      </Typography>
      <iframe
        className="iframeYoutube"
        src="https://www.youtube.com/embed/x1tH_zQ-Cz0?si=f5nh--UPvn9ZIQ7v"
        title="Why Pray The Rosary?"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
      <Grid mt={2} container justifyContent="space-between">
        <Button
          size="large"
          color="secondary"
          variant="text"
          startIcon={<ChevronLeft />}
          onClick={() => prevStep()}
        >
          {t.back}
        </Button>
        <Button
          size="large"
          color="secondary"
          variant="contained"
          endIcon={<ChevronRight />}
          onClick={() => nextStep()}
        >
          {t.finish}
        </Button>
      </Grid>
    </Box>
  );
};

const WhatAreTheBenefits = ({ prevStep, nextStep }: StepProps) => {
  const { t } = useLanguageContext();
  return (
    <Box className={styles.stepperContent}>
      <Typography variant="h3" className={styles.title}>
        {t.whatAreTheBenefits}
      </Typography>
      <Typography my={3} color="secondary" className={styles.body}>
        {t.whatAreTheBenefitsDescription}
      </Typography>
      <Typography my={3} color="secondary" className={styles.body}>
        <Markdown>{t.whatAreTheBenefitsOfRosary}</Markdown>
      </Typography>
      <Grid mt={2} container justifyContent="space-between">
        <Button
          size="large"
          color="secondary"
          variant="text"
          startIcon={<ChevronLeft />}
          onClick={() => prevStep()}
        >
          {t.back}
        </Button>
        <Button
          size="large"
          color="secondary"
          variant="contained"
          endIcon={<ChevronRight />}
          onClick={() => nextStep()}
        >
          {t.continue}
        </Button>
      </Grid>
    </Box>
  );
};

const Intro = ({ nextStep }: StepProps) => {
  const { user } = useUserContext();
  const { t } = useLanguageContext();

  return (
    <Box className={styles.stepperContent}>
      <Typography variant="h3" className={styles.title}>
        {t.welcomeTitle}
      </Typography>
      <Typography
        my={5}
        textAlign="center"
        color="secondary"
        className={styles.body}
      >
        {t.welcomeDescription
          .replace('{{firstName}}', user?.firstName || '')
          .replace('{{lastName}}', user?.lastName || '')}
      </Typography>
      <ConfettiCelebration />
      <Image
        className={styles.badge}
        src={joinedAppBadge}
        alt="You've just completed the divine achievement."
      />
      <Typography
        my={5}
        textAlign="center"
        color="secondary"
        className={styles.body}
      >
        {t.joinedAppBadge}
      </Typography>

      <Grid container justifyContent="space-between">
        <Button
          size="large"
          variant="contained"
          startIcon={<Close />}
          onClick={() => nextStep(true)}
        >
          {t.skip}
        </Button>
        <Button
          size="large"
          color="secondary"
          variant="contained"
          endIcon={<ChevronRight />}
          onClick={() => nextStep()}
        >
          {t.continue}
        </Button>
      </Grid>
    </Box>
  );
};

const AccountSetup = () => {
  let steps: Array<{
    component: React.ReactNode;
    color: string;
    backgroundImage?: string;
  }> = [];
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [bgColor, setBgColor] = useState(theme.palette.error.dark);

  const prevStep = () => {
    setCurrentStep((step) => {
      if (step <= 0) {
        return step;
      }
      return step - 1;
    });
  };

  const nextStep = (skipToEnd = false) => {
    if (skipToEnd === true) {
      setCurrentStep(steps.length - 1);
    } else {
      setCurrentStep((step) => {
        if (step >= steps.length - 1) {
          router.push(NAV_APP_LINKS.dashboard.link);
          return step;
        }
        return step + 1;
      });
    }
  };

  steps = [
    {
      component: <Intro prevStep={prevStep} nextStep={nextStep} />,
      color: theme.palette.success.main,
      backgroundImage: jesusFish,
    },
    {
      component: <WhatsTheRosary prevStep={prevStep} nextStep={nextStep} />,
      color: theme.palette.error.dark,
      backgroundImage: maryRosary,
    },
    {
      component: <WhatAreTheBenefits prevStep={prevStep} nextStep={nextStep} />,
      color: theme.palette.secondary.dark,
      backgroundImage: jesusCross,
    },
    {
      component: <WhyPray prevStep={prevStep} nextStep={nextStep} />,
      color: '#000000',
      backgroundImage: jesusCross,
    },
  ];

  useEffect(() => {
    setBgColor(steps[currentStep].color);
  }, [currentStep]);

  return (
    <>
      <div className={styles.bg} style={{ backgroundColor: bgColor }} />
      {steps[currentStep].backgroundImage && (
        <Image
          className={styles.backgroundImg}
          fill
          src={steps[currentStep].backgroundImage!}
          alt="Jesus Cross"
        />
      )}
      <div className={styles.container}>
        <Container className={styles.content} maxWidth="md">
          {steps[currentStep].component}
        </Container>
      </div>
    </>
  );
};

export default AccountSetup;
