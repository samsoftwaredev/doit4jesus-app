import { useMemo } from "react";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import CreateIcon from "@mui/icons-material/ControlPoint";

import { FriendProfile, FriendsGroupItem, GroupItem } from "@/interfaces/index";
import { sessionFriendsKey } from "@/constants/global";

import UserBubble from "../UserBubble";
interface Props {
  group: GroupItem;
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

const FriendGroup = ({ group, friendGroups = [] }: Props) => {
  const maxNumberOfUsers = 3;
  const { id, name } = group;

  const getGroupMembers = (groupId: string) => {
    return friendGroups.filter(({ groups }) => {
      if (groups !== null) {
        const groupList = Object.entries(groups);
        return !!groupList.find(([id]) => id === groupId);
      }
    });
  };

  const members = useMemo(() => getGroupMembers(id), [id]).slice(
    0,
    maxNumberOfUsers
  );

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-between">
        <Typography fontWeight="900">{name}</Typography>
        <Tooltip title="Add New Member">
          <IconButton sx={{ p: 0 }} size="large" color="success">
            <CreateIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {members.length === 0 ? (
        <Typography fontStyle="italic">No Members</Typography>
      ) : (
        <Typography>Leaderboards</Typography>
      )}
      {members.map(({ friendId }) => {
        const friendData = getUserProfile(friendId);
        return (
          <Box ml={3} mt={1} key={friendId} display="flex" gap={1}>
            <UserBubble
              userName={`${friendData?.firstName} ${friendData?.lastName}`}
              userPicture={friendData?.pictureUrl ?? ""}
            />
            {friendData?.firstName} {friendData?.lastName} -{" "}
            {friendData?.rosaryCount}
          </Box>
        );
      })}
      {members.length > maxNumberOfUsers && (
        <Button sx={{ mt: 2 }} size="small" variant="text" color="success">
          View More
        </Button>
      )}
    </Box>
  );
};

export default FriendGroup;
