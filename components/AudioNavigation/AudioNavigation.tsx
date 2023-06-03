import { MouseEventHandler } from "react";
import { IconButton, Box, Tooltip } from "@mui/material";
import styles from "./audioNavigation.module.scss";

interface Props {
  buttons: {
    id: string;
    icon: JSX.Element;
    tooltip: string;
    onClick: MouseEventHandler<HTMLAnchorElement>;
  }[];
}

const AudioNavigation = ({ buttons }: Props) => {
  return (
    <Box className={styles.container}>
      {buttons.map(({ id, icon, tooltip, onClick }) => (
        <Tooltip title={tooltip}>
          <IconButton key={id} onClick={onClick} href={`#${id}`}>
            {icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

export default AudioNavigation;
