import { Button, Container } from "@mui/material";
import styles from "./callToAction.module.scss";
import { css } from "@/utils/helpers";

const WhyPrayRosary = () => {
  return (
    <Container maxWidth="md" className={styles.container}>
      <h2 className={css(styles.title, "sectionTitle")}>
        Start praying with other today!
      </h2>
      <Button size="large" color="secondary" variant="contained">
        Sing Up for Free
      </Button>
    </Container>
  );
};

export default WhyPrayRosary;
