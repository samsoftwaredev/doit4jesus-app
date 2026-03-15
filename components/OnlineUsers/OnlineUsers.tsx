import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import UserBubble from '../UserBubble';

const Container = styled(Box)({
  listStyleType: 'none',
  margin: 0,
  padding: 0,
});

interface Props {
  users?: {
    userId: string;
    pictureUrl: string;
    fullName: string;
  }[];
}

const OnlineUsers = ({ users }: Props) => {
  return (
    <Container>
      {users?.map(({ fullName, userId, pictureUrl }) => (
        <UserBubble
          key={userId}
          userName={fullName}
          userId={userId}
          userPicture={pictureUrl}
        />
      ))}
    </Container>
  );
};

export default OnlineUsers;
