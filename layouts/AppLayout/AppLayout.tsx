import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { TopNavbar, SideNavbar } from "@/components/Navbars";
import GridViewIcon from "@mui/icons-material/GridView";
// import StarIcon from "@mui/icons-material/Star";
// import SettingsIcon from "@mui/icons-material/Settings";
// import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CellTowerIcon from "@mui/icons-material/CellTower";
import ConfessionIcon from "@mui/icons-material/PsychologyAlt";
import { Box, Typography } from "@mui/material";
import styles from "./AppLayout.module.scss";
import { css } from "@/utils/helpers";

interface Props {
  children: React.ReactNode;
}

const menuItems = [
  { url: "/app", label: "All Events", icon: <GridViewIcon /> },
  { url: "/app/live-event", label: "Live Event", icon: <CellTowerIcon /> },
  // {
  //   url: "/app/attending-events",
  //   label: "Attending Events",
  //   icon: <StarIcon />,
  // },
  {
    url: "/app/confession",
    label: "Exam of Conscience",
    icon: <ConfessionIcon />,
  },
  // { url: "/app/settings", label: "Settings", icon: <SettingsIcon /> },
  // { url: "/app/support", label: "Support", icon: <SupportAgentIcon /> },
];

export default function AppLayout({ children }: Props) {
  const navigate = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const pageTitle = useMemo(
    () => menuItems.find((menu) => menu.url === navigate.pathname),
    [navigate.pathname]
  );

  return (
    <Box className={styles.container}>
      <Box component="menu" className={styles.topNavbar}>
        <TopNavbar handleMenu={handleDrawerOpen} />
      </Box>
      <Box component="header" className={styles.pageTitle}>
        <Typography component="h1" variant="h4">
          {pageTitle?.label}
        </Typography>
      </Box>
      <Box
        component="menu"
        className={css(
          styles.sideNavbar,
          drawerOpen ? styles.sideNavbarOpen : styles.sideNavbarClose
        )}
      >
        <SideNavbar
          menuItems={menuItems}
          open={drawerOpen}
          handleDrawerClose={handleDrawerOpen}
        />
      </Box>
      <Box className={styles.content} component="main">
        {children}
      </Box>
    </Box>
  );
}
