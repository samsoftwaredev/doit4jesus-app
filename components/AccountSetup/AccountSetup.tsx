import { NAV_APP_LINKS } from "@/constants/nav";
import { theme } from "@/styles/mui-overwrite";
import { ChevronRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./accountSetup.module.scss";
import jesusFish from "@/public/assets/images/hero/jesusFish.svg";
import jesusCross from "@/public/assets/images/hero/jesusCross.svg";
import rosary from "@/public/assets/images/rosary.svg";
import Image from "next/image";
import { MainNavbar } from "../Navbars";

interface StepProps {
  next: () => void;
}

const KnowledgeStep = ({ next }: StepProps) => {
  const onClick = (quantity: string) => {
    // TODO: call API
    next();
  };

  return (
    <>
      <Box className={styles.stepperContent}>
        <Typography variant="h3" className={styles.title}>
          How often you pray the Rosary?
        </Typography>
        <Grid container className={styles.buttons} gap={2}>
          <Button
            onClick={() => onClick("always")}
            variant="contained"
            color="secondary"
          >
            Daily
          </Button>
          <Button
            onClick={() => onClick("sometimes")}
            variant="contained"
            color="secondary"
          >
            Sometimes
          </Button>
          <Button
            onClick={() => onClick("never")}
            variant="contained"
            color="secondary"
          >
            Never
          </Button>
        </Grid>
      </Box>
    </>
  );
};

const WhatsTheRosary = ({ next }: StepProps) => {
  return (
    <>
      <Box className={styles.stepperContent}>
        <Typography variant="h3" className={styles.title}>
          What's the Rosary?
        </Typography>
        <Typography
          my={5}
          textAlign="center"
          color="secondary"
          className={styles.body}
        >
          The Rosary is a Scripture-based prayer.
          <br />
          <br />
          The word rosary comes from Latin and means a garland of roses, the
          rose being one of the flowers used to symbolize the Virgin Mary.
        </Typography>
        <Grid container justifyContent="flex-end">
          <Button
            size="large"
            color="secondary"
            variant="contained"
            endIcon={<ChevronRight />}
            onClick={next}
          >
            Continue
          </Button>
        </Grid>
      </Box>
    </>
  );
};

const WhyPray = ({ next }: StepProps) => {
  return (
    <>
      <Box className={styles.stepperContent}>
        <Typography variant="h3" className={styles.title}>
          Why pray?
        </Typography>
        <Typography
          my={5}
          textAlign="center"
          color="secondary"
          className={styles.body}
        >
          The Catechism says that we pray as we live, because we live as we
          pray. If we are living without prayer, we are living without God.
          Without perseverance in prayer, we risk falling back into the slavery
          of sin.
        </Typography>
        <Grid container justifyContent="flex-end">
          <Button
            size="large"
            color="secondary"
            variant="contained"
            endIcon={<ChevronRight />}
            onClick={next}
          >
            Continue
          </Button>
        </Grid>
      </Box>
    </>
  );
};

const WhyPrayTheRosary = ({ next }: StepProps) => {
  return (
    <>
      <Box className={styles.stepperContent}>
        <Typography variant="h3" className={styles.title}>
          Why pray the Rosary?
        </Typography>
        <Typography
          my={5}
          textAlign="center"
          color="secondary"
          className={styles.body}
        >
          Whoever shall recite the Rosary devoutly, God will not chastise him in
          His justice, he shall not perish by an unprovided death; if he be
          just, he shall remain in the grace of God, and become worthy of
          eternal life.
        </Typography>
        <Grid container justifyContent="flex-end">
          <Button
            size="large"
            color="secondary"
            variant="contained"
            endIcon={<ChevronRight />}
            onClick={next}
          >
            Continue
          </Button>
        </Grid>
      </Box>
    </>
  );
};

const Intro = ({ next }: StepProps) => {
  return (
    <>
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
          Let's get to know you...
        </Typography>
        <Grid container justifyContent="flex-end">
          <Button
            size="large"
            color="secondary"
            variant="contained"
            endIcon={<ChevronRight />}
            onClick={next}
          >
            Start
          </Button>
        </Grid>
      </Box>
    </>
  );
};

const AccountSetup = () => {
  let steps: Array<{ component: React.ReactNode; color: string }> = [];
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [bgColor, setBgColor] = useState(theme.palette.error.dark);

  const nextStep = () => {
    setCurrentStep((step) => {
      if (step >= steps.length - 1) {
        router.push(NAV_APP_LINKS.app.link);
        return step;
      }
      return step + 1;
    });
  };

  steps = [
    { component: <Intro next={nextStep} />, color: theme.palette.error.dark },
    {
      component: <KnowledgeStep next={nextStep} />,
      color: theme.palette.warning.dark,
    },
    {
      component: <WhatsTheRosary next={nextStep} />,
      color: theme.palette.primary.main,
    },
    {
      component: <WhyPray next={nextStep} />,
      color: theme.palette.success.dark,
    },
    {
      component: <WhyPrayTheRosary next={nextStep} />,
      color: theme.palette.info.dark,
    },
  ];

  useEffect(() => {
    setBgColor(steps[currentStep].color);
  }, [currentStep]);

  return (
    <>
      <div className={styles.bg} style={{ backgroundColor: bgColor }} />
      <MainNavbar onlyLogo />
      <div className={styles.container}>
        <Container className={styles.content} maxWidth="md">
          <Image src={jesusCross} alt="Jesus Cross" />
          {steps[currentStep].component}
        </Container>
      </div>
    </>
  );
};

export default AccountSetup;
