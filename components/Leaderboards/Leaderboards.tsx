import { Box, Typography } from "@mui/material";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { db, supabase } from "@/class/index";
import { toast } from "react-toastify";

type UserLeaderboards = {
  userId: string;
  count: number;
  firstName: string;
  lastName: string;
};

const Leaderboards = () => {
  const [userList, setUserList] = useState<UserLeaderboards[]>();

  const normalizeLeaderboards = (
    data: {
      user_id: string;
      user_count: number;
      first_name: string;
      last_name: string;
      picture_url: string;
    }[]
  ): UserLeaderboards[] => {
    return data.map((u) => ({
      userId: u.user_id,
      count: u.user_count,
      firstName: u.first_name,
      lastName: u.last_name,
      picture_url: u.picture_url,
    }));
  };

  const getTopRosaryUser = async () => {
    const { data, error } = await supabase.functions.invoke("leaderboards");

    if (data) {
      const list = normalizeLeaderboards(data.data.data);
      setUserList(list);
    }
    if (error) {
      toast.error("Unable to display leaderboards");
    }
  };

  useEffect(() => {
    getTopRosaryUser();
  }, []);

  return (
    <Box>
      <Typography>Top {userList?.length || 10} Members</Typography>
      <ol>
        {userList?.map((u) => {
          return (
            <li key={u.userId}>
              {u.firstName} {u.lastName}: {u.count} rosaries
            </li>
          );
        })}
      </ol>
    </Box>
  );
};

export default Leaderboards;
