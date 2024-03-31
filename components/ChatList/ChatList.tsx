import { EventMessages } from "@/interfaces/index";
import ChatMessage from "../ChatMessage";
import {
  Box,
  Button,
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
import { Favorite } from "@mui/icons-material";
import { Json } from "@/interfaces/database";

interface Props {
  message: EventMessages;
  handleDelete: (messageId: string) => void;
  handleEdit: (messageId: string, newMessage: string) => void;
  handleReport: (messageId: string) => void;
  handleLike: (messageId: string, likes: Json) => void;
}

const ChatList = ({
  message,
  handleDelete,
  handleEdit,
  handleReport,
  handleLike,
}: Props) => {
  const messagesLikes = message.likes;
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useUserContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isOwner = user?.userId === message.userId;
  const [numLikes, setNumLikes] = useState(
    messagesLikes ? Object.values(messagesLikes).length : 0
  );
  // @ts-ignore
  const prevLikes: { [key: string]: Json | undefined } =
    typeof messagesLikes === "object" ? { ...messagesLikes } : {};

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

  const handleMessageLike = () => {
    if (user && prevLikes) {
      if (prevLikes[user.userId]) {
        delete prevLikes[user.userId];
        handleLike(message.id, prevLikes);
        setNumLikes(Object.values(prevLikes).length);
      } else {
        const newLikes = {
          ...prevLikes,
          [user.userId]: "liked",
        };
        handleLike(message.id, newLikes);
        setNumLikes(Object.values(newLikes).length);
      }
    }
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
        <Box display="flex" flexDirection="column" flex="1">
          <ChatMessage
            date={new Date(message.createdAt)}
            donationAmount={message.donationAmount}
            updatedAt={message.updatedAt}
            deletedAt={message.deletedAt}
            user={{
              firstName: message.firstName || "",
              lastName: message.lastName || "",
            }}
          >
            <Typography>{message.message}</Typography>
          </ChatMessage>
          <Box>
            <Button
              disabled={!!message.deletedAt}
              color="secondary"
              variant="contained"
              startIcon={
                <Favorite color={numLikes > 0 ? "error" : "inherit"} />
              }
              onClick={handleMessageLike}
            >
              {numLikes}
            </Button>
          </Box>
        </Box>
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
