import { AccountCircle } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

import SafeImage from '../SafeImage';

const Avatar = styled(Box)(({ theme }) => ({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: `2px solid ${theme.palette.secondary.main}`,
  display: 'inline-block',
  position: 'relative',
  boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
  transition: '0.2s ease',
  marginLeft: '-10px',
  backgroundColor: theme.palette.background.default,
  '& svg': {
    width: '100%',
    height: 'auto',
    color: theme.palette.secondary.main,
  },
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
