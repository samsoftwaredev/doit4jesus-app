import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { NAV_APP_LINKS } from '@/constants/index';
import { useLanguageContext } from '@/context/LanguageContext';
import { fetchTotalRosaryCount } from '@/services/rosaryApi';

const TotalRosariesPrayed = () => {
  const router = useRouter();
  const { t } = useLanguageContext();
  const [totalNum, setTotalNum] = useState<number | null>(0);

  const getTotalRosaries = async () => {
    try {
      const data = await fetchTotalRosaryCount();
      if (data?.count != null) setTotalNum(data.count);
    } catch (error) {
      console.error('Error in TotalRosariesPrayed (getTotalRosaries):', error);
    }
  };

  const onClick = () => {
    router.push(NAV_APP_LINKS.community.link);
  };

  useEffect(() => {
    getTotalRosaries();
  }, []);

  return (
    <>
      <Typography textAlign="center" fontWeight="bold">
        {t.totalRosariesCompleted}
      </Typography>
      <Typography
        textAlign="center"
        fontWeight="bold"
        component="h3"
        variant="h2"
      >
        {totalNum}
      </Typography>
      <Typography fontSize="small" textAlign="center">
        {t.totalRosariesByWarriors}
      </Typography>
      <Button
        data-testid="globalPrayerMap"
        onClick={onClick}
        fullWidth
        color="success"
        variant="outlined"
      >
        {t.globalPrayerMap}
      </Button>
    </>
  );
};

export default TotalRosariesPrayed;
