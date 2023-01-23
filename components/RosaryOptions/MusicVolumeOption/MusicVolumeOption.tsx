import { useState } from "react";
import { Stack, Slider } from "@mui/material";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import { INITIAL_VOLUME } from "@/constants/mysteries";

interface Props {
  onChange: Function;
}

const MusicVolumeOption = ({ onChange }: Props) => {
  const [value, setValue] = useState<number>(INITIAL_VOLUME);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
    onChange(newValue as number);
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
