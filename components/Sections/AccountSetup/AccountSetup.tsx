import { ChevronRight } from '@mui/icons-material';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { NAV_APP_LINKS } from '@/constants/nav';
import { useUserContext } from '@/context/UserContext';
import jesusCross from '@/public/assets/images/hero/jesusCross.svg';
import jesusFish from '@/public/assets/images/hero/jesusFish.svg';
import maryRosary from '@/public/assets/images/rosary.svg';
import { theme } from '@/styles/mui-overwrite';

import styles from './accountSetup.module.scss';

interface StepProps {
  next: (skipToEnd?: boolean) => void;
}

const WhatsTheRosary = ({ next }: StepProps) => {
  return (
    <Box className={styles.stepperContent}>
      <Typography variant="h3" className={styles.title}>
        What is The Rosary?
      </Typography>
      <Typography
        my={5}
        textAlign="center"
        color="secondary"
        className={styles.body}
      >
        At its heart, the Rosary is a prayer deeply rooted in Scripture, guiding
        us through the life of Christ with the rhythm of Hail Marys.
        <br />
        <br /> The term &apos;rosary&apos; derives from the Latin for
        &apos;garland of roses,&apos; with each rose representing a prayer and a
        tribute to the Virgin Mary.
      </Typography>
      <Grid mt={2} container justifyContent="flex-end">
        <Button
          size="large"
          color="secondary"
          variant="contained"
          endIcon={<ChevronRight />}
          onClick={() => next()}
        >
          Continue
        </Button>
      </Grid>
    </Box>
  );
};

const WhyPray = ({ next }: StepProps) => {
  return (
    <Box className={styles.stepperContent}>
      <Typography variant="h3" className={styles.title}>
        Why Pray The Rosary?
      </Typography>
      <Typography color="secondary" className={styles.body}>
        Discover the secret power that millions of people are using to transform
        their lives. 🙏✨ Tune in to Father Don Calloway’s eloquent discourse on
        the Rosary and its profound significance.
      </Typography>
      <iframe
        className="iframeYoutube"
        src="https://www.youtube.com/embed/x1tH_zQ-Cz0?si=f5nh--UPvn9ZIQ7v"
        title="Why Pray The Rosary?"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
      <Grid mt={2} container justifyContent="flex-end">
        <Button
          size="large"
          color="secondary"
          variant="contained"
          endIcon={<ChevronRight />}
          onClick={() => next()}
        >
          Continue
        </Button>
      </Grid>
    </Box>
  );
};

const Intro = ({ next }: StepProps) => {
  const { user } = useUserContext();

  return (
    <Box className={styles.stepperContent}>
      <Typography variant="h3" className={styles.title}>
        Pray with millions around the world!
      </Typography>
      <Typography
        my={5}
        textAlign="center"
        color="secondary"
        className={styles.body}
      >
        Welcome aboard {user?.firstName} {user?.lastName}, and may your WiFi be
        as uninterrupted as your prayers. ✨
      </Typography>
      <Typography
        my={5}
        textAlign="center"
        color="secondary"
        className={styles.body}
      >
        You&apos;ve just completed the divine achievement of joining the most
        spirited Rosary prayer group online.
      </Typography>
      <Grid container justifyContent="flex-end">
        <Button
          size="large"
          color="secondary"
          variant="contained"
          endIcon={<ChevronRight />}
          onClick={() => next()}
        >
          Start
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
      component: <Intro next={nextStep} />,
      color: theme.palette.success.main,
      backgroundImage: jesusFish,
    },
    {
      component: <WhatsTheRosary next={nextStep} />,
      color: theme.palette.error.dark,
      backgroundImage: maryRosary,
    },
    {
      component: <WhyPray next={nextStep} />,
      color: theme.palette.success.dark,
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
