import { Box, Typography } from '@mui/material';
import moment from 'moment';

import { theme } from '@/styles/mui-overwrite';
import { dollarFormatter } from '@/utils/helpers';

import UserBubble from '../UserBubble';

interface Props {
  user: {
    firstName: string;
    lastName: string;
    pictureUrl?: string;
  };
  children: JSX.Element | string;
  date?: Date;
  updatedAt?: string | null;
  deletedAt?: string | null;
  donationAmount?: number | null;
}

const ChatMessage = ({
  user,
  children,
  date = new Date(),
  updatedAt,
  deletedAt,
  donationAmount = 0,
}: Props) => {
  const timePassed = updatedAt ? (
    <>
      <i>updated</i> {moment(updatedAt).fromNow()}
    </>
  ) : (
    moment(date).fromNow()
  );

  const message = deletedAt ? <i>The message was deleted.</i> : children;

  return (
    <Box my="1em" display="flex" flexDirection="column" gap="1em">
      <Box display="flex" gap="0.5em" alignItems="center">
        <UserBubble
          userName={`${user.firstName} ${user.lastName}`}
          userPicture={user.pictureUrl}
        />
        <Typography fontWeight="bold">
          {user.firstName} {user.lastName}
        </Typography>
        <Typography fontSize="small">{timePassed}</Typography>
      </Box>
      <Box ml={2}>{message}</Box>
      <Box ml={2} display="flex" alignItems="center" gap="1em">
        {/* <Button color="secondary" variant="text">
          Reply
        </Button> */}
        {typeof donationAmount === 'number' && (
          <Typography
            color={theme.palette.success.main}
            fontWeight="bold"
            alignItems="center"
            display="flex"
          >
            Donated &nbsp;{dollarFormatter(donationAmount)}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChatMessage;
