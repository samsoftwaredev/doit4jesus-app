import { AccountCircle } from "@mui/icons-material";
import { Box, Tooltip } from "@mui/material";
import Image from "next/image";

import styles from "./userBubble.module.scss";

interface Props {
  userPicture?: string;
  userName: string;
  userId: string;
}

const UserBubble = ({ userId, userName, userPicture }: Props) => {
  return (
    <Box className={styles.avatar}>
      <Tooltip title={`${userName} is online.`} key={userId}>
        <span>
          {userPicture ? (
            <Image width={40} height={40} src={userPicture} alt={userName} />
          ) : (
            <AccountCircle />
          )}
        </span>
      </Tooltip>
    </Box>
  );
};

export default UserBubble;
