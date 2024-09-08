import React, { useMemo, useState } from "react";
import { Alert, Box, Typography, Button, LinearProgress } from "@mui/material";

import { useUserContext } from "@/context/UserContext";
import { getCurrentLevel, levels } from "@/utils/levels";
import Leaderboards from "@/components/Leaderboards";

import { Dialog, RosaryLevel, RosaryLevelInfo } from "../..";

const ProgressLevelsSection = () => {
  const [isOpenLevels, setIsOpenLevels] = useState(false);
  const [isOpenLeaderboards, setIsOpenLeaderboards] = useState(false);
  const { user } = useUserContext();
  const numRosariesCompleted = user?.stats.rosaryTotalCount ?? 0;
  const currentLevel = getCurrentLevel(numRosariesCompleted);
  const nextLevel = levels[currentLevel.levelNum + 1];

  const progressNextLevel = useMemo((): number => {
    if (currentLevel.levelNum === -1) {
      return 0;
    } else if (currentLevel.levelNum + 1 === levels.length) {
      return 100;
    } else {
      const prevLevel = numRosariesCompleted;
      const nextLevel = levels[currentLevel.levelNum + 1].requirement;
      return (prevLevel / nextLevel) * 100;
    }
  }, [numRosariesCompleted]);

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
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        sx={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <Box mt={2} display="flex" justifyContent="center">
          <Alert sx={{ opacity: 0.8 }} severity="warning">
            IMPORTANT: If you want to progress faster in levels, pray the Holy
            Rosary with others; their prayers will also count toward your
            progress.
          </Alert>
        </Box>

        <Box
          sx={{ sm: { p: 0, m: 0 }, md: { padding: "2em", margin: "4em 0" } }}
          display="flex"
          justifyContent="space-between"
        >
          <Box display="flex" flexDirection="column" alignItems="center" my={2}>
            <Typography>Current Level</Typography>
            <RosaryLevel levelNum={currentLevel.levelNum} />
            <RosaryLevelInfo
              requirement={currentLevel.requirement}
              label={currentLevel.label}
            />
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" my={2}>
            <Typography>Next Level</Typography>
            <RosaryLevel levelNum={currentLevel.levelNum + 1} />
            <RosaryLevelInfo
              requirement={nextLevel.requirement}
              label={nextLevel.label}
            />
          </Box>
        </Box>
        <Box pb={2}>
          <LinearProgress
            color="success"
            variant="determinate"
            value={progressNextLevel}
          />
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Button onClick={onOpenLevels} color="success" variant="outlined">
          See Levels
        </Button>
        <Button onClick={onOpenLeaderboards} color="success" variant="outlined">
          Leaderboards
        </Button>
      </Box>
      <Dialog
        modalTitle="Leaderboards"
        fullWidth
        maxWidth="xs"
        open={isOpenLeaderboards}
        handleClose={onCloseLeaderboards}
      >
        <Leaderboards />
      </Dialog>
      <Dialog
        modalTitle="Rosary Levels"
        fullWidth
        maxWidth="sm"
        open={isOpenLevels}
        handleClose={onCloseLevels}
      >
        {levels.map(({ label, requirement }, index) => (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            key={label}
            my={2}
          >
            <RosaryLevel key={label} levelNum={index} />
            <Box display="flex" flexDirection="column">
              <Typography
                component="h2"
                fontWeight="bold"
                sx={{
                  color: "black",
                  width: "100%",
                  textAlign: "center",
                  fontSize: {
                    sm: "1.2em",
                    md: "1.5em",
                  },
                }}
              >
                {label} Level
              </Typography>
              <Typography
                fontWeight="light"
                sx={{
                  color: "black",
                  width: "100%",
                  textAlign: "center",
                  fontSize: { sm: "0.8em", md: "1em" },
                }}
              >
                Complete {requirement} Rosaries
              </Typography>
            </Box>
          </Box>
        ))}
      </Dialog>
    </>
  );
};

export default ProgressLevelsSection;
