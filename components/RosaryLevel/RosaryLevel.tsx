import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image, { StaticImageData } from 'next/image';

import { useLevelsContext } from '@/context/LevelsContext';

const LevelImage = styled(Image)(() => ({
  backgroundColor: 'transparent',
  borderRadius: '50%',
  width: '120px',
  height: '120px',
  '@media (min-width: 768px)': {
    width: '80px',
    height: '80px',
  },
  '@media (min-width: 1024px)': {
    width: '120px',
    height: '120px',
  },
}));

interface Props {
  levelNum: number;
  onlyIcon?: boolean;
}

interface LevelIconProps {
  color: string;
  image: StaticImageData;
  label: string;
}

const LevelIcon = ({ color, image, label }: LevelIconProps) => {
  return (
    <Box sx={{ borderRadius: '50%' }}>
      <LevelImage
        style={{
          borderColor: color,
          backgroundColor: color,
        }}
        src={image}
        alt={label}
      />
    </Box>
  );
};

const RosaryLevel = ({ levelNum }: Props) => {
  const { levels } = useLevelsContext();
  const level = levels[levelNum];

  if (level === undefined) return null;

  const { label, color, image } = level;

  return <LevelIcon color={color} image={image} label={label} />;
};

export default RosaryLevel;
