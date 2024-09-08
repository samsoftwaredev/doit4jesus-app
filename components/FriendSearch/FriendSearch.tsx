import React, { SyntheticEvent, useEffect, useState } from "react";
import { Autocomplete, Box, Paper, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";

import { supabase } from "@/class/index";
import { MenuItem } from "@/interfaces/index";

import UserBubble from "../UserBubble";

interface Props {
  onSelect: (user: MenuItem) => void;
}

const FriendSearch = ({ onSelect }: Props) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const filterUsers = async (userName: string) => {
    setIsLoading(true);
    let { data, error } = await supabase.rpc("search_profiles", {
      search_text: userName,
    });

    if (error) {
      console.error(error);
      toast.error("Unable to filter users");
    }
    if (data) {
      const normalizeFriend = data.map((u) => ({
        value: u.id,
        label: `${u.first_name ?? ""} ${u.last_name ?? ""}`,
      }));
      setOptions(normalizeFriend);
    }
    setIsLoading(false);
  };

  const onChange = (
    _: SyntheticEvent<Element, Event>,
    user: string | MenuItem | null
  ) => {
    if (user !== null && typeof user === "object") {
      const friendSelected = options.find((u) => u.label === user.label);
      if (friendSelected) onSelect(friendSelected);
    }
  };

  const onKeyUp = (event: any) => {
    const newValue = event.target.defaultValue;
    if (newValue && newValue.length >= 3) filterUsers(newValue);
  };

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Box>
      <Paper>
        <Autocomplete
          freeSolo
          onKeyUp={onKeyUp}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          isOptionEqualToValue={(option, value) => option.label === value.label}
          options={options}
          loading={isLoading}
          renderInput={(params) => (
            <TextField placeholder="Enter Friends Name" {...params} />
          )}
          onChange={onChange}
          renderOption={(props, option) => {
            return (
              <li key={option.value} {...props}>
                <UserBubble userName={option.label} userId={option.value} />
                <Typography pl={1}>{option.label}</Typography>
              </li>
            );
          }}
        />
      </Paper>
    </Box>
  );
};

export default FriendSearch;
