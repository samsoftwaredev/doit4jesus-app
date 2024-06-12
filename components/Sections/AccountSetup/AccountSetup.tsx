import { NAV_APP_LINKS } from "@/constants/nav";
import { theme } from "@/styles/mui-overwrite";
import { ChevronRight } from "@mui/icons-material";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { db } from "classes/SupabaseDB";
import { useUserContext } from "@/context/UserContext";
import { maxAge, minAge } from "@/constants/global";

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
      <Typography
        style={{ color: "black" }}
        textAlign="center"
        className={styles.body}
      >
        Whether you&apos;re a seasoned prayer warrior or just starting to
        explore the mysteries of the Rosary, we&apos;re here for you. No
        judgment here if your Rosary is a bit dusty – we all began somewhere.
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
        What is The Rosary?
      </Typography>
      <Typography
        my={5}
        textAlign="center"
        color="secondary"
        className={styles.body}
      >
        At its heart, the Rosary is a prayer deeply rooted in Scripture, guiding
        us through the life of Christ with the rhythm of Hail Marys. The term
        &apos;rosary&apos; derives from the Latin for &apos;garland of
        roses,&apos; with each rose representing a prayer and a tribute to the
        Virgin Mary.
        <br />
        <br />
        Embrace the Rosary, not just as a chain of prayers, but as a blossoming
        garden of faith, where each bead is a step closer to divine love and
        wisdom.
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
        Tune in to Father Don Calloway’s eloquent discourse on the Rosary and
        its profound significance. Afterward, you will be ready to embark on
        this journey of profound prayer.
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

type DobProps = {
  dob: Date | undefined;
  setDob: Dispatch<SetStateAction<Date | undefined>>;
} & StepProps;

const WhenIsYourBirthDay = ({ next, setDob, dob }: DobProps) => {
  const { user } = useUserContext();

  const setDateOfBirth = (date: Date) => {
    const userBirthDay = new Date(date);
    const isLegal = moment().diff(moment(userBirthDay), "years") >= minAge;
    if (isLegal) {
      setDob(userBirthDay);
    } else {
      setDob(undefined);
      toast.error(`You must be at least ${minAge} years old.`);
    }
  };

  const storeUserBirthDay = async () => {
    if (dob && user) {
      const { error } = await db
        .getProfiles()
        .update({ birth_date: dob.toUTCString() })
        .eq("id", user.userId)
        .select();
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
        Let&apos;s Celebrate The Good Times
      </Typography>
      <Typography textAlign="center" color="secondary" className={styles.body}>
        Enter your date of birth:
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          maxDate={dayjs()}
          minDate={dayjs().subtract(maxAge, "year")}
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
        spirited Rosary prayer group online. Here, we&apos;re all about sharing
        the love, one Hail Mary at a time.
      </Typography>
      <Typography
        my={5}
        textAlign="center"
        color="secondary"
        className={styles.body}
      >
        So, grab your beads and get ready to click &apos;n pray with millions of
        other Catholics who have WiFi as strong as their faith. And don&apos;t
        worry, the only thing we spam here are Amens!
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
  const { user, setUser } = useUserContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [bgColor, setBgColor] = useState(theme.palette.error.dark);
  const [dob, setDob] = useState<Date>();

  const nextStep = (skipToEnd = false) => {
    if (skipToEnd === true) {
      setCurrentStep(steps.length - 1);
    } else {
      setCurrentStep((step) => {
        if (step >= steps.length - 1) {
          if (user && dob) setUser({ ...user, dateOfBirth: dob.toUTCString() });
          router.push(NAV_APP_LINKS.app.link);
          return step;
        }
        return step + 1;
      });
    }
  };

  steps = [
    {
      component: (
        <WhenIsYourBirthDay next={nextStep} dob={dob} setDob={setDob} />
      ),
      color: theme.palette.error.dark,
      backgroundImage: birthDay,
    },
    {
      component: <Intro next={nextStep} />,
      color: theme.palette.success.main,
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
