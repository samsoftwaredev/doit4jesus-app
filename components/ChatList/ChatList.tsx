import { Box, Grid } from '@mui/material';
import { useState } from 'react';

import { useUserContext } from '@/context/UserContext';
import { EventMessages } from '@/interfaces';
import { Json } from '@/interfaces/database';

import CandleCards from '../CandleCards';
import ChatTextbox from '../ChatTextbox';
import ActionMenu from './ActionMenu';

interface Props {
  messageData: EventMessages;
  handleDelete: (messageId: string) => void;
  handleEdit: (messageId: string, newMessage: string) => void;
  handleReport: (messageId: string) => void;
  handleLike: (messageId: string, likes: Json) => void;
}

const ChatList = ({
  messageData,
  handleDelete,
  handleEdit,
  handleReport,
  handleLike,
}: Props) => {
  const messagesLikes = messageData.likes;
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useUserContext();
  const [numLikes, setNumLikes] = useState(
    messagesLikes ? Object.values(messagesLikes).length : 0,
  );
  // @ts-ignore
  const prevLikes: { [key: string]: Json | undefined } =
    typeof messagesLikes === 'object' ? { ...messagesLikes } : {};

  const handleSaveMessage = (newMessage: string) => {
    if (messageData.message !== newMessage) {
      handleEdit(messageData.id, newMessage);
    }
    setIsEditMode(false);
  };

  const handleMessageLike = () => {
    if (user && prevLikes) {
      if (prevLikes[user.userId]) {
        delete prevLikes[user.userId];
        handleLike(messageData.id, prevLikes);
        setNumLikes(Object.values(prevLikes).length);
      } else {
        const newLikes = {
          ...prevLikes,
          [user.userId]: 'liked',
        };
        handleLike(messageData.id, newLikes);
        setNumLikes(Object.values(newLikes).length);
      }
    }
  };

  const handleCloseEditMode = () => {
    setIsEditMode(false);
  };

  const onClickDelete = () => {
    handleDelete(messageData.id);
  };

  const onClickEdit = () => {
    setIsEditMode(true);
  };

  const onClickReport = () => {
    handleReport(messageData.id);
  };

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      {isEditMode ? (
        <Box display="flex" flexDirection="column" flex="1">
          <ChatTextbox
            onCloseEditMode={handleCloseEditMode}
            onSendMessage={handleSaveMessage}
            text={messageData.message}
            isEditMode
          />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" flex="1">
          <CandleCards
            intentions={{
              id: messageData.id,
              intention: messageData.message || '',
              prayerCount: numLikes,
              hasPrayed: !!(user && prevLikes[user.userId]),
              userName: messageData.firstName + ' ' + messageData.lastName,
            }}
            onPray={handleMessageLike}
          />
        </Box>
      )}
      {!isEditMode && (
        <ActionMenu
          message={messageData}
          onClickDelete={onClickDelete}
          onClickEdit={onClickEdit}
          handleReport={onClickReport}
        />
      )}
    </Grid>
  );
};

export default ChatList;
