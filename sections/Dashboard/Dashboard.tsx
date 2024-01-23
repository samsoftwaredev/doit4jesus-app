import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import styles from "./dashboard.module.scss";
import { css } from "@/utils/helpers";

import Link from "next/link";
import { YouTubeSubscribe } from "@/components/YouTubeVideo";
import { Events } from "@/interfaces";

interface Props {
  events: Events[] | null;
}

const Dashboard = ({ events }: Props) => {
  if (events === null) return <p>No events</p>;
  return (
    <Box className={styles.container}>
      {events.map(
        ({ title, description, startsAt, slug, pictureUrl }, index) => (
          <Card
            key={title}
            component={Link}
            href={`app/event/${slug}`}
            className={css(index === 0 ? styles.mainCard : styles.card)}
          >
            <CardMedia
              className={css(index === 0 ? styles.mainImage : styles.cardImage)}
              component="img"
              image={pictureUrl}
              alt={title}
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
                {startsAt && (
                  <Typography
                    component="div"
                    variant="h6"
                    className={styles.date}
                  >
                    {startsAt}
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
