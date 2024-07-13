import React, { useState } from "react";
import { Alert, Box, Typography, Button, LinearProgress } from "@mui/material";

import { useUserContext } from "@/context/UserContext";
import { Dialog, RosaryLevel } from "../..";
import { getCurrentLevel, levels } from "@/utils/levels";

const ProgressLevelsSection = () => {
  const [isOpenLevels, setIsOpenLevels] = useState(false);
  const [isOpenLeaderboards, setIsOpenLeaderboards] = useState(false);
  const { user } = useUserContext();
  const numRosariesCompleted = user?.stats.rosaryTotalCount ?? 0;
  const currentLevel = getCurrentLevel(numRosariesCompleted);

  const progressNextLevel = (): number => {
    console.log(currentLevel);
    if (currentLevel.levelNum === -1) return 0;
    else if (currentLevel.levelNum + 1 === levels.length) return 100;
    return (
      (levels[currentLevel.levelNum + 1].requirement -
        levels[currentLevel.levelNum].requirement) /
      levels[currentLevel.levelNum].requirement
    );
  };

  const onCloseLevels = () => {
    setIsOpenLevels(false);
  };

  const onOpenLevels = () => {
    setIsOpenLevels(true);
  };

  const onCloseLeaderboards = () => {
    setIsOpenLeaderboards(false);
  };

  const onOpenLeaderboards = () => {
    setIsOpenLeaderboards(true);
  };

  return (
    <>
      <Typography fontSize="small" fontWeight="light">
        Race to Heaven
      </Typography>
      <Typography variant="h4">Rosary Levels</Typography>
      <Box mt={2} display="flex" justifyContent="center">
        <Alert sx={{ opacity: 0.8, maxWidth: "500px" }} severity="warning">
          IMPORTANT: If you want to progress faster in levels, pray the Holy
          Rosary with others; their prayers will also count toward your
          progress.
        </Alert>
      </Box>

      <Box pt={2} display="flex" px={4} justifyContent="space-between">
        <Box display="flex" flexDirection="column" alignItems="center" my={2}>
          <Typography>Current Level</Typography>
          <RosaryLevel levelNum={currentLevel.levelNum} highlight />
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" my={2}>
          <Typography>Next Level</Typography>
          <RosaryLevel levelNum={currentLevel.levelNum + 1} highlight />
        </Box>
      </Box>
      <Box pb={2} px={4}>
        <LinearProgress
          color="success"
          variant="determinate"
          value={progressNextLevel()}
        />
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Button onClick={onOpenLevels} color="success" variant="outlined">
          See Levels
        </Button>
        <Button
          disabled
          onClick={onOpenLeaderboards}
          color="success"
          variant="outlined"
        >
          Leaderboards
        </Button>
      </Box>
      <Dialog
        modalTitle="Leaderboards"
        fullWidth
        maxWidth="sm"
        open={isOpenLeaderboards}
        handleClose={onCloseLeaderboards}
      >
        {/* Leader */}
      </Dialog>
      <Dialog
        modalTitle="Rosary Levels"
        fullWidth
        maxWidth="sm"
        open={isOpenLevels}
        handleClose={onCloseLevels}
      >
        {levels.map(({ label }, index) => (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            key={label}
            my={2}
          >
            <RosaryLevel key={label} levelNum={index} highlight={true} />
          </Box>
        ))}
      </Dialog>
    </>
  );
};

export default ProgressLevelsSection;
