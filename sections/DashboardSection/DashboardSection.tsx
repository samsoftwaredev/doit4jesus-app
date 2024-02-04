import { Box, Card, CardContent, Typography } from "@mui/material";
import styles from "./dashboardSection.module.scss";
import { css } from "@/utils/helpers";

import Link from "next/link";
import { YouTubeSubscribe } from "@/components/YouTubeVideo";
import { Event } from "@/interfaces";
import CountdownDate from "@/components/CountdownDate";

interface Props {
  events: Event[] | null;
}

const DashboardSection = ({ events }: Props) => {
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
              className={css(index === 0 ? styles.mainImage : styles.cardImage)}
            />
            {startedAt && (
              <Typography component="div" variant="h6" className={styles.date}>
                <CountdownDate targetTime={new Date(startedAt)} />
              </Typography>
            )}
            <Box
              className={css(
                index === 0 ? styles.mainEventDetails : styles.eventDetails
              )}
            >
              <CardContent>
                <Typography
                  component="div"
                  variant="h5"
                  className={styles.title}
                >
                  {title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="p"
                  className={css(
                    index === 0 ? styles.mainDescription : styles.description
                  )}
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

export default DashboardSection;
