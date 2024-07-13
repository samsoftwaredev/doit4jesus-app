import { Box, Typography } from "@mui/material";
import Image from "next/image";

import styles from "./rosaryLevel.module.scss";
import { levels } from "@/utils/levels";

interface Props {
  levelNum: number;
  highlight?: boolean;
  onlyIcon?: boolean;
}

interface LevelIconProps {
  color: string;
  highlight: boolean;
  icon: string;
  label: string;
}

const LevelIcon = ({ color, highlight, icon, label }: LevelIconProps) => {
  return (
    <Box sx={{ borderRadius: "50%" }}>
      <Image
        style={{
          borderColor: color,
          backgroundColor: color,
          opacity: highlight ? 1 : 0.5,
        }}
        className={styles.image}
        src={icon}
        alt={label}
      />
    </Box>
  );
};

const RosaryLevel = ({
  levelNum,
  highlight = false,
  onlyIcon = false,
}: Props) => {
  const level = levels[levelNum];

  if (level === undefined) return null;

  const { label, color, icon, requirement } = level;

  if (onlyIcon) {
    return (
      <LevelIcon
        color={color}
        highlight={highlight}
        icon={icon}
        label={label}
      />
    );
  }

  return (
    <>
      <LevelIcon
        color={color}
        highlight={highlight}
        icon={icon}
        label={label}
      />
      <Box className={styles.levelInfo}>
        <Typography
          component="h2"
          fontWeight="bold"
          sx={{
            opacity: highlight ? 1 : 0.5,
            fontSize: {
              sm: "1.2em",
              md: "1.5em",
            },
          }}
        >
          {label} Level
        </Typography>
        <Typography
          fontWeight="light"
          sx={{
            opacity: highlight ? 1 : 0.5,
            fontSize: { sm: "0.5em", md: "1em" },
          }}
        >
          Complete {requirement} Rosaries
        </Typography>
      </Box>
    </>
  );
};

export default RosaryLevel;
