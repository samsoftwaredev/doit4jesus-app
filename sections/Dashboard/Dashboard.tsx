import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import styles from "./dashboard.module.scss";
import { css } from "@/utils/helpers";

import Link from "next/link";
import { YouTubeSubscribe } from "@/components/YouTubeVideo";
import { Event } from "@/interfaces";

interface Props {
  events: Event[] | null;
}

const Dashboard = ({ events }: Props) => {
  if (events === null) return <p>No events</p>;
  return (
    <Box className={styles.container}>
      {events.map(
        ({ title, description, startedAt, slug, pictureUrl }, index) => (
          <Card
            key={title}
            component={Link}
            href={`app/event/${slug}`}
            className={css(index === 0 ? styles.mainCard : styles.card)}
          >
            <Box
              style={{ backgroundImage: `url(${pictureUrl})` }}
              className={styles.cardImage}
            />
            <Box className={styles.eventDetails}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography
                  component="div"
                  variant="h5"
                  className={css(index === 0 ? styles.mainTitle : styles.title)}
                >
                  {title}
                </Typography>
                {startedAt && (
                  <Typography
                    component="div"
                    variant="h6"
                    className={styles.date}
                  >
                    {startedAt}
                  </Typography>
                )}
                <Typography
                  variant="subtitle1"
                  component="p"
                  className={styles.description}
                >
                  {description}
                </Typography>
                <Box>{index === 0 && <YouTubeSubscribe />}</Box>
              </CardContent>
            </Box>
          </Card>
        )
      )}
    </Box>
  );
};

export default Dashboard;
