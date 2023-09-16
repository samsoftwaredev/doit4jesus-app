import Image from "next/image";
import { Box, Container, Grid, Typography } from "@mui/material";
import rosary from "@/public/assets/images/rosary.svg";
import styles from "./community.module.scss";

const Hero = () => {
  return (
    <div className={styles.container}>
      <Container maxWidth="md">
        <Grid>
          <Typography my={5} className={"sectionTitle"} variant="h2">
            About the Rosary
          </Typography>
          <Image src={rosary} alt="Rosoary" />
          <Box className={styles.content}>
            <p>The Holy Rosary</p>
            <p>
              Santo Domingo de Guzman. The Mother of God, in an apparition to
              Santo Domingo, taught him to pray the rosary, in the year 1208.
              She told him to spread this devotion and use it as a powerful
              weapon against the enemies of the Faith.
            </p>
            <p>
              Santo Domingo de Guzman. The Mother of God, in an apparition to
              Santo Domingo, taught him to pray the rosary, in the year 1208.
              She told him to spread this devotion and use it as a powerful
              weapon against the enemies of the Faith.
            </p>
          </Box>
        </Grid>
      </Container>
    </div>
  );
};

export default Hero;
