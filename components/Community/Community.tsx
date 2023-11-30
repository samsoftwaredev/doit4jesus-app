import Image from "next/image";
import { Box, Container, Grid, Typography } from "@mui/material";
import rosary from "@/public/assets/images/rosary.svg";
import styles from "./community.module.scss";
import { css } from "@/utils/helpers";

const Hero = () => {
  return (
    <div className={styles.container}>
      <Container maxWidth="md">
        <Grid>
          <Typography
            my={5}
            className={css(styles.title, "sectionTitle")}
            variant="h2"
          >
            About the Rosary
          </Typography>
          <Image src={rosary} alt="Rosoary" />
          <Box className={styles.content}>
            <Typography className={styles.description}>
              The Mother of God, in an apparition to Santo Domingo, taught him
              to pray The Holy Rosary, in the year 1208. She told him to spread
              this devotion and use it as a powerful weapon against the enemies
              of the Faith.
            </Typography>
          </Box>
        </Grid>
      </Container>
    </div>
  );
};

export default Hero;
