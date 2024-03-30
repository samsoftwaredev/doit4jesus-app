import { theme } from "@/styles/mui-overwrite";
import { dollarFormatter } from "@/utils/helpers";
import { AccountCircle, AttachMoney, Favorite } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import moment from "moment";

interface Props {
  user: {
    firstName: string;
    lastName: string;
  };
  children: JSX.Element | string;
  date?: Date;
  numLikes?: number;
  updatedAt?: string | null;
  deletedAt?: string | null;
  donationAmount?: number | null;
}

const ChatMessage = ({
  user,
  children,
  date = new Date(),
  numLikes = 0,
  updatedAt,
  deletedAt,
  donationAmount = 0,
}: Props) => {
  return (
    <Box my="1em" display="flex" flexDirection="column" gap="1em">
      <Box display="flex" gap="0.5em" alignItems="center">
        <AccountCircle />
        <Typography fontWeight="bold">
          {user.firstName} {user.lastName}
        </Typography>
        <Typography fontSize="small">
          {updatedAt ? (
            <>
              {moment(updatedAt).fromNow()} <i>(updated)</i>
            </>
          ) : (
            moment(date).fromNow()
          )}
        </Typography>
      </Box>
      <Box ml={2}>{deletedAt ? <i>The message was deleted.</i> : children}</Box>
      <Box ml={2} display="flex" alignItems="center" gap="1em">
        {/* <Button color="secondary" variant="text">
          Reply
        </Button> */}
        {typeof donationAmount === "number" && (
          <Typography
            color={theme.palette.success.main}
            fontWeight="bold"
            alignItems="center"
            display="flex"
          >
            Donated &nbsp;{dollarFormatter(donationAmount)}
          </Typography>
        )}
        {/* <Button color="secondary" variant="contained" startIcon={<Favorite />}>
          {numLikes}
        </Button> */}
      </Box>
    </Box>
  );
};

export default ChatMessage;
