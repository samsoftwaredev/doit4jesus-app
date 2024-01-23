import { Box, Card, Typography } from "@mui/material";
import { Button } from "@mui/material";
import { AttachMoney, Favorite, Reply } from "@mui/icons-material";
import { css } from "@/utils/helpers";
import styles from "./eventSection.module.scss";
import { Event, VideoEvent } from "@/interfaces/index";

interface Props {
  event: VideoEvent & Event;
}

const Event = ({ event }: Props) => {
  return (
    <Box className={styles.container}>
      <Box className={styles.videoContainer}>
        <iframe
          className={styles.video}
          src={`https://www.youtube.com/embed/${event.videoId};controls=0`}
          title={event.title}
          frameBorder={0} // don't remove this attribute
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </Box>
      <Card className={css(styles.eventDetails, "appCard")}>
        <Box display="flex" gap={1} className={styles.eventHeader}>
          <Typography component="h1">{event.title}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="secondary"
            variant="contained"
            startIcon={<Favorite />}
          >
            Like
          </Button>
          <Button color="secondary" variant="contained" startIcon={<Reply />}>
            Share
          </Button>
          <Button
            color="success"
            variant="contained"
            startIcon={<AttachMoney />}
          >
            Donate
          </Button>
        </Box>
        <Typography textAlign="right" fontSize="0.9em" component="body">
          {event.startedAt}
        </Typography>
        <Typography component="body">{event.description}</Typography>
      </Card>
    </Box>
  );
};

export default Event;
