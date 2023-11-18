import * as React from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SideNavbar from "@/components/Navbars/SideNavbar";
import Logo from "@/components/Logo";
import styles from "./AppLayout.module.scss";

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  const handleDrawerOpen = () => {};

  return (
    <Box className={styles.container}>
      <Box component="menu" className={styles.topNavbar}>
        <Button disableRipple>
          <Logo type="white" />
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button endIcon={<AccountBoxIcon />}>Logout</Button>
      </Box>
      <Box component="menu" className={styles.sideNavbar}>
        <SideNavbar open={true} handleDrawerClose={handleDrawerOpen} />
      </Box>
      <Box className={styles.content} component="main">
        {children}
      </Box>
    </Box>
  );
}
