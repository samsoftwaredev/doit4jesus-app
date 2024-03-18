import * as React from "react";
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
import Link from "next/link";

interface Props {
  window?: () => Window;
}

const drawerWidth = 240;

function HomeNavbar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const navItems = [
    {
      label: "About",
      goTo: NAV_FOOTER_LINKS.about.link,
      sx: { color: "#fff" },
    },
    {
      label: "Resources",
      goTo: NAV_MAIN_LINKS.resources.link,
      sx: { color: "#fff" },
    },
    {
      label: "Why Pray The Rosary?",
      goTo: "/#why-pray-rosary",
      sx: { color: "#fff" },
    },
    {
      label: "Log In",
      goTo: NAV_MAIN_LINKS.login.link,
      sx: { color: "#fff" },
    },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Button href={NAV_MAIN_LINKS.home.link}>
        <Logo type="black" />
      </Button>
      <Divider />
      <List>
        {navItems.map(({ label, goTo }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }} href={goTo}>
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
          <Link
            style={{ textAlign: "center" }}
            passHref
            href={NAV_MAIN_LINKS.home.link}
          >
            <Button>
              <Logo type="white" />
            </Button>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }} />
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map(({ label, goTo, sx }) => (
              <Link key={label} passHref href={goTo}>
                <Button key={label} sx={sx}>
                  {label}
                </Button>
              </Link>
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
