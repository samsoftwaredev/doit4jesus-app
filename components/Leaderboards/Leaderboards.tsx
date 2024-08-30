import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { supabase } from "@/class/index";
import Loading from "../Loading";

type UserLeaderboards = {
  userId: string;
  count: number;
  firstName: string;
  lastName: string;
};

const Leaderboards = () => {
  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(true);
    const { data, error } = await supabase.functions.invoke("leaderboards");
    setIsLoading(false);
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

  if (isLoading) return <Loading isPage={false} />;

  return (
    <Box>
      <Typography>Top {userList?.length || 10} Members</Typography>
      <Box component={"ol"}>
        {userList?.map((u) => {
          return (
            <Typography component="li" px={1} key={u.userId}>
              {u.firstName} {u.lastName}: {u.count} rosaries
            </Typography>
          );
        })}
      </Box>
    </Box>
  );
};

export default Leaderboards;
