import { Button, Container, Typography } from "@mui/material";
import styles from "./callToAction.module.scss";
import { useRouter } from "next/router";
import { NAV_MAIN_LINKS } from "@/constants/nav";

const WhyPrayRosary = () => {
  const router = useRouter();
  const handelSignUp = () => {
    router.push(NAV_MAIN_LINKS.signup.link);
  };
  return (
    <Container maxWidth="md" className={styles.container}>
      <Typography component="h1" className={styles.title}>
        Start praying with other today!
      </Typography>
      <Button
        size="large"
        color="secondary"
        variant="contained"
        onClick={handelSignUp}
      >
        Sign Up For Free
      </Button>
    </Container>
  );
};

export default WhyPrayRosary;
