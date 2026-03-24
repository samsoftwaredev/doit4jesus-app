import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { useLanguageContext } from '@/context/LanguageContext';
import { fetchTotalRosaryCount } from '@/services/rosaryApi';

const TotalRosariesPrayed = () => {
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
    </>
  );
};

export default TotalRosariesPrayed;
