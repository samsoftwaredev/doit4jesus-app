import { useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { AudioPlayer } from "@/components";
import { Item } from "./BackgroundMusicOption.style";

const BackgroundMusicOption = () => {
  const [value, setValue] = useState("none");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const backgroundMusicList = [
    {
      id: "none",
      label: "None",
      audioComponent: null,
    },
    {
      id: "ave-maria",
      label: "Ave Maria",
      audioComponent: (
        <AudioPlayer audio="7XO9uLEz2WY" visible={false}>
          <AudioPlayer.AudioPlay />
        </AudioPlayer>
      ),
    },
    {
      id: "ocean-wave",
      label: "Ocean Waves",
      audioComponent: (
        <AudioPlayer audio="vPhg6sc1Mk4" visible={false}>
          <AudioPlayer.AudioPlay />
        </AudioPlayer>
      ),
    },
    {
      id: "light-piano",
      label: "Light Piano",
      audioComponent: (
        <AudioPlayer audio="fOB73qRVGJs" visible={false}>
          <AudioPlayer.AudioPlay />
        </AudioPlayer>
      ),
    },
    {
      id: "gentle-rain",
      label: "Gentle Rain",
      audioComponent: (
        <AudioPlayer audio="q76bMs-NwRk" visible={false}>
          <AudioPlayer.AudioPlay />
        </AudioPlayer>
      ),
    },
  ];

  return (
    <FormControl sx={{ width: "100%" }}>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        {backgroundMusicList.map(({ id, label, audioComponent }) => (
          <Item key={id}>
            <FormControlLabel value={id} control={<Radio />} label={label} />
            {!!audioComponent && audioComponent}
          </Item>
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default BackgroundMusicOption;
