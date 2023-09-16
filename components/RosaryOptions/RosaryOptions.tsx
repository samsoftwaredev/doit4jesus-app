import { useState, SyntheticEvent } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BackgroundMusicOption from "./BackgroundMusicOption";
import LanguageOption from "./LanguageOption";
import LengthOption from "./LengthOption";
import SpeedOption from "./SpeedOption";
import MusicVolumeOption from "./MusicVolumeOption";
import { Container } from "./RosaryOptions.style";

const RosaryOptions = () => {
  const [backgroundVolume, setBackgroundVolume] = useState<number>(100);
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const rosaryOptionsList = [
    {
      title: "Background Music",
      content: (
        <>
          <BackgroundMusicOption volume={backgroundVolume} />
          <MusicVolumeOption onChange={setBackgroundVolume} />
        </>
      ),
      id: "panel1",
    },
    {
      title: "Language",
      content: <LanguageOption />,
      id: "panel2",
    },
    // TODO: future enhancements
    // {
    //   title: "Length",
    //   content: <LengthOption />,
    //   id: "panel3",
    // },
    // {
    //   title: "Playback Speed",
    //   content: <SpeedOption />,
    //   id: "panel4",
    // },
  ];

  return (
    <Container>
      {rosaryOptionsList.map(({ id, title, content }) => (
        <Accordion
          key={id}
          expanded={expanded === id}
          onChange={handleChange(id)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${id}"-content"`}
            id={`${id}"-header"`}
          >
            <Typography sx={{ flexShrink: 0 }}>{title}</Typography>
          </AccordionSummary>
          <AccordionDetails>{content}</AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default RosaryOptions;
