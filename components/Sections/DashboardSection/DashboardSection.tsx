import { Box, Button, Container, Typography } from "@mui/material";
import styles from "./dashboardSection.module.scss";
import Card from "@/components/Card";
import TodaysRosary from "@/components/TodaysRosary";

const DashboardSection = () => {
  return (
    <Container className="container-box" maxWidth="lg">
      <Box className={styles.container}>
        <Box className={styles.containerCards}>
          <div className={styles.TodayRosary}>
            <Card>
              <TodaysRosary />
            </Card>
          </div>

          <div className={styles.RosariesCompleted}>
            <Card>
              <Typography
                fontSize="small"
                textAlign="center"
                fontWeight="light"
              >
                Number of Rosaries Completed
              </Typography>
              <Typography
                textAlign="center"
                fontWeight="bold"
                component="h3"
                variant="h2"
              >
                0
              </Typography>
              <Button fullWidth color="success" variant="outlined">
                Start Praying
              </Button>
            </Card>
          </div>

          <div className={styles.Friends}>
            <Card>
              <Typography
                fontSize="small"
                textAlign="center"
                fontWeight="light"
              >
                Number of Friends
              </Typography>
              <Typography
                textAlign="center"
                fontWeight="bold"
                component="h3"
                variant="h2"
              >
                0
              </Typography>
              <Button fullWidth color="success" variant="outlined">
                Invite Friend
              </Button>
            </Card>
          </div>

          <div className={styles.Donations}>
            <Card>
              <Typography fontSize="small" fontWeight="light">
                Help share the love for the Holy Rosary
              </Typography>
              <Typography my={2} component="h1" variant="h4">
                Wanna become a contributor?
              </Typography>
              <Button color="success" variant="outlined">
                Donate Today
              </Button>
            </Card>
          </div>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardSection;
