import * as React from "react";
import { useRouter } from "next/router";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Button,
} from "@mui/material";
import { Logo } from "../..";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./homeNavbar.module.scss";
import { NAV_FOOTER_LINKS, NAV_MAIN_LINKS } from "@/constants/nav";

interface Props {
  window?: () => Window;
}

const drawerWidth = 240;

function HomeNavbar(props: Props) {
  const { window } = props;
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const goToResources = () => {
    router.push(NAV_MAIN_LINKS.resources.link);
  };

  const goToPray = () => {
    router.push("/#why-pray-rosary");
  };

  const goToHome = () => {
    router.push(NAV_MAIN_LINKS.home.link);
  };

  const goToAbout = () => {
    router.push(NAV_FOOTER_LINKS.about.link);
  };

  const goToLogIn = () => {
    router.push(NAV_MAIN_LINKS.login.link);
  };

  const navItems = [
    {
      label: "About",
      goTo: goToAbout,
      sx: { color: "#fff" },
    },
    {
      label: "Resources",
      goTo: goToResources,
      sx: { color: "#fff" },
    },
    {
      label: "Why Pray The Rosary?",
      goTo: goToPray,
      sx: { color: "#fff" },
    },
    {
      label: "Log In",
      goTo: goToLogIn,
      sx: { color: "#fff" },
    },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Button onClick={goToHome}>
        <Logo type="black" />
      </Button>
      <Divider />
      <List>
        {navItems.map(({ label, goTo }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }} onClick={goTo}>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" position="static" className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Button onClick={goToHome}>
            <Logo type="white" />
          </Button>
          <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }} />
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map(({ label, goTo, sx }) => (
              <Button key={label} onClick={goTo} sx={sx}>
                {label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

export default HomeNavbar;
