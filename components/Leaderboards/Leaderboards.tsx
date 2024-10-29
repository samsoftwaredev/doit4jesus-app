import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import { supabase } from "@/class/index";
import { getCurrentLevel } from "@/utils/levels";

import Loading from "../Loading";
import RosaryLevel from "../RosaryLevel";

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

  return (
    <Box>
      <Typography fontSize="small" fontWeight="light">
        Top {userList?.length || 10} Members
      </Typography>
      <Typography variant="h4">Leaderboards</Typography>
      {isLoading ? (
        <Loading isFeature />
      ) : (
        <>
          <Box>
            {userList?.map((u, index) => {
              const { levelNum } = getCurrentLevel(u.count);
              return (
                <Box my={5} key={u.userId} display="flex" alignItems="center">
                  <Box>
                    <Typography fontSize="4em">{index + 1}</Typography>
                  </Box>

                  <Box
                    sx={{ width: "100%" }}
                    display="flex"
                    flexDirection="column"
                  >
                    <Typography fontSize="1.2em" fontWeight="bold" px={1}>
                      {u.firstName} {u.lastName}
                    </Typography>
                    <Typography px={1}>
                      {u.count} {u.count !== 1 ? "Rosaries" : "Rosary"}
                    </Typography>
                  </Box>

                  <Box sx={{ width: "100%" }} textAlign="right">
                    <RosaryLevel levelNum={levelNum} />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Leaderboards;
