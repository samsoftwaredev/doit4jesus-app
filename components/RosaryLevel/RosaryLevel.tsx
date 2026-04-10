import CloseIcon from '@mui/icons-material/Close';
import { Backdrop, Box, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useLevelsContext } from '@/context/LevelsContext';

const levelDescriptionKeys: Record<string, string> = {
  serpent_crusher: 'levelDescSerpentCrusher',
  foot_upon_the_serpent: 'levelDescFootUponTheSerpent',
  crushed_the_serpent_head: 'levelDescCrushedTheSerpentHead',
  rosary_warrior: 'levelDescRosaryWarrior',
  sword_of_the_rosary: 'levelDescSwordOfTheRosary',
  rosary_of_dominion: 'levelDescRosaryOfDominion',
  shield_of_mary: 'levelDescShieldOfMary',
  beads_of_power: 'levelDescBeadsOfPower',
  crown_of_victory: 'levelDescCrownOfVictory',
  demon_slayer: 'levelDescDemonSlayer',
  victory_through_prayer: 'levelDescVictoryThroughPrayer',
  the_final_amen: 'levelDescTheFinalAmen',
};

const LevelImage = styled(Image)(() => ({
  backgroundColor: 'transparent',
  borderRadius: '50%',
  width: '100px',
  height: '100px',
  '@media (min-width: 768px)': {
    width: '80px',
    height: '80px',
  },
  '@media (min-width: 1024px)': {
    width: '100px',
    height: '100px',
  },
}));

const FullScreenImage = styled(Image)(() => ({
  backgroundColor: 'transparent',
  borderRadius: '50%',
  width: '200px',
  height: '200px',
}));

interface Props {
  levelNum: number;
  onlyIcon?: boolean;
}

interface LevelIconProps {
  color: string;
  image: StaticImageData;
  label: string;
  onClick?: () => void;
}

const LevelIcon = ({ color, image, label, onClick }: LevelIconProps) => {
  return (
    <Box sx={{ borderRadius: '50%', cursor: 'pointer' }} onClick={onClick}>
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
  const { t } = useLanguageContext();
  const [open, setOpen] = useState(false);
  const level = levels[levelNum];

  if (level === undefined) return null;

  const { label, color, image, value } = level;
  const descKey = levelDescriptionKeys[value];
  const description =
    (descKey ? t[descKey as keyof typeof t] : undefined) ?? t.levelDescDefault;

  return (
    <>
      <LevelIcon
        color={color}
        image={image}
        label={label}
        onClick={() => setOpen(true)}
      />
      <Backdrop
        open={open}
        onClick={() => setOpen(false)}
        sx={{
          zIndex: (t) => t.zIndex.modal,
          flexDirection: 'column',
          gap: 3,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
        }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
        <FullScreenImage
          style={{ borderColor: color, backgroundColor: color }}
          src={image}
          alt={label}
        />
        <Typography variant="h5" sx={{ color: 'white', mt: 2 }}>
          {label}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'grey.300', textAlign: 'center', maxWidth: 320, px: 2 }}
        >
          {description}
        </Typography>
      </Backdrop>
    </>
  );
};

export default RosaryLevel;
