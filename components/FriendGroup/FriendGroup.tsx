import { Box, Typography } from "@mui/material";

import { FriendProfile, FriendsGroupItem, GroupItem } from "@/interfaces/index";
import { sessionFriendsKey } from "@/constants/global";

import UserBubble from "../UserBubble";
interface Props {
  groups?: GroupItem[];
  friendGroups?: FriendsGroupItem[];
}

const getUserProfile = (friendId: string) => {
  const friendsProfile = sessionStorage.getItem(sessionFriendsKey);
  const friendsList: FriendProfile[] = friendsProfile
    ? JSON.parse(friendsProfile)
    : [];
  const friendData = friendsList.find(({ userId }) => userId === friendId);
  return friendData;
};

const FriendGroup = ({ groups = [], friendGroups = [] }: Props) => {
  const friendInGroups = friendGroups.map((friend) => {
    const group = groups.find(({ id }) => {
      return friend.groups && friend.groups[id];
    });
    return { groupData: group, ...friend };
  });

  return (
    <Box>
      <Typography component="h2" fontWeight="bold">
        My Groups
      </Typography>
      {friendInGroups.map(({ groupData, friendId }) => {
        const friendData = getUserProfile(friendId);
        return (
          <Box key={friendId}>
            <Typography>{groupData?.name}</Typography>
            <UserBubble
              userName={`${friendData?.firstName} ${friendData?.lastName}`}
              userPicture={friendData?.pictureUrl ?? ""}
            />
            {friendData?.firstName} {friendData?.lastName}
          </Box>
        );
        return null;
      })}
    </Box>
  );
};

export default FriendGroup;
