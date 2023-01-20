import { useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
// import { AudioPlayer } from "@/components";
// import { INTERFACE_AUDIO_TYPE } from "@/constants/interfaces";
// import { aveAudio } from "@/public/assets/audio/index";
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
        <></>
        // <AudioPlayer type={INTERFACE_AUDIO_TYPE.AUDIO_FILE} audio={aveAudio}>
        //   <AudioPlayer.AudioPlay />
        // </AudioPlayer>
      ),
    },
    {
      id: "ocean-wave",
      label: "Ocean Waves",
      audioComponent: null,
    },
    {
      id: "light-piano",
      label: "Light Piano",
      audioComponent: null,
    },
    {
      id: "gentle-rain",
      label: "Gentle Rain",
      audioComponent: null,
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
