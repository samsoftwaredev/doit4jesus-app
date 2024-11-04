import { Favorite } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';

import { useUserContext } from '@/context/UserContext';
import { Json } from '@/interfaces/database';
import { EventMessages } from '@/interfaces/index';

import ChatMessage from '../ChatMessage';
import ChatTextbox from '../ChatTextbox';
import ActionMenu from './ActionMenu';

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
  const [numLikes, setNumLikes] = useState(
    messagesLikes ? Object.values(messagesLikes).length : 0,
  );
  // @ts-ignore
  const prevLikes: { [key: string]: Json | undefined } =
    typeof messagesLikes === 'object' ? { ...messagesLikes } : {};

  const handleSaveMessage = (newMessage: string) => {
    if (message.message !== newMessage) {
      handleEdit(message.id, newMessage);
    }
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
          [user.userId]: 'liked',
        };
        handleLike(message.id, newLikes);
        setNumLikes(Object.values(newLikes).length);
      }
    }
  };

  const handleCloseEditMode = () => {
    setIsEditMode(false);
  };

  const onClickDelete = () => {
    handleDelete(message.id);
  };

  const onClickEdit = () => {
    setIsEditMode(true);
  };

  const onClickReport = () => {
    handleReport(message.id);
  };

  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between">
      {isEditMode ? (
        <Box display="flex" flexDirection="column" flex="1">
          <ChatTextbox
            onCloseEditMode={handleCloseEditMode}
            onSendMessage={handleSaveMessage}
            text={message.message}
            isEditMode
          />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" flex="1">
          <ChatMessage
            date={new Date(message.createdAt)}
            donationAmount={message.donationAmount}
            updatedAt={message.updatedAt}
            deletedAt={message.deletedAt}
            user={{
              firstName: message.firstName || '',
              lastName: message.lastName || '',
            }}
          >
            <Typography fontWeight="light">{message.message}</Typography>
          </ChatMessage>
          <Box>
            <Button
              disabled={!!message.deletedAt}
              color="secondary"
              variant="contained"
              startIcon={
                <Favorite color={numLikes > 0 ? 'error' : 'inherit'} />
              }
              onClick={handleMessageLike}
            >
              {numLikes}
            </Button>
          </Box>
        </Box>
      )}
      {!isEditMode && (
        <ActionMenu
          message={message}
          onClickDelete={onClickDelete}
          onClickEdit={onClickEdit}
          handleReport={onClickReport}
        />
      )}
    </Box>
  );
};

export default ChatList;
