import { Alert, Box, Button, LinearProgress, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import { getCurrentLevel, levels } from '@/utils/levels';

import { Dialog, RosaryLevel, RosaryLevelInfo } from '../..';

const ProgressLevelsSection = () => {
  const { t } = useLanguageContext();
  const [isOpenLevels, setIsOpenLevels] = useState(false);
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

  return (
    <>
      <Typography fontSize="small" fontWeight="light">
        {t.raceToHeaven}
      </Typography>
      <Typography variant="h4">{t.rosaryLevels}</Typography>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        sx={{ maxWidth: '600px', margin: '0 auto' }}
      >
        <Box mt={2} display="flex" justifyContent="center">
          <Alert sx={{ opacity: 0.8 }} severity="warning">
            {t.howToProgressFasterDescription}
          </Alert>
        </Box>

        <Box
          sx={{ sm: { p: 0, m: 0 }, md: { padding: '2em', margin: '4em 0' } }}
          display="flex"
          justifyContent="space-between"
        >
          <Box display="flex" flexDirection="column" alignItems="center" my={2}>
            <Typography>{t.currentLevel}</Typography>
            <RosaryLevel levelNum={currentLevel.levelNum} />
            <RosaryLevelInfo
              value={currentLevel.value}
              requirement={currentLevel.requirement}
            />
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" my={2}>
            <Typography>{t.nextLevel}</Typography>
            <RosaryLevel levelNum={currentLevel.levelNum + 1} />
            <RosaryLevelInfo
              requirement={nextLevel.requirement}
              value={nextLevel.value}
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
          {t.seeLevels}
        </Button>
      </Box>

      <Dialog
        modalTitle={t.rosaryLevels}
        fullWidth
        maxWidth="sm"
        open={isOpenLevels}
        handleClose={onCloseLevels}
      >
        {levels.map(({ label, value, requirement }, index) => (
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
                  color: 'black',
                  width: '100%',
                  textAlign: 'center',
                  fontSize: {
                    sm: '1.2em',
                    md: '1.5em',
                  },
                }}
              >
                {t[value as keyof typeof t]}
              </Typography>
              <Typography
                fontWeight="light"
                sx={{
                  color: 'black',
                  width: '100%',
                  textAlign: 'center',
                  fontSize: { sm: '0.8em', md: '1em' },
                }}
              >
                {t.complete} {requirement} {t.rosaries}
              </Typography>
            </Box>
          </Box>
        ))}
      </Dialog>
    </>
  );
};

export default ProgressLevelsSection;
