import { Alert, Box, Button, LinearProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useLevelsContext } from '@/context/LevelsContext';
import { useUserContext } from '@/context/UserContext';
import { SpiritualProgressSnapshot } from '@/interfaces/spiritualXp';
import { getSpiritualProgress } from '@/services/spiritualXp';

import { Dialog, RosaryLevel, RosaryLevelInfo } from '../..';

const ProgressLevelsSection = () => {
  const { t } = useLanguageContext();
  const [isOpenLevels, setIsOpenLevels] = useState(false);
  const { user } = useUserContext();
  const { levels, getCurrentLevel } = useLevelsContext();
  const [snapshot, setSnapshot] = useState<SpiritualProgressSnapshot | null>(
    null,
  );

  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.userId) return;
      const data = await getSpiritualProgress(user.userId);
      setSnapshot(data);
    };
    loadProgress();
  }, [user?.userId]);

  const totalXp = snapshot?.profile.totalXp ?? 0;
  const currentLevel = getCurrentLevel(totalXp);
  const nextLevel = levels[currentLevel.levelNum + 1] ?? currentLevel;
  const progressNextLevel = snapshot?.progressPercentToNext ?? 0;

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
          sx={{ sm: { p: 0, m: 0 } }}
          display="flex"
          justifyContent="space-between"
        >
          <Box display="flex" flexDirection="column" alignItems="center" my={2}>
            <Typography>{t.currentLevel}</Typography>
            <RosaryLevel levelNum={currentLevel.levelNum} />
            <RosaryLevelInfo
              label={currentLevel.label}
              value={currentLevel.value}
              requirement={currentLevel.requirement}
            />
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" my={2}>
            <Typography>{t.nextLevel}</Typography>
            <RosaryLevel levelNum={currentLevel.levelNum + 1} />
            <RosaryLevelInfo
              label={nextLevel.label}
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
            sx={{
              ...(index === currentLevel.levelNum && {
                border: '2px solid',
                borderColor: 'success.main',
                borderRadius: 2,
                px: 2,
                py: 1,
                backgroundColor: 'action.selected',
              }),
            }}
          >
            <RosaryLevel key={label} levelNum={index} />
            <Box display="flex" flexDirection="column">
              <Typography
                component="h2"
                fontWeight="bold"
                sx={{
                  color: 'text.primary',
                  width: '100%',
                  textAlign: 'center',
                  fontSize: {
                    sm: '1.2em',
                    md: '1.5em',
                  },
                }}
              >
                {label}
              </Typography>
              <Typography
                fontWeight="light"
                sx={{
                  color: 'text.secondary',
                  width: '100%',
                  textAlign: 'right',
                  fontSize: { sm: '0.8em', md: '1em' },
                }}
              >
                XP {requirement}
              </Typography>
            </Box>
          </Box>
        ))}
      </Dialog>
    </>
  );
};

export default ProgressLevelsSection;
