import { Box, Typography } from "@mui/material";

import { FriendsGroupItem, GroupItem } from "@/interfaces/index";

interface Props {
  groups?: GroupItem[];
  friendGroups?: FriendsGroupItem[];
}

const FriendGroup = ({ groups, friendGroups }: Props) => {
  return (
    <Box>
      <Typography component="h2" fontWeight="bold">
        My Groups
      </Typography>
      {groups?.map(({ name, id }) => {
        const inGroup = friendGroups?.find((fg) => fg.groups && fg.groups[id]);
        return (
          <Box key={id}>
            <Typography>{name}</Typography>
            {inGroup?.userId}
          </Box>
        );
      })}
    </Box>
  );
};

export default FriendGroup;
