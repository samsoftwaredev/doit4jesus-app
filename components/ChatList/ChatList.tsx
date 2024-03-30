import { EventMessages } from "@/interfaces/index";
import ChatMessage from "../ChatMessage";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { useUserContext } from "@/context/UserContext";

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

  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between">
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

      <Box>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon color="secondary" />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {isOwner && (
            <MenuItem onClick={() => handleDelete(message.id)}>Delete</MenuItem>
          )}
          {isOwner && (
            <MenuItem onClick={() => handleEdit(message.id, "")}>Edit</MenuItem>
          )}
          {!isOwner && (
            <MenuItem onClick={() => handleReport(message.id)}>Report</MenuItem>
          )}
        </Menu>
      </Box>
    </Box>
  );
};

export default ChatList;
