import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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

const SetupContainer = styled('div')({
  zIndex: 2,
  margin: '60px 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StepperContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '50px',
});

const BackgroundImg = styled(Image)({
  maxHeight: '100vh',
  display: 'none',
  opacity: 0.1,
  left: '-380px !important',
  '@media (min-width: 768px)': {
    display: 'block',
    position: 'fixed',
    left: 0,
  },
});

const StepTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  textAlign: 'center',
  fontWeight: 100,
}));

const ContentContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
});

const Body = styled(Typography)({
  margin: '20px auto',
  maxWidth: '400px',
});

const Bg = styled('div')({
  zIndex: -1,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  transition: '1s all',
});

const Badge = styled(Image)({
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  margin: '20px 0',
});

interface StepProps {
  prevStep: () => void;
  nextStep: (skipToEnd?: boolean) => void;
}

const WhatsTheRosary = ({ nextStep, prevStep }: StepProps) => {
  const { t } = useLanguageContext();
  return (
    <StepperContent>
      <StepTitle variant="h3">{t.whatIsTheRosary}</StepTitle>
      <Body my={5} textAlign="center" sx={{ color: 'white' }}>
        {t.whatIsTheRosaryDescription}
      </Body>
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
    </StepperContent>
  );
};

const WhyPray = ({ prevStep, nextStep }: StepProps) => {
  const { t } = useLanguageContext();
  return (
    <StepperContent>
      <StepTitle sx={{ color: 'white' }} variant="h3">
        {t.whyPrayTheRosary}
      </StepTitle>
      <Body my={3} color="secondary">
        {t.whyPrayTheRosaryDescription}
      </Body>
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
    </StepperContent>
  );
};

const WhatAreTheBenefits = ({ prevStep, nextStep }: StepProps) => {
  const { t } = useLanguageContext();
  return (
    <StepperContent>
      <StepTitle variant="h3">{t.whatAreTheBenefits}</StepTitle>
      <Body my={3} sx={{ color: 'white' }}>
        {t.whatAreTheBenefitsDescription}
      </Body>
      <Body my={3} sx={{ color: 'white' }}>
        <Markdown>{t.whatAreTheBenefitsOfRosary}</Markdown>
      </Body>
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
    </StepperContent>
  );
};

const Intro = ({ nextStep }: StepProps) => {
  const { user } = useUserContext();
  const { t } = useLanguageContext();

  return (
    <StepperContent>
      <StepTitle variant="h3">{t.welcomeTitle}</StepTitle>
      <Body my={5} textAlign="center" sx={{ color: 'white' }}>
        {t.welcomeDescription
          .replace('{{firstName}}', user?.firstName || '')
          .replace('{{lastName}}', user?.lastName || '')}
      </Body>
      <ConfettiCelebration />
      <Badge
        src={joinedAppBadge}
        alt="You've just completed the divine achievement."
      />
      <Body my={5} textAlign="center" sx={{ color: 'white' }}>
        {t.joinedAppBadge}
      </Body>

      <Grid container justifyContent="space-between" gap={2}>
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
    </StepperContent>
  );
};

const AccountSetup = () => {
  const theme = useTheme();
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
      color: theme.palette.error.light,
      backgroundImage: maryRosary,
    },
    {
      component: <WhatAreTheBenefits prevStep={prevStep} nextStep={nextStep} />,
      color: theme.palette.secondary.dark,
      backgroundImage: jesusCross,
    },
    {
      component: <WhyPray prevStep={prevStep} nextStep={nextStep} />,
      color: '#a3a3a3',
      backgroundImage: jesusCross,
    },
  ];

  useEffect(() => {
    setBgColor(steps[currentStep].color);
  }, [currentStep]);

  return (
    <>
      <Bg style={{ backgroundColor: bgColor }} />
      {steps[currentStep].backgroundImage && (
        <BackgroundImg
          fill
          src={steps[currentStep].backgroundImage!}
          alt="Jesus Cross"
        />
      )}
      <SetupContainer>
        <ContentContainer maxWidth="md">
          {steps[currentStep].component}
        </ContentContainer>
      </SetupContainer>
    </>
  );
};

export default AccountSetup;
