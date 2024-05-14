import { db } from "@/class/index";
import { NAV_APP_LINKS } from "@/constants/nav";
import { useUserContext } from "@/context/UserContext";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const RosaryStats = () => {
  const { user, setUser } = useUserContext();
  const navigate = useRouter();
  const [rosaryCount, setRosaryCount] = useState(0);

  const onClick = () => {
    navigate.push(NAV_APP_LINKS.app.link);
  };

  const getStats = async () => {
    if (!user?.userId) return;
    const { data: stats, error } = await db
      .getRosaryStats()
      .select("*")
      .eq("user_id", user?.userId);

    if (error) throw Error(error.message);
    setUser({ ...user, stats: { ...stats, rosaryTotalCount: stats.length } });
    setRosaryCount(stats.length);
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <>
      <Typography fontSize="small" textAlign="center" fontWeight="light">
        Rosaries Completed
      </Typography>
      <Typography
        textAlign="center"
        fontWeight="bold"
        component="h3"
        variant="h2"
      >
        {rosaryCount}
      </Typography>
      <Button onClick={onClick} fullWidth color="success" variant="outlined">
        Start Praying
      </Button>
    </>
  );
};

export default RosaryStats;
