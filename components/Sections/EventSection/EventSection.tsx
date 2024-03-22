import { Box, Card, Typography } from "@mui/material";
import { css } from "@/utils/helpers";
import styles from "./eventSection.module.scss";
import { DataEvent, VideoEvent } from "@/interfaces/index";
import moment from "moment";
import { useUserContext } from "@/context/UserContext";
import { ChatMessage } from "../..";
import ChatTextbox from "@/components/ChatTextbox/ChatTextbox";

interface Props {
  videoEvent: VideoEvent & DataEvent;
}

const EventSection = ({ videoEvent }: Props) => {
  const { user } = useUserContext();
  const numberOfPrayers = 3;
  return (
    <Box className={styles.container}>
      <Box className="video">
        <iframe
          frameBorder={0} // don't remove this attribute
        />
      </Box>
      <Card className={css(styles.eventDetails, "appCard")}>
        <Box display="flex" gap={1} className={styles.eventHeader}>
          <Typography component="h1">{videoEvent.title}</Typography>
          {/* <Box sx={{ flexGrow: 1 }} />
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
          </Button> */}
        </Box>
        <Typography textAlign="right" fontSize="0.9em" component="body">
          {moment(videoEvent.startedAt).fromNow()}
        </Typography>
        <Typography component="body">{videoEvent.description}</Typography>
      </Card>
      <Card className={css(styles.eventDetails, "appCard")}>
        <Typography fontWeight="bold" component="h4" variant="h4">
          {numberOfPrayers > 1 ? (
            <span>{numberOfPrayers} Prayers</span>
          ) : (
            <span>Prayers</span>
          )}
        </Typography>
        <Box mb={3}>
          <ChatTextbox />
        </Box>
        <ChatMessage
          user={{
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
          }}
        >
          This is a very long message that will display here just as a
          placeholder.
        </ChatMessage>
      </Card>
    </Box>
  );
};

export default EventSection;
