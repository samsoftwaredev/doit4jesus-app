import level1 from "@/public/assets/svgs/levels/level1.svg";
import level2 from "@/public/assets/svgs/levels/level2.svg";
import level3 from "@/public/assets/svgs/levels/level3.svg";
import level4 from "@/public/assets/svgs/levels/level4.svg";
import level5 from "@/public/assets/svgs/levels/level5.svg";
import level6 from "@/public/assets/svgs/levels/level6.svg";
import level7 from "@/public/assets/svgs/levels/level7.svg";
import level8 from "@/public/assets/svgs/levels/level8.svg";
import level9 from "@/public/assets/svgs/levels/level9.svg";
import level10 from "@/public/assets/svgs/levels/level10.svg";
import level11 from "@/public/assets/svgs/levels/level11.svg";
import level12 from "@/public/assets/svgs/levels/level12.svg";
import { theme } from "@/styles/mui-overwrite";

const levels = [
  {
    color: theme.palette.grey[100],
    label: "Orange",
    requirement: 3,
    icon: level3,
  },
  {
    color: theme.palette.grey[100],
    label: "Black",
    requirement: 20,
    icon: level1,
  },
  {
    color: theme.palette.grey[100],
    label: "Red",
    requirement: 40,
    icon: level2,
  },
  {
    color: theme.palette.grey[100],
    label: "Green",
    requirement: 80,
    icon: level4,
  },
  { color: "purple", label: "Purple", requirement: 160, icon: level5 },
  { color: "blue", label: "Blue", requirement: 420, icon: level6 },
  { color: "silver", label: "Silver", requirement: 840, icon: level7 },
  { color: "grey", label: "Platinum", requirement: 1_680, icon: level8 },
  { color: "pink", label: "Rose Gold", requirement: 3_360, icon: level9 },
  { color: "gold", label: "Yellow Gold", requirement: 6_720, icon: level10 },
  { color: "white", label: "White Gold", requirement: 13_440, icon: level11 },
  {
    color: "white",
    label: "Heaven",
    requirement: 20_000,
    icon: level12,
  },
];

const getCurrentLevel = (numRosaryCompleted: number) => {
  const currentLevelNumber = levels.findIndex(
    (level) => numRosaryCompleted >= level.requirement
  );
  return (
    { levelNum: currentLevelNumber, ...levels[currentLevelNumber] } ?? {
      levelNum: 0,
      ...levels[0],
    }
  );
};

export { levels, getCurrentLevel };
