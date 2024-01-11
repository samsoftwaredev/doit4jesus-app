import { Box, Typography } from "@mui/material";
import { AudioPlayer } from "../AudioPlayer";
import { INTERFACE_LANGUAGES } from "@/interfaces/index";
import { Rosary } from "@/class";
import styles from "./musicPlayer.module.scss";
import MusicSettings from "../MusicSettings";
import MusicVideo from "../MusicVideo";

interface Props {
  rosary: Rosary;
}

const MusicPlayer = ({ rosary }: Props) => {
  const rosaryState = rosary.getRosaryState();

  return (
    <AudioPlayer
      audioPlayer={{
        audio: rosary.getAudio(INTERFACE_LANGUAGES.en),
        audioTitle: rosaryState.mystery,
      }}
    >
      <Box className={styles.container}>
        <Box className={styles.controls}>
          <Typography className={styles.title} component="h3">
            {rosaryState.title}
          </Typography>
          <Box className={styles.buttonControl}>
            <MusicSettings />
            <AudioPlayer.AudioPrevious />
            <AudioPlayer.AudioPlay />
            <AudioPlayer.AudioNext />
            <MusicVideo />
          </Box>
          <Typography className={styles.mystery} component="h4">
            {rosaryState.mystery}
          </Typography>
        </Box>
      </Box>
    </AudioPlayer>
  );
};

export default MusicPlayer;
