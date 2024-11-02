import { Box } from '@mui/material';

import UserBubble from '../UserBubble';
import styles from './onlineUsers.module.scss';

interface Props {
  users?: {
    userId: string;
    pictureUrl: string;
    fullName: string;
  }[];
}

const OnlineUsers = ({ users }: Props) => {
  return (
    <Box component={'ul'} className={styles.container}>
      {users?.map(({ fullName, userId, pictureUrl }) => (
        <UserBubble
          key={userId}
          userName={fullName}
          userId={userId}
          userPicture={pictureUrl}
        />
      ))}
    </Box>
  );
};

export default OnlineUsers;
