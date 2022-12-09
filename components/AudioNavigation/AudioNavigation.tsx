import { MouseEventHandler } from "react";
import { IconButton, Box } from "@mui/material";

interface Props {
  buttons: {
    id: string;
    icon: JSX.Element;
    onClick: MouseEventHandler<HTMLAnchorElement>;
  }[];
}

const AudioNavigation = ({ buttons }: Props) => {
  return (
    <Box>
      {/* <audio controls>
        <source src={rosary.backgroundMusic} type="audio/ogg" />
        <source src={rosary.backgroundMusic} type="audio/mpeg" />
        Your browser does not support the audio tag.
      </audio> */}
      {buttons.map(({ id, icon, onClick }) => (
        <IconButton key={id} onClick={onClick} href={`#${id}`}>
          {icon}
        </IconButton>
      ))}
    </Box>
  );
};

export default AudioNavigation;
