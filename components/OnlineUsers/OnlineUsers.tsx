import { AccountCircle } from "@mui/icons-material";
import { Box, Tooltip } from "@mui/material";
import styles from "./onlineUsers.module.scss";

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
        <Box key={userId} component={"li"} className={styles.avatar}>
          <Tooltip title={`${fullName} is online.`} key={userId}>
            <AccountCircle />
            {/* <Image width={40} height={40} src={pictureUrl} alt={fullName} /> */}
          </Tooltip>
        </Box>
      ))}
    </Box>
  );
};

export default OnlineUsers;
