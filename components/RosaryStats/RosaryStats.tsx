import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { NAV_APP_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

const RosaryStats = () => {
  const { t } = useLanguageContext();
  const { user } = useUserContext();
  const router = useRouter();

  const onClick = () => {
    router.push(NAV_APP_LINKS.app.link);
  };

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
      <Button onClick={onClick} fullWidth color="success" variant="outlined">
        {t.startPraying}
      </Button>
    </>
  );
};

export default RosaryStats;
