import AnnouncementIcon from '@mui/icons-material/Announcement';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import { useUserContext } from '@/context/UserContext';
import { EventMessages } from '@/interfaces/index';

interface Props {
  message: EventMessages;
  onClickDelete: () => void;
  onClickEdit: () => void;
  handleReport: () => void;
}

const ActionMenu = ({
  message,
  onClickDelete,
  onClickEdit,
  handleReport,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleActionMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onActionClick = (callback: () => void) => {
    setAnchorEl(null);
    callback();
  };

  const open = Boolean(anchorEl);
  const { user } = useUserContext();
  const isOwner = user?.userId === message.userId;

  return (
    <Box>
      <IconButton
        aria-label="more"
        id="event-message-actions"
        aria-controls={open ? 'event-message' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleActionMenuClick}
      >
        <MoreVertIcon color="secondary" />
      </IconButton>
      <Menu
        id="event-message"
        MenuListProps={{
          'aria-labelledby': 'event-message-actions',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {isOwner && (
          <MenuItem
            disabled={!!message.deletedAt}
            onClick={() => onActionClick(onClickDelete)}
          >
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            Delete
          </MenuItem>
        )}
        {isOwner && (
          <MenuItem
            disabled={!!message.deletedAt}
            onClick={() => onActionClick(onClickEdit)}
          >
            <ListItemIcon>
              <BorderColorIcon />
            </ListItemIcon>
            Edit
          </MenuItem>
        )}
        {!isOwner && (
          <MenuItem onClick={() => onActionClick(handleReport)}>
            <ListItemIcon>
              <AnnouncementIcon />
            </ListItemIcon>
            Report
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default ActionMenu;
