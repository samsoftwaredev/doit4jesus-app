import { Box, IconButton, Tooltip } from '@mui/material';
import { MouseEventHandler } from 'react';

import styles from './audioNavigation.module.scss';

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
        <Tooltip key={id} title={tooltip}>
          <IconButton key={id} onClick={onClick} href={`#${id}`}>
            {icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

export default AudioNavigation;
