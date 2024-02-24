import { NAV_APP_LINKS } from "@/constants/nav";
import { theme } from "@/styles/mui-overwrite";
import { ChevronRight } from "@mui/icons-material";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./accountSetup.module.scss";
import jesusCross from "@/public/assets/images/hero/jesusCross.svg";
import jesusFish from "@/public/assets/images/hero/jesusFish.svg";
import maryRosary from "@/public/assets/images/rosary.svg";
import birthDay from "@/public/assets/images/hero/birthDay.svg";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import moment from "moment";
import { toast } from "react-toastify";
import { db } from "@/class/SupabaseDB";
import { useUserContext } from "@/context/UserContext";

interface StepProps {
  next: (skipToEnd?: boolean) => void;
}

const KnowledgeStep = ({ next }: StepProps) => {
  const onClick = (quantity: string) => {
    if (quantity === "always") next(true);
    else next();
  };

  return (
    <Box className={styles.stepperContent}>
      <Typography
        style={{ color: "black" }}
        variant="h3"
        className={styles.title}
      >
        How Often You Pray The Rosary?
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
  );
};

const WhatsTheRosary = ({ next }: StepProps) => {
  return (
    <Box className={styles.stepperContent}>
      <Typography variant="h3" className={styles.title}>
        What's The Rosary?
      </Typography>
      <Typography my={5} color="secondary" className={styles.body}>
        The Rosary is a Scripture-based prayer.
        <br />
        <br />
        The word rosary comes from Latin and means a garland of roses, the rose
        being one of the flowers used to symbolize the Virgin Mary. However,
        it's also a powerful weapon.
      </Typography>
      <Typography color="secondary" className={styles.body}>
        Don't believe me? Check this inspiring story of Fr. Don Calloway of the
        Rosary.
      </Typography>
      <iframe
        src="https://www.youtube.com/embed/y1MdrO__5-g?si=9iLYqkxEzUAKd6NQ"
        className="iframeYoutube"
        title="What's The Rosary?"
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

const WhyPray = ({ next }: StepProps) => {
  return (
    <Box className={styles.stepperContent}>
      <Typography variant="h3" className={styles.title}>
        Why Pray The Rosary?
      </Typography>
      <Typography my={5} color="secondary" className={styles.body}>
        The Catechism says that we pray as we live, because we live as we pray
        &nbsp;
        <a
          href="http://www.scborromeo.org/ccc/para/2725.htm"
          target="CATECHISM_2725"
        >
          (2725)
        </a>
        . If we are living without prayer, we are living without God. Without
        perseverance in prayer, we risk falling back into the slavery of sin.
      </Typography>
      <Typography color="secondary" className={styles.body}>
        Do you think praying the rosary is powerful? Watch the video.
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

const WhenIsYourBirthDay = ({ next }: StepProps) => {
  const { user, setUser } = useUserContext();
  const [dob, setDob] = useState<Date>();

  const setDateOfBirth = (date: Date) => {
    const userBirthDay = new Date(date);
    const validAge = 18;
    const isLegal = moment().diff(moment(userBirthDay), "years") >= validAge;
    if (isLegal) {
      setDob(userBirthDay);
    } else {
      setDob(undefined);
      toast.error(
        `You're too young! You must be at least ${validAge} years old`
      );
    }
  };

  const storeUserBirthDay = async () => {
    if (dob && user) {
      const { error } = await db
        .getProfiles()
        .update({ birth_date: dob.toUTCString() })
        .eq("id", user.userId)
        .select();
      setUser({ ...user, dateOfBirth: dob.toUTCString() });
      if (error) {
        toast.error("Unable to save your date of birth");
      } else {
        next();
      }
    }
  };

  return (
    <Box className={styles.stepperContent}>
      <Typography variant="h3" className={styles.title}>
        Let's Celebrate The Good Times
      </Typography>
      <Typography textAlign="center" color="secondary" className={styles.body}>
        Enter your date of birth:
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          sx={{
            "backdrop-filter": "blur(10px)",
            borderRadius: "20px",
            color: "white",
            "& .MuiTypography-root": { color: "white" },
            "& .MuiButtonBase-root": { color: "white" },
          }}
          defaultValue={dayjs(new Date())}
          onChange={setDateOfBirth}
        />
      </LocalizationProvider>
      <Grid container justifyContent="flex-end">
        <Button
          disabled={dob === undefined}
          size="large"
          color="secondary"
          variant="contained"
          endIcon={<ChevronRight />}
          onClick={storeUserBirthDay}
        >
          Continue
        </Button>
      </Grid>
    </Box>
  );
};

const Intro = ({ next }: StepProps) => {
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
        Let's get to know you...
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
          router.push(NAV_APP_LINKS.app.link);
          return step;
        }
        return step + 1;
      });
    }
  };

  steps = [
    {
      component: <Intro next={nextStep} />,
      color: theme.palette.error.dark,
      backgroundImage: jesusFish,
    },
    {
      component: <KnowledgeStep next={nextStep} />,
      color: "#ffffff",
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
    {
      component: <WhenIsYourBirthDay next={nextStep} />,
      color: theme.palette.primary.main,
      backgroundImage: birthDay,
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
