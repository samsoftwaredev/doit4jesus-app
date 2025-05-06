import SettingsIcon from '@mui/icons-material/Settings';
import { Box, SwipeableDrawer, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React from 'react';

import { theme } from '@/styles/mui-overwrite';

const MusicSettings = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
    };

  return (
    <>
      <Tooltip title="Settings">
        <span>
          <IconButton
            disabled
            aria-controls={open ? 'rosary-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
            sx={{ color: theme.palette.info.dark }}
          >
            <SettingsIcon />
          </IconButton>
        </span>
      </Tooltip>

      <SwipeableDrawer
        anchor={'bottom'}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box
          sx={{ width: 'auto' }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Typography variant="h6" sx={{ padding: 2 }}>
            Music Settings
          </Typography>
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default MusicSettings;
