import { Box } from '@mui/material';
import Image from 'next/image';

import { levels } from '@/utils/levels';

import styles from './rosaryLevel.module.scss';

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
      <Image
        style={{
          borderColor: color,
          backgroundColor: color,
        }}
        className={styles.image}
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
