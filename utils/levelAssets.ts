import { StaticImageData } from 'next/image';

import {
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  level11,
  level12,
} from '@/public/assets/svgs/levels';
import { theme } from '@/styles/mui-overwrite';

type LevelAsset = {
  image: StaticImageData;
  color: string;
};

export const levelAssetsByBadgeKey: Record<string, LevelAsset> = {
  serpent_crusher: {
    image: level1,
    color: theme.palette.grey[100],
  },
  foot_upon_the_serpent: {
    image: level2,
    color: theme.palette.grey[100],
  },
  crushed_the_serpent_head: {
    image: level3,
    color: theme.palette.grey[100],
  },
  rosary_warrior: {
    image: level4,
    color: theme.palette.grey[100],
  },
  sword_of_the_rosary: {
    image: level5,
    color: 'purple',
  },
  rosary_of_dominion: {
    image: level6,
    color: 'blue',
  },
  shield_of_mary: {
    image: level7,
    color: 'silver',
  },
  beads_of_power: {
    image: level8,
    color: 'grey',
  },
  crown_of_victory: {
    image: level9,
    color: 'pink',
  },
  demon_slayer: {
    image: level10,
    color: 'gold',
  },
  victory_through_prayer: {
    image: level11,
    color: 'white',
  },
  the_final_amen: {
    image: level12,
    color: 'white',
  },
};
