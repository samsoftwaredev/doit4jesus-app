import { Box, Typography } from "@mui/material";
import styles from "./musicPlayer.module.scss";
import MusicSettings from "../MusicSettings";
import MusicVideo from "../MusicVideo";
import { AudioNext, AudioPrevious, AudioPlay } from "../AudioControllers";
import { useAudioContext } from "@/context/AudioContext";
import OnlineUsers from "../OnlineUsers";
import { usePresenceContext } from "@/context/PresenceContext";
import MovingText from "../MovingText";

const MusicPlayer = () => {
  const { users } = usePresenceContext();
  const { audioPlayer, hideMusicPlayer } = useAudioContext();

  if (hideMusicPlayer) return null;

  return (
    <>
      <Box className={styles.container}>
        <Box className={styles.controls}>
          <Typography className={styles.title} component="span">
            <MovingText>{audioPlayer?.audioTitle}</MovingText>
          </Typography>
          <Box className={styles.buttonControl}>
            <MusicSettings />
            <AudioPrevious />
            <AudioPlay />
            <AudioNext />
            <MusicVideo />
          </Box>
          <Typography className={styles.mystery} component="h4">
            <OnlineUsers users={users} />
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default MusicPlayer;
