import { AccountCircle } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';

import SafeImage from '../SafeImage';
import styles from './userBubble.module.scss';

interface Props {
  userName?: string;
  userId?: string;
  userPicture?: string;
  isOnline?: boolean;
}

const UserBubble = ({ userName, userPicture, isOnline = false }: Props) => {
  const tooltipMessage = isOnline ? `${userName} is online.` : userName;
  return (
    <Box className={styles.avatar}>
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
    </Box>
  );
};

export default UserBubble;
