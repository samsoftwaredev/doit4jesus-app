import styled from '@emotion/styled';
import { AccountCircle } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';

import SafeImage from '../SafeImage';

const Avatar = styled(Box)({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: '2px solid #e8d1cb',
  display: 'inline-block',
  position: 'relative',
  boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
  transition: '0.2s ease',
  marginLeft: '-10px',
  backgroundColor: 'black',
  '& svg': {
    width: '100%',
    height: 'auto',
    color: '#e8d1cb',
  },
});

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
