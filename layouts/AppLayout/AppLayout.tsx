import * as React from "react";
import GridViewIcon from "@mui/icons-material/GridView";
import StarIcon from "@mui/icons-material/Star";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CellTowerIcon from "@mui/icons-material/CellTower";
import ConfessionIcon from "@mui/icons-material/PsychologyAlt";
import { Button, Box, Typography } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SideNavbar from "@/components/Navbars/SideNavbar";
import Logo from "@/components/Logo";
import styles from "./AppLayout.module.scss";
import { useRouter } from "next/router";

interface Props {
  children: React.ReactNode;
}

const menuItems = [
  { url: "/app", label: "All Events", icon: <GridViewIcon /> },
  { url: "/app/live-event", label: "Live Event", icon: <CellTowerIcon /> },
  {
    url: "/app/attending-events",
    label: "Attending Events",
    icon: <StarIcon />,
  },
  {
    url: "/app/confession",
    label: "Exam of Conscience",
    icon: <ConfessionIcon />,
  },
  { url: "/app/settings", label: "Settings", icon: <SettingsIcon /> },
  { url: "/app/support", label: "Support", icon: <SupportAgentIcon /> },
];

export default function AppLayout({ children }: Props) {
  const handleDrawerOpen = () => {};
  const navigate = useRouter();
  const pageTitle = menuItems.find((menu) => menu.url === navigate.pathname);
  return (
    <Box className={styles.container}>
      <Box component="menu" className={styles.topNavbar}>
        <Button disableRipple>
          <Logo type="white" />
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button endIcon={<AccountBoxIcon />}>Logout</Button>
      </Box>
      <Box component="header" className={styles.pageTitle}>
        <Typography component="h1" variant="h4">
          {pageTitle?.label}
        </Typography>
      </Box>
      <Box component="menu" className={styles.sideNavbar}>
        <SideNavbar
          menuItems={menuItems}
          open={true}
          handleDrawerClose={handleDrawerOpen}
        />
      </Box>
      <Box className={styles.content} component="main">
        {children}
      </Box>
    </Box>
  );
}
