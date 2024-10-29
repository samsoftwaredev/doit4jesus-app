import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

import { GroupItem, MenuItem } from "@/interfaces/index";

import FriendSearch from "../FriendSearch/FriendSearch";
import Dialog from "../Dialog";
import Select from "../Select";
import { db } from "@/class/index";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useUserContext } from "@/context/UserContext";

interface Props {
  groups?: GroupItem[];
}

const FriendSearchGroup = ({ groups = [] }: Props) => {
  const { user } = useUserContext();
  const groupMenuItem = groups.map((g) => ({ name: g.name, value: g.id }));
  const [isOpen, setIsOpen] = useState(false);
  const [userSelected, setUserSelected] = useState<MenuItem>();
  const [groupName, setGroupName] = useState("");

  const onGroupSelected = (event: SelectChangeEvent) => {
    setGroupName(event.target.value);
  };

  const onClose = () => {
    setIsOpen(false);
    setGroupName("");
  };

  const onUserSelected = (friend: MenuItem) => {
    setUserSelected(friend);
    setIsOpen(true);
  };

  const onAddUser = async () => {
    const { data, error } = await db
      .getFriends()
      .insert({
        friend_id: userSelected!.value,
        groups: { [groupName]: dayjs().format("MM/DD/YYYY") },
      })
      .eq("friend_id", userSelected!.value)
      .select();
    if (error) {
      console.error(error);
      toast.error("Unable to add user to group");
    }
    if (data) {
      setIsOpen(false);
      setGroupName("");
    }
  };

  return (
    <>
      <Typography fontWeight="bold" fontSize="large">
        Pray With Other Soldiers
      </Typography>
      <Typography pb={3}>
        Find friends to pray with! Just enter their first or last name.
      </Typography>
      <Typography fontSize="small">
        NOTE: Enter at least three characters to see results
      </Typography>
      <FriendSearch onSelect={onUserSelected} />
      <Dialog
        modalTitle="Add Friend"
        fullWidth
        maxWidth="xs"
        open={isOpen}
        handleClose={onClose}
      >
        <Box>
          Do you want to add {userSelected?.label ?? ""} as a friend?
          <Typography pt={2}>
            Your friend will be added to this group:
          </Typography>
          <FormControl size="small" sx={{ width: "100%" }}>
            <Select
              value={groupName}
              menuItems={groupMenuItem}
              onChange={onGroupSelected}
            />
          </FormControl>
          <Box pt={5} gap={1} display="flex" justifyContent="flex-end">
            <Button onClick={onAddUser} variant="contained">
              Add Friend
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default FriendSearchGroup;
