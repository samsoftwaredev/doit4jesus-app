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
  Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import * as React from 'react';

import { Logo } from '@/components';
import ThemeToggle from '@/components/ThemeToggle';
import { COMPANY } from '@/constants/company';
import { NAV_FOOTER_LINKS, NAV_MAIN_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';
import { LANG } from '@/interfaces/index';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.background.default
      : theme.palette.primary.main,
  boxShadow: 'none',
}));

const StyledToolbar = styled(Toolbar)({
  display: 'grid',
  gridTemplateColumns: '20px 1fr 20px',
  gridTemplateRows: '1fr',
  '@media (min-width: 900px)': {
    display: 'flex',
  },
});

interface Props {
  window?: () => Window;
}

const drawerWidth = 240;

function HomeNavbar(props: Props) {
  const { window } = props;
  const { lang, changeLang, t } = useLanguageContext();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const navItems = [
    {
      label: t.aboutPage,
      goTo: NAV_FOOTER_LINKS.about.link,
      sx: { color: 'primary.contrastText' },
    },
    {
      label: t.resourcesPage,
      goTo: NAV_MAIN_LINKS.resources.link,
      sx: { color: 'primary.contrastText' },
    },
    {
      label: t.whyPraySectionTitle,
      goTo: '/#why-pray-rosary',
      sx: { color: 'primary.contrastText' },
    },
    {
      label: t.logIn,
      goTo: NAV_MAIN_LINKS.login.link,
      sx: { color: 'primary.contrastText' },
    },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Button disableRipple href={NAV_MAIN_LINKS.home.link}>
        <Typography sx={{ display: 'none' }}>{COMPANY.name}</Typography>
        <Logo type={theme.palette.mode === 'dark' ? 'white' : 'black'} />
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
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="body2">{t.theme || 'Theme'}</Typography>
            <ThemeToggle />
          </Box>
        </ListItem>
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
      <StyledAppBar position="static">
        <StyledToolbar>
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
            <Logo type={theme.palette.mode === 'dark' ? 'white' : 'black'} />
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
            <ThemeToggle />
            <Select
              sx={{
                color: theme.palette.primary.contrastText,
                height: '36px',
                border: `1px solid ${theme.palette.primary.contrastText}`,
                '.MuiSelect-icon': {
                  color: theme.palette.primary.contrastText,
                },
              }}
              variant="outlined"
              defaultValue={lang}
              value={lang}
              onChange={() => changeLang()}
            >
              <MenuItem value={LANG.en}>🇺🇸 English</MenuItem>
              <MenuItem value={LANG.es}>🇪🇸 Español</MenuItem>
            </Select>
          </Box>
        </StyledToolbar>
      </StyledAppBar>
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
