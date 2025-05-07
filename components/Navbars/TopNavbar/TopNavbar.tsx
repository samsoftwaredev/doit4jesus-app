import { LanguageRounded, Logout, Menu as MenuIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { googleLogout } from '@react-oauth/google';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { db, supabase } from '@/classes/SupabaseDB';
import { Loading } from '@/components';
import { NAV_APP_LINKS } from '@/constants';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import { Logo, UserBubble } from '../..';
import { AppLayout } from '../../Templates';
import styles from './TopNavbar.module.scss';

interface Props {
  handleMenu: () => void;
}

const TopNavbar = ({ handleMenu }: Props) => {
  const { lang, changeLang, t } = useLanguageContext();
  const { getProfile } = useUserContext();
  const { user } = useUserContext();
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onViewProfile = () => {
    navigate.push(NAV_APP_LINKS.account.link);
  };

  const onLogout = async () => {
    setIsLoading(true);
    // Remove all saved data from sessionStorage
    sessionStorage.clear();
    await db.logOut();
    googleLogout();
    setIsLoading(false);
  };

  const goToDashboard = () => {
    navigate.push(NAV_APP_LINKS.dashboard.link);
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') getProfile(null);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  });

  if (isLoading) {
    return (
      <AppLayout>
        <Loading />
      </AppLayout>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <IconButton className={styles.topNavbarMenu} onClick={handleMenu}>
        <MenuIcon />
      </IconButton>
      <Button
        disableRipple
        className={styles.topNavbarLogo}
        onClick={goToDashboard}
      >
        <Logo type="white" />
      </Button>
      <IconButton
        className={styles.topNavbarProfile}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disableRipple
      >
        <Typography className={styles.userName} fontWeight="bold" pr={2}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <UserBubble
          userPicture={user?.pictureUrl}
          userName={`${user?.firstName} ${user?.lastName}`}
        />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem sx={{ width: 200, maxWidth: '100%' }} onClick={onViewProfile}>
          <ListItemIcon sx={{ paddingLeft: '5px' }}>
            <UserBubble
              userPicture={user?.pictureUrl}
              userName={`${user?.firstName} ${user?.lastName}`}
            />
          </ListItemIcon>
          <ListItemText sx={{ marginLeft: '-5px' }}>
            {t[NAV_APP_LINKS.account.value as keyof typeof t]}
          </ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <LanguageRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{ marginLeft: '-5px' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography>EN</Typography>
              <Switch
                onChange={() => changeLang()}
                value={lang}
                defaultValue={lang}
              />
              <Typography>ES</Typography>
            </Stack>
          </ListItemText>
        </MenuItem>
        <MenuItem sx={{ width: 200, maxWidth: '100%' }} onClick={onLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t.logout}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TopNavbar;
