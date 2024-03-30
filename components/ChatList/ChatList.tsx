import { EventMessages } from "@/interfaces/index";
import ChatMessage from "../ChatMessage";
import {
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { useUserContext } from "@/context/UserContext";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ChatTextbox from "../ChatTextbox";

interface Props {
  message: EventMessages;
  handleDelete: (messageId: string) => void;
  handleEdit: (messageId: string, newMessage: string) => void;
  handleReport: (messageId: string) => void;
}

const ChatList = ({
  message,
  handleDelete,
  handleEdit,
  handleReport,
}: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useUserContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isOwner = user?.userId === message.userId;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSaveMessage = (newMessage: string) => {
    handleEdit(message.id, newMessage);
    setIsEditMode(false);
  };

  const handleCloseEditMode = () => {
    setIsEditMode(false);
  };

  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between">
      {isEditMode ? (
        <ChatTextbox
          onCloseEditMode={handleCloseEditMode}
          onSendMessage={handleSaveMessage}
          text={message.message}
          isEditMode
        />
      ) : (
        <ChatMessage
          date={new Date(message.createdAt)}
          numLikes={message.like ? Object.values(message.like).length : 0}
          donationAmount={message.donationAmount}
          user={{
            firstName: message.firstName || "",
            lastName: message.lastName || "",
          }}
        >
          <Typography>
            {message.deletedAt ? (
              <i>The message was deleted.</i>
            ) : (
              message.message
            )}
          </Typography>
        </ChatMessage>
      )}

      <Box>
        <IconButton
          aria-label="more"
          id="event-message-actions"
          aria-controls={open ? "event-message" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon color="secondary" />
        </IconButton>
        <Menu
          id="event-message"
          MenuListProps={{
            "aria-labelledby": "event-message-actions",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {isOwner && (
            <MenuItem
              disabled={!!message.deletedAt}
              onClick={() => handleDelete(message.id)}
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
              onClick={() => setIsEditMode(true)}
            >
              <ListItemIcon>
                <BorderColorIcon />
              </ListItemIcon>
              Edit
            </MenuItem>
          )}
          {!isOwner && (
            <MenuItem onClick={() => handleReport(message.id)}>
              <ListItemIcon>
                <AnnouncementIcon />
              </ListItemIcon>
              Report
            </MenuItem>
          )}
        </Menu>
      </Box>
    </Box>
  );
};

export default ChatList;
