import { Typography } from '@mui/material';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

const RosaryStats = () => {
  const { t } = useLanguageContext();
  const { user } = useUserContext();

  return (
    <>
      <Typography textAlign="center" fontWeight="bold">
        {t.rosariesCompleted}
      </Typography>
      <Typography
        textAlign="center"
        fontWeight="bold"
        component="h3"
        variant="h2"
      >
        {user?.stats.rosaryTotalCount}
      </Typography>
      <Typography fontSize="small" textAlign="center">
        {t.totalRosariesByYou}
      </Typography>
    </>
  );
};

export default RosaryStats;
