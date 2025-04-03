import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Toolbar,
} from '@mui/material';
import Link from 'next/link';
import * as React from 'react';

import { NAV_FOOTER_LINKS, NAV_MAIN_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';
import { LANG } from '@/interfaces/index';

import { Logo } from '../..';
import styles from './homeNavbar.module.scss';

interface Props {
  window?: () => Window;
}

const drawerWidth = 240;

function HomeNavbar(props: Props) {
  const { window } = props;
  const { lang, changeLang, t } = useLanguageContext();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const navItems = [
    {
      label: t.aboutPage,
      goTo: NAV_FOOTER_LINKS.about.link,
      sx: { color: '#fff' },
    },
    {
      label: t.resourcesPage,
      goTo: NAV_MAIN_LINKS.resources.link,
      sx: { color: '#fff' },
    },
    {
      label: t.whyPraySectionTitle,
      goTo: '/#why-pray-rosary',
      sx: { color: '#fff' },
    },
    {
      label: t.logIn,
      goTo: NAV_MAIN_LINKS.login.link,
      sx: { color: '#fff' },
    },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Button href={NAV_MAIN_LINKS.home.link}>
        <Logo type="black" />
      </Button>
      <Divider />
      <List>
        {navItems.map(({ label, goTo }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} href={goTo}>
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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" position="static" className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Link
            style={{ textAlign: 'center' }}
            passHref
            href={NAV_MAIN_LINKS.home.link}
          >
            <Button>
              <Logo type="white" />
            </Button>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} />
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Select
              sx={{ color: '#fff' }}
              defaultValue={lang}
              value={lang}
              onChange={() => changeLang()}
            >
              <MenuItem value={LANG.en}>English</MenuItem>
              <MenuItem value={LANG.es}>Español</MenuItem>
            </Select>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map(({ label, goTo, sx }) => (
              <Link key={label} passHref href={goTo}>
                <Button key={label} sx={sx}>
                  {label}
                </Button>
              </Link>
            ))}
            <Select
              sx={{ color: '#fff' }}
              defaultValue={lang}
              value={lang}
              onChange={() => changeLang()}
            >
              <MenuItem value={LANG.en}>English</MenuItem>
              <MenuItem value={LANG.es}>Español</MenuItem>
            </Select>
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
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
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
