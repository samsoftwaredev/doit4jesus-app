import { Box } from "@mui/material";
import styles from "./onlineUsers.module.scss";
import UserBubble from "../UserBubble";

interface Props {
  users?: {
    userId: string;
    pictureUrl: string;
    fullName: string;
  }[];
}

const OnlineUsers = ({ users }: Props) => {
  return (
    <Box component={"ul"} className={styles.container}>
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
