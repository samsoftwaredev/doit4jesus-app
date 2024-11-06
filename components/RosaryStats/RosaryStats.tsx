import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { NAV_APP_LINKS } from '@/constants/nav';
import { useUserContext } from '@/context/UserContext';

const RosaryStats = () => {
  const { user } = useUserContext();
  const navigate = useRouter();

  const onClick = () => {
    navigate.push(NAV_APP_LINKS.app.link);
  };

  return (
    <>
      <Typography textAlign="center" fontWeight="bold">
        Rosaries Completed
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
        Start Praying
      </Button>
    </>
  );
};

export default RosaryStats;
