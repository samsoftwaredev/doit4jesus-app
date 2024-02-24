import { Button, Container, Typography } from "@mui/material";
import styles from "./callToAction.module.scss";
import { useRouter } from "next/router";
import { NAV_MAIN_LINKS } from "@/constants/nav";
import Link from "next/link";

const WhyPrayRosary = () => {
  const router = useRouter();
  return (
    <Container maxWidth="md" className={styles.container}>
      <Typography mb={2} component="h1" className={styles.title}>
        Start praying with others today!
      </Typography>
      <Link passHref href={NAV_MAIN_LINKS.signup.link}>
        <Button size="large" color="secondary" variant="contained">
          Sign Up For Free
        </Button>
      </Link>
    </Container>
  );
};

export default WhyPrayRosary;
