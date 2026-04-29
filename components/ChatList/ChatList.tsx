import { Box } from '@mui/material';
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
    <Box
      display="flex"
      flexDirection="row"
      alignItems="flex-start"
      flex={1}
      padding={2}
      gap={1}
    >
      <Box flex={1} minWidth={0} display="flex" alignItems="flex-start" gap={1}>
        {isEditMode ? (
          <ChatTextbox
            onCloseEditMode={handleCloseEditMode}
            onSendMessage={handleSaveMessage}
            text={messageData.message}
            isEditMode
          />
        ) : (
          <CandleCards
            intentions={{
              id: messageData.id,
              intention: messageData.message || '',
              prayerCount: numLikes,
              hasPrayed: !!(user && prevLikes[user.userId]),
              userName: messageData.firstName + ' ' + messageData.lastName,
              userPicture:
                user?.userId === messageData.userId
                  ? (user.pictureUrl ?? undefined)
                  : undefined,
            }}
            onPray={handleMessageLike}
          />
        )}
      </Box>
      {!isEditMode && (
        <Box ml="auto" flexShrink={0}>
          <ActionMenu
            message={messageData}
            onClickDelete={onClickDelete}
            onClickEdit={onClickEdit}
            handleReport={onClickReport}
          />
        </Box>
      )}
    </Box>
  );
};

export default ChatList;
