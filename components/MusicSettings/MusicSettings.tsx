import React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/Settings";
import { theme } from "@/styles/mui-overwrite";
import { Tooltip } from "@mui/material";

const options = ["Settings", "Rosary Mysteries"];

const MusicSettings = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Settings">
        <span>
          <IconButton
            disabled
            aria-controls={open ? "rosary-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
            sx={{ color: theme.palette.info.dark }}
          >
            <SettingsIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Menu
        id="rosary-menu"
        MenuListProps={{
          "aria-labelledby": "music-options",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MusicSettings;
