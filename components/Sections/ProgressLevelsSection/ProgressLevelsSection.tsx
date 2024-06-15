import React from "react";
import { Box, Typography } from "@mui/material";
import { theme } from "@/styles/mui-overwrite";
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
import Image from "next/image";
import styles from "./progressLevels.module.scss";

const ProgressLevelsSection = () => {
  const levels = [
    {
      color: "black",
      label: "Black",
      requirement: 10,
      icon: level1,
    },
    {
      color: "red",
      label: "Red",
      requirement: 20,
      icon: level2,
    },
    {
      color: "orange",
      label: "Orange",
      requirement: 40,
      icon: level3,
    },
    { color: "green", label: "Green", requirement: 80, icon: level4 },
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
  return (
    <>
      <Typography fontSize="small" fontWeight="light">
        Rosary Level
      </Typography>
      <Box>
        <Typography variant="h4">Levels</Typography>
        {levels.map(({ label, requirement, color, icon }) => {
          return (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              key={label}
              my={2}
            >
              <Box sx={{ borderRadius: "50%" }}>
                <Image
                  style={{ borderColor: color }}
                  className={styles.image}
                  src={icon}
                  alt={label}
                />
              </Box>
              <Box className={styles.levelInfo}>
                <Typography
                  component="h2"
                  fontWeight="bold"
                  sx={{ fontSize: { sm: "1.2em", md: "1.5em" } }}
                >
                  {label} Level
                </Typography>
                <Typography
                  fontWeight="light"
                  sx={{ fontSize: { sm: "0.5em", md: "1em" } }}
                >
                  Complete {requirement} Rosaries
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default ProgressLevelsSection;
