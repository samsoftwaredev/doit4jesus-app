import { useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { AudioPlayer } from "@/components";
import { BG_AUDIOS, INITIAL_VOLUME } from "@/constants/mysteries";
import { INTERFACE_BACKGROUND_ITEM } from "@/constants/interfaces";
import { Item } from "./BackgroundMusicOption.style";

interface Props {
  volume: number;
}

const BackgroundMusicOption = ({ volume = INITIAL_VOLUME }: Props) => {
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
    ...BG_AUDIOS.map(({ id, label, audio }) => ({
      id,
      label,
      audioComponent: (
        <AudioPlayer
          audioPlayer={{
            audio,
            visible: false,
            audioVolume: volume,
            audioLoop: true,
          }}
        >
          <AudioPlayer.AudioPlay />
        </AudioPlayer>
      ),
    })),
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
