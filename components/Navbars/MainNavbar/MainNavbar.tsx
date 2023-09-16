import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Logo } from "../..";
import { NAV_APP_LINKS } from "@/constants/nav";
import { useRouter } from "next/router";

interface Props {
  onlyLogo: boolean;
}

function MainNavbar({ onlyLogo = false }: Props) {
  const router = useRouter();

  const goToConfession = () => {
    router.push(NAV_APP_LINKS.confession.link);
  };

  const goToRosary = () => {
    router.push(NAV_APP_LINKS.rosary.link);
  };

  const goToRoot = () => {
    router.push(NAV_APP_LINKS.app.link);
  };

  const styles = onlyLogo
    ? { backgroundColor: "transparent", boxShadow: "none" }
    : {};

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={styles}>
        <Toolbar>
          <IconButton
            disableRipple
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={goToRoot}
          >
            <Logo type="white" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          {onlyLogo === false && (
            <>
              <Button onClick={goToConfession} color="inherit">
                Confession
              </Button>
              <Button onClick={goToRosary} color="inherit">
                Rosary
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default MainNavbar;
