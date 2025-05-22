import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { supabase } from '@/classes/index';
import { useLanguageContext } from '@/context/LanguageContext';

const TotalRosariesPrayed = () => {
  const { t } = useLanguageContext();
  const [totalNum, setTotalNum] = useState<number | null>(0);

  const getTotalRosaries = async () => {
    let { data, error } = await supabase.rpc('get_all_rosary_count');
    if (error) console.error(error);
    else {
      setTotalNum(data);
    }
  };

  useEffect(() => {
    getTotalRosaries();
  }, []);

  return (
    <>
      <Typography textAlign="center" fontWeight="bold">
        Total Rosaries Completed
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
        Total rosaries completed by all warriors.
      </Typography>
    </>
  );
};

export default TotalRosariesPrayed;
