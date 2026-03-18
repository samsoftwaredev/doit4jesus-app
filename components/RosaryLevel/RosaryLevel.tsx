import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

import { levels } from '@/utils/levels';

const LevelImage = styled(Image)(({ theme }) => ({
  border: `5px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  '@media (min-width: 768px)': {
    width: '80px',
    height: '80px',
  },
  '@media (min-width: 1024px)': {
    width: '100px',
    height: '100px',
  },
}));

interface Props {
  levelNum: number;
  onlyIcon?: boolean;
}

interface LevelIconProps {
  color: string;
  icon: string;
  label: string;
}

const LevelIcon = ({ color, icon, label }: LevelIconProps) => {
  return (
    <Box sx={{ borderRadius: '50%' }}>
      <LevelImage
        style={{
          borderColor: color,
          backgroundColor: color,
        }}
        src={icon}
        alt={label}
      />
    </Box>
  );
};

const RosaryLevel = ({ levelNum }: Props) => {
  const level = levels[levelNum];

  if (level === undefined) return null;

  const { label, color, icon } = level;

  return <LevelIcon color={color} icon={icon} label={label} />;
};

export default RosaryLevel;
