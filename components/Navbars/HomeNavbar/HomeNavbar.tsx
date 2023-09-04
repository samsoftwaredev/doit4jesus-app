import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Logo } from "../..";
import { NAV_FOOTER_LINKS, NAV_MAIN_LINKS } from "@/constants/nav";
import { useRouter } from "next/router";
import styles from "./homeNavbar.module.scss";

function HomeNavbar() {
  const router = useRouter();

  const goToHome = () => {
    router.push(NAV_MAIN_LINKS.home.link);
  };

  const goToAbout = () => {
    router.push(NAV_FOOTER_LINKS.about.link);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className={styles.appBar}>
        <Toolbar>
          <IconButton
            disableRipple
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={goToHome}
          >
            <Logo type="white" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit">Why Pray?</Button>
          <Button color="inherit" onClick={goToAbout}>
            About Us
          </Button>
          <Button color="inherit">Login</Button>
          <Button color="secondary" variant="contained">
            Sing Up For Free
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default HomeNavbar;
