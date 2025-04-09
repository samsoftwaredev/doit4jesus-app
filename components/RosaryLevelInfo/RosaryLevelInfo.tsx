import { Typography } from '@mui/material';

import { useLanguageContext } from '@/context/LanguageContext';

interface Props {
  value: string;
  requirement: number;
}

const RosaryLevelInfo = ({ requirement, value }: Props) => {
  const { t } = useLanguageContext();
  return (
    <>
      <Typography
        component="h2"
        fontWeight="bold"
        sx={{
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
          width: '100%',
          textAlign: 'center',
          fontSize: { sm: '0.8em', md: '1em' },
        }}
      >
        {t.complete} {requirement} {t.rosaries}
      </Typography>
    </>
  );
};

export default RosaryLevelInfo;
