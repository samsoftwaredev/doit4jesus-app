import { AccountCircle } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

import SafeImage from '../SafeImage';

const Avatar = styled(Box)<{ isOnline: boolean }>(({ isOnline }) => ({
  display: 'inline-flex',
  borderRadius: '50%',
  border: isOnline ? '3px solid #4caf50' : '2px solid transparent',
}));

interface Props {
  userName?: string;
  userId?: string;
  userPicture?: string;
  isOnline?: boolean;
}

const UserBubble = ({ userName, userPicture, isOnline = false }: Props) => {
  const tooltipMessage = isOnline ? `${userName} is online.` : userName;
  return (
    <Avatar isOnline={isOnline}>
      <Tooltip title={tooltipMessage}>
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {userPicture ? (
            <SafeImage
              width={20}
              height={20}
              src={userPicture}
              alt={userName || 'User Name'}
              style={{ borderRadius: '50%' }}
            />
          ) : (
            <AccountCircle />
          )}
        </span>
      </Tooltip>
    </Avatar>
  );
};

export default UserBubble;
