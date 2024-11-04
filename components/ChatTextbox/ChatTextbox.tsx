import { AccountCircle, AttachMoney, Send } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Paper, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';

import { useUserContext } from '@/context/UserContext';
import { theme } from '@/styles/mui-overwrite';

import UserBubble from '../UserBubble';

interface Props {
  onSendMessage: (message: string) => void;
  onCloseEditMode?: () => void;
  text?: string | null;
  isEditMode?: boolean;
}

const ChatTextbox = ({
  onSendMessage,
  onCloseEditMode = () => {},
  text = '',
  isEditMode = false,
}: Props) => {
  const { user } = useUserContext();
  const [message, setMessage] = useState(text ?? '');
  const isSendBtnValid = message.trim() === '';

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMessage(e.target.value as string);
  };

  const onSubmit = () => {
    onSendMessage(message);
    setMessage('');
  };

  return (
    <Box display="flex" flexDirection="column" gap="1em">
      <Box gap="1em" display="flex" alignItems="center" position="relative">
        <Box
          style={{
            color: theme.palette.secondary.main,
            zIndex: '10',
            position: 'absolute',
            top: '-15px',
            left: '20px',
            backgroundColor: theme.palette.primary.main,
            borderRadius: '50%',
          }}
        >
          <UserBubble
            userPicture={user?.pictureUrl}
            userName={user?.fullName}
          />
        </Box>
        <Paper sx={{ marginLeft: '15px', width: '100%' }}>
          <TextField
            value={message}
            onChange={onChange}
            sx={{ width: '100%' }}
            color="secondary"
            placeholder="Add your prayer..."
            rows={2}
            multiline
          />
        </Paper>
      </Box>
      <Box ml="1em" display="flex" gap="1em">
        {!isEditMode && (
          <Button
            disabled
            color="success"
            variant="contained"
            startIcon={<AttachMoney />}
          >
            Make Donation
          </Button>
        )}
        {isEditMode && (
          <Button color="secondary" onClick={onCloseEditMode}>
            Cancel
          </Button>
        )}
        <Button
          disabled={isSendBtnValid}
          onClick={onSubmit}
          color="secondary"
          variant="contained"
          startIcon={<Send />}
        >
          {!isEditMode ? 'Send' : 'Update'}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatTextbox;
