import { useEffect, useState } from "react";
import { IconButton, Box } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useAudioContext } from "context/AudioContext";

const audioText = (isPlaying: boolean) => (isPlaying ? "play" : "pause");

const AudioPlay = () => {
  const { setIsPlaying, isPlaying } = useAudioContext();
  const [audioPlaying, setAudioPlaying] = useState(false);

  const handleToggleAudioPlaying = () => {
    setIsPlaying(!audioPlaying);
  };

  useEffect(() => {
    setAudioPlaying(isPlaying);
  }, [isPlaying]);

  return (
    <Box>
      <IconButton
        onClick={handleToggleAudioPlaying}
        href={`#${audioText(audioPlaying)}`}
      >
        {audioPlaying ? <PauseIcon /> : <PlayIcon />}
      </IconButton>
    </Box>
  );
};

export default AudioPlay;
