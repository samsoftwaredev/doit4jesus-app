import { useState } from "react";
import { Stack, Slider } from "@mui/material";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";

const MusicVolumeOption = () => {
  const [value, setValue] = useState<number>(30);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
      <VolumeDown />
      <Slider aria-label="Volume" value={value} onChange={handleChange} />
      <VolumeUp />
    </Stack>
  );
};

export default MusicVolumeOption;
