import { useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { AudioPlayer } from "@/components";
import { INTERFACE_BACKGROUND_ITEM } from "@/constants/interfaces";
import { Item } from "./BackgroundMusicOption.style";

interface Props {
  volume: number;
}

const BackgroundMusicOption = ({ volume = 100 }: Props) => {
  const [value, setValue] = useState<INTERFACE_BACKGROUND_ITEM>(
    INTERFACE_BACKGROUND_ITEM.NONE
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = (event.target as HTMLInputElement)
      .value as INTERFACE_BACKGROUND_ITEM;
    setValue(INTERFACE_BACKGROUND_ITEM[val]);
  };

  const backgroundMusicList = [
    {
      id: INTERFACE_BACKGROUND_ITEM.NONE,
      label: "None",
      audioComponent: null,
    },
    {
      id: INTERFACE_BACKGROUND_ITEM.AVE_MARIA,
      label: "Ave Maria",
      audioComponent: (
        <AudioPlayer
          audioPlayer={{
            audio: "7XO9uLEz2WY",
            visible: false,
            audioVolume: volume,
          }}
        >
          <AudioPlayer.AudioPlay />
        </AudioPlayer>
      ),
    },
    {
      id: INTERFACE_BACKGROUND_ITEM.OCEAN_WAVE,
      label: "Ocean Waves",
      audioComponent: (
        <AudioPlayer
          audioPlayer={{
            audio: "vPhg6sc1Mk4",
            visible: false,
            audioVolume: volume,
          }}
        >
          <AudioPlayer.AudioPlay />
        </AudioPlayer>
      ),
    },
    {
      id: INTERFACE_BACKGROUND_ITEM.LIGHT_PIANO,
      label: "Light Piano",
      audioComponent: (
        <AudioPlayer
          audioPlayer={{
            audio: "fOB73qRVGJs",
            visible: false,
            audioVolume: volume,
          }}
        >
          <AudioPlayer.AudioPlay />
        </AudioPlayer>
      ),
    },
    {
      id: INTERFACE_BACKGROUND_ITEM.GENTLE_RAIN,
      label: "Gentle Rain",
      audioComponent: (
        <AudioPlayer
          audioPlayer={{
            audio: "q76bMs-NwRk",
            visible: false,
            audioVolume: volume,
          }}
        >
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
