import level1 from '@/public/assets/svgs/levels/level1.svg';
import level2 from '@/public/assets/svgs/levels/level2.svg';
import level3 from '@/public/assets/svgs/levels/level3.svg';
import level4 from '@/public/assets/svgs/levels/level4.svg';
import level5 from '@/public/assets/svgs/levels/level5.svg';
import level6 from '@/public/assets/svgs/levels/level6.svg';
import level7 from '@/public/assets/svgs/levels/level7.svg';
import level8 from '@/public/assets/svgs/levels/level8.svg';
import level9 from '@/public/assets/svgs/levels/level9.svg';
import level10 from '@/public/assets/svgs/levels/level10.svg';
import level11 from '@/public/assets/svgs/levels/level11.svg';
import level12 from '@/public/assets/svgs/levels/level12.svg';
import { theme } from '@/styles/mui-overwrite';

const levels = [
  {
    color: theme.palette.grey[100],
    label: 'Orange',
    requirement: 2,
    icon: level3,
    value: 'orange',
  },
  {
    color: theme.palette.grey[100],
    label: 'Black',
    requirement: 4,
    icon: level1,
    value: 'black',
  },
  {
    color: theme.palette.grey[100],
    label: 'Red',
    requirement: 8,
    icon: level2,
    value: 'red',
  },
  {
    color: theme.palette.grey[100],
    label: 'Green',
    requirement: 16,
    icon: level4,
    value: 'green',
  },
  {
    color: 'purple',
    label: 'Purple',
    requirement: 32,
    icon: level5,
    value: 'purple',
  },
  {
    color: 'blue',
    label: 'Blue',
    requirement: 64,
    icon: level6,
    value: 'blue',
  },
  {
    color: 'silver',
    label: 'Silver',
    requirement: 128,
    icon: level7,
    value: 'silver',
  },
  {
    color: 'grey',
    label: 'Platinum',
    requirement: 256,
    icon: level8,
    value: 'platinum',
  },
  {
    color: 'pink',
    label: 'Rose Gold',
    requirement: 512,
    icon: level9,
    value: 'rose',
  },
  {
    color: 'gold',
    label: 'Yellow Gold',
    requirement: 1_000,
    icon: level10,
    value: 'yellow',
  },
  {
    color: 'white',
    label: 'White Gold',
    requirement: 1_200,
    icon: level11,
    value: 'white',
  },
  {
    color: 'white',
    label: 'Heaven',
    requirement: 1_500,
    icon: level12,
    value: 'heaven',
  },
];

const getCurrentLevel = (numRosaryCompleted: number) => {
  const nextLevelIndex = levels.findIndex(
    (level) => numRosaryCompleted < level.requirement,
  );
  if (nextLevelIndex - 1 >= 0) {
    const currentLevelIndex = nextLevelIndex - 1;
    return { levelNum: currentLevelIndex, ...levels[currentLevelIndex] };
  } else {
    return { levelNum: 0, ...levels[0] };
  }
};

export { levels, getCurrentLevel };
