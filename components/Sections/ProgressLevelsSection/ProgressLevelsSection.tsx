import React from "react";
import { Alert, Box, Typography } from "@mui/material";

import { useUserContext } from "@/context/UserContext";
import { RosaryLevel } from "../..";
import { getCurrentLevel, levels } from "@/utils/levels";

const ProgressLevelsSection = () => {
  const { user } = useUserContext();
  const numRosariesCompleted = user?.stats.rosaryTotalCount ?? 0;
  const currentLevel = getCurrentLevel(numRosariesCompleted);
  return (
    <>
      <Typography fontSize="small" fontWeight="light">
        Rosary Levels
      </Typography>
      <Typography variant="h4">Levels</Typography>
      <Box>
        <RosaryLevel levelNum={currentLevel.levelNum} highlight />
      </Box>
      <Box mt={2} display="flex" justifyContent="center">
        <Alert sx={{ opacity: 0.8, maxWidth: "500px" }} severity="warning">
          IMPORTANT: If you want to progress faster in levels, pray the Holy
          Rosary with others; those prayers will also count toward your level.
        </Alert>
      </Box>
      <Box>
        {levels.map(({ label, requirement }, index) => (
          <RosaryLevel
            key={label}
            levelNum={index}
            highlight={numRosariesCompleted >= requirement}
          />
        ))}
      </Box>
    </>
  );
};

export default ProgressLevelsSection;
