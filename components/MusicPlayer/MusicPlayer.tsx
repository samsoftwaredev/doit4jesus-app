import { Box, Typography } from "@mui/material";
import { AudioPlayer } from "../AudioPlayer";
import { INTERFACE_LANGUAGES } from "@/interfaces/index";
import Rosary from "@/class/Rosary";
import styles from "./musicPlayer.module.scss";

interface Props {
  rosary: Rosary;
}

const MusicPlayer = ({ rosary }: Props) => {
  const rosaryState = rosary.getRosaryState();

  return (
    <AudioPlayer
      audioPlayer={{ audio: rosary.getAudio(INTERFACE_LANGUAGES.en) }}
    >
      <Box className={styles.controls}>
        <Typography variant="h6" sx={{ color: "white" }}>
          {rosaryState.title}
        </Typography>
        <Box>
          <AudioPlayer.AudioPrevious />
          <AudioPlayer.AudioPlay />
          <AudioPlayer.AudioNext />
        </Box>
        <Typography variant="h5" sx={{ color: "white" }}>
          {rosaryState.mystery}
        </Typography>
      </Box>
    </AudioPlayer>
  );
};

export default MusicPlayer;
