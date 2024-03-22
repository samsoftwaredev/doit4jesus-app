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
  donationAmount?: number;
}

const ChatMessage = ({
  user,
  children,
  date = new Date(),
  numLikes = 0,
  donationAmount = 0,
}: Props) => {
  return (
    <Box display="flex" flexDirection="column" gap="1em">
      <Box display="flex" gap="0.5em" alignItems="center">
        <AccountCircle />
        <Typography fontWeight="bold">
          {user.firstName} {user.lastName}
        </Typography>
        <Typography fontSize="small">{moment(date).fromNow()}</Typography>
      </Box>
      <Typography ml={2}>{children}</Typography>
      <Box ml={2} display="flex" gap="0.5em">
        <Button color="secondary" variant="contained" startIcon={<Favorite />}>
          {numLikes}
        </Button>
        <Button color="secondary" variant="text">
          Reply
        </Button>
        {donationAmount > 0 && (
          <Typography alignItems="center" display="flex" color="success">
            <AttachMoney />
            &nbsp; {donationAmount}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChatMessage;
