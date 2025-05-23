import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import Link from 'next/link';

import CountdownDate from '@/components/CountdownDate';
import { YouTubeSubscribe } from '@/components/YouTubeVideo';
import { NAV_APP_LINKS } from '@/constants/nav';
import { DataEvent } from '@/interfaces';
import { css } from '@/utils/helpers';

import styles from './allEventSection.module.scss';

interface Props {
  events: DataEvent[] | null;
}

const AllEventSection = ({ events }: Props) => {
  if (events === null) return <p>No events</p>;

  return (
    <Container className="container-box" maxWidth="lg">
      <Box className={styles.container}>
        {events.map(
          ({ title, description, startedAt, slug, pictureUrl }, index) => (
            <Card
              key={title}
              component={Link}
              href={`${NAV_APP_LINKS.event.link}/${slug}`}
              className={css(index === 0 ? styles.mainCard : styles.card)}
            >
              <Box
                style={{ backgroundImage: `url(${pictureUrl})` }}
                className={css(
                  index === 0 ? styles.mainImage : styles.cardImage,
                )}
              />
              {startedAt && (
                <Typography
                  component="div"
                  variant="h6"
                  className={styles.date}
                >
                  <CountdownDate targetTime={new Date(startedAt)} />
                </Typography>
              )}
              <Box
                className={css(
                  index === 0 ? styles.mainEventDetails : styles.eventDetails,
                )}
              >
                <CardContent>
                  <Typography variant="h4" className={styles.title}>
                    {title}
                  </Typography>
                  <Typography
                    component="p"
                    fontWeight="light"
                    className={css(
                      index === 0 ? styles.mainDescription : styles.description,
                    )}
                  >
                    {description}
                  </Typography>
                  <Box>{index === 0 && <YouTubeSubscribe />}</Box>
                </CardContent>
              </Box>
            </Card>
          ),
        )}
      </Box>
    </Container>
  );
};

export default AllEventSection;
