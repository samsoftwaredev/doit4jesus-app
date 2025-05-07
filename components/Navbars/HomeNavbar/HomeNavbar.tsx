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
      <Button disableRipple href={NAV_MAIN_LINKS.home.link}>
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
        <ListItem>
          <Select
            sx={{ height: '36px', width: '100%' }}
            variant="outlined"
            defaultValue={lang}
            value={lang}
            onChange={() => changeLang()}
          >
            <MenuItem value={LANG.es}>🇺🇸 English</MenuItem>
            <MenuItem value={LANG.en}>🇪🇸 Español</MenuItem>
          </Select>
        </ListItem>
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
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Link
            style={{ textAlign: 'center' }}
            passHref
            href={NAV_MAIN_LINKS.home.link}
          >
            <Logo type="white" />
          </Link>
          <Box sx={{ flexGrow: 1, display: { sm: 'none', md: 'block' } }} />
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
            {navItems.map(({ label, goTo, sx }) => (
              <Link key={label} passHref href={goTo}>
                <Button key={label} sx={sx}>
                  {label}
                </Button>
              </Link>
            ))}
            <Select
              sx={{
                color: 'white',
                height: '36px',
                border: '1px solid white',
                '.MuiSelect-icon': {
                  color: 'white', // Makes the caret (dropdown arrow) white
                },
              }}
              variant="outlined"
              defaultValue={lang}
              value={lang}
              onChange={() => changeLang()}
            >
              <MenuItem value={LANG.es}>🇺🇸 English</MenuItem>
              <MenuItem value={LANG.en}>🇪🇸 Español</MenuItem>
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
            display: { sm: 'block', md: 'none' },
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
