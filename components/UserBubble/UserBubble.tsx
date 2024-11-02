import { AccountCircle } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import Image from 'next/image';

import styles from './userBubble.module.scss';

interface Props {
  userName: string;
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
            <Image
              width={20}
              height={20}
              src={userPicture}
              alt={userName}
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
