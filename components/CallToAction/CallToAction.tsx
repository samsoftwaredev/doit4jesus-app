import { Button, Container, Typography } from "@mui/material";
import styles from "./callToAction.module.scss";

const WhyPrayRosary = () => {
  return (
    <Container maxWidth="md" className={styles.container}>
      <Typography component="h2" my={3}>
        Start praying with other today!
      </Typography>
      <Button size="large" color="secondary" variant="contained">
        Sing Up for Free
      </Button>
    </Container>
  );
};

export default WhyPrayRosary;
