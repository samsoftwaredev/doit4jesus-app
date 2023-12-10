import type { NextPage } from "next";
import { Box, Card, Typography } from "@mui/material";
import { Button } from "@mui/material";
import { AttachMoney, Favorite, Reply } from "@mui/icons-material";
import { css } from "@/utils/helpers";
import styles from "./liveEvent.module.scss";

const LiveEvent: NextPage = () => {
  return (
    <Box className={styles.container}>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/wLXGnCQgWQE?si=0epRZb9qIajBjSSb"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
      <Card className={css(styles.eventDetails, "appCard")}>
        <Box display="flex" gap={1} className={styles.eventHeader}>
          <Typography component="h1">Event Name</Typography>
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
          12/12/2023
        </Typography>
        <Typography component="body">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. n unknown printer took a
          galley of type and scrambled it to make a type specimen book. n
          unknown printer took a galley of type and scrambled it to make a type
          specimen book.
        </Typography>
      </Card>
    </Box>
  );
};

export default LiveEvent;
