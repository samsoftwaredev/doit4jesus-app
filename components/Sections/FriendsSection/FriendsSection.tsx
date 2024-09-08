import { Box, Container, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import {
  Card,
  CreateFriendGroup,
  RosaryLevel,
  RosaryLevelInfo,
} from "@/components";
import FriendGroup from "@/components/FriendGroup";
import { getCurrentLevel } from "@/utils/levels";
import { useUserContext } from "@/context/UserContext";
import { db } from "@/class/index";
import { normalizeFriendsGroups, normalizeGroups } from "@/utils/normalizers";
import { FriendsGroupItem, GroupItem } from "@/interfaces/index";
import FriendSearchGroup from "@/components/FriendSearchGroup";

import styles from "./FriendsSection.module.scss";

const FriendsSection = () => {
  const { user } = useUserContext();
  const [groups, setGroups] = useState<GroupItem[]>();
  const [friendGroups, setFriendGroups] = useState<FriendsGroupItem[]>();
  const numRosariesCompleted = user?.stats.rosaryTotalCount ?? 0;
  const currentLevel = getCurrentLevel(numRosariesCompleted);

  const getMyGroups = async () => {
    let { data, error } = await db
      .getGroups()
      .select("*")
      .eq("user_id", user!.userId);
    if (error) {
      toast.error("Unable to retrieve groups");
    }
    if (data) {
      const groupsNormalized = normalizeGroups(data);
      setGroups(groupsNormalized);
    }
  };

  const getFriendsByGroups = async () => {
    let { data, error } = await db
      .getFriends()
      .select("*")
      .eq("user_id", user!.userId);
    if (error) {
      toast.error("Unable to retrieve group of friends");
    }
    if (data) {
      const groupsFriendNormalized = normalizeFriendsGroups(data);
      setFriendGroups(groupsFriendNormalized);
    }
  };

  useEffect(() => {
    getMyGroups();
    getFriendsByGroups();
  }, []);

  return (
    <Container className="container-box" maxWidth="md">
      <Box className={styles.container}>
        <div className={styles.SearchFriend}>
          <Card>
            <FriendSearchGroup groups={groups} />
          </Card>
        </div>
        <div className={styles.TodaysChallenge}>
          <Card>
            <Box display="flex" flexDirection="column" textAlign="center">
              <Typography fontWeight="bold">Today&apos;s Challenge</Typography>
              <Typography
                fontSize="4.1em"
                fontWeight="900"
                className={styles.stats}
              >
                <span>{user?.stats.todaysRosaryCompleted ? 1 : 0}</span>{" "}
                <span>/</span> <span>1</span>
              </Typography>
              <Typography fontSize="small">Pray One Rosary</Typography>
            </Box>
          </Card>
        </div>
        <div className={styles.UserLevel}>
          <Card>
            <Typography textAlign="center" fontWeight="bold" fontSize="large">
              Your Level
            </Typography>
            <Box display="flex" flexDirection="column" textAlign="center">
              <RosaryLevel levelNum={currentLevel.levelNum} />
              <RosaryLevelInfo
                requirement={currentLevel.requirement}
                label={currentLevel.label}
              />
            </Box>
          </Card>
        </div>
        <div className={styles.Groups}>
          <Card>
            <FriendGroup groups={groups} friendGroups={friendGroups} />
          </Card>
        </div>
        <div className={styles.CreateGroups}>
          <Card>
            <CreateFriendGroup />
          </Card>
        </div>
      </Box>
    </Container>
  );
};

export default FriendsSection;
