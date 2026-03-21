import { AccountCircle } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

import SafeImage from '../SafeImage';

const Avatar = styled(Box)(({ theme }) => ({}));

interface Props {
  userName?: string;
  userId?: string;
  userPicture?: string;
  isOnline?: boolean;
}

const UserBubble = ({ userName, userPicture, isOnline = false }: Props) => {
  const tooltipMessage = isOnline ? `${userName} is online.` : userName;
  return (
    <Avatar>
      <Tooltip title={tooltipMessage}>
        <span>
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
