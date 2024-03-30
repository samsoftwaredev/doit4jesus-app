import { theme } from "@/styles/mui-overwrite";
import { dollarFormatter } from "@/utils/helpers";
import { AccountCircle, AttachMoney, Favorite } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import moment from "moment";

interface Props {
  user: {
    firstName: string;
    lastName: string;
  };
  children: JSX.Element | string;
  date?: Date;
  numLikes?: number;
  donationAmount?: number | null;
}

const ChatMessage = ({
  user,
  children,
  date = new Date(),
  numLikes = 0,
  donationAmount = 0,
}: Props) => {
  return (
    <Box my="1em" display="flex" flexDirection="column" gap="1em">
      <Box display="flex" gap="0.5em" alignItems="center">
        <AccountCircle />
        <Typography fontWeight="bold">
          {user.firstName} {user.lastName}
        </Typography>
        <Typography fontSize="small">{moment(date).fromNow()}</Typography>
      </Box>
      <Box ml={2}>{children}</Box>
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
