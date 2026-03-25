import { Typography } from '@mui/material';

interface Props {
  label: string;
  value: string;
  requirement: number;
}

const RosaryLevelInfo = ({ label, requirement, value }: Props) => {
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
        {label}
      </Typography>
      <Typography
        fontWeight="light"
        sx={{
          width: '100%',
          textAlign: 'center',
          fontSize: { sm: '0.8em', md: '1em' },
        }}
      >
        XP {requirement}
      </Typography>
    </>
  );
};

export default RosaryLevelInfo;
