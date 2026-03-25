import { StaticImageData } from 'next/image';

export interface Level {
  color: string;
  label: string;
  requirement: number;
  image: StaticImageData;
  value: string;
}

export interface CurrentLevel extends Level {
  levelNum: number;
}

export const getCurrentLevelFromList = (
  levelList: Level[],
  numRosaryCompleted: number,
): CurrentLevel => {
  const nextLevelIndex = levelList.findIndex(
    (level) => numRosaryCompleted < level.requirement,
  );
  if (nextLevelIndex - 1 >= 0) {
    const currentLevelIndex = nextLevelIndex - 1;
    return { levelNum: currentLevelIndex, ...levelList[currentLevelIndex] };
  } else {
    return { levelNum: 0, ...levelList[0] };
  }
};
