import { Box, Button, Container, Typography } from "@mui/material";
import styles from "./dashboardSection.module.scss";
import { Card, TodaysRosary } from "@/components";
import InviteFriend from "@/components/InviteFriend";
import RosaryStats from "@/components/RosaryStats";

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
              <RosaryStats />
            </Card>
          </div>

          <div className={styles.Friends}>
            <Card>
              <InviteFriend />
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
              <Button disabled color="success" variant="outlined">
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
