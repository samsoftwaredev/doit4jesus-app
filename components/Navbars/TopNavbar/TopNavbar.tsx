import { LanguageRounded, Logout, Menu as MenuIcon } from '@mui/icons-material';
import {
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
import { styled } from '@mui/material/styles';
import { googleLogout } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { db, supabase } from '@/classes/SupabaseDB';
import { Loading } from '@/components';
import ThemeToggle from '@/components/ThemeToggle';
import { NAV_APP_LINKS } from '@/constants';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import { LANG } from '@/interfaces';

import { Logo, UserBubble } from '../..';
import { AppLayout } from '../../Templates';

const MenuButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  visibility: 'visible',
  marginLeft: '-30px',
  '@media (min-width: 768px)': {
    visibility: 'hidden',
  },
}));

const LogoButton = styled(Button)({
  marginLeft: 0,
  '@media (min-width: 768px)': {
    marginLeft: '-30px',
  },
});

const ProfileButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.secondary.main,
  marginRight: '-30px',
  display: 'flex',
  '& svg': {
    position: 'relative',
    top: '-3px',
    fontSize: '1.3em',
  },
  '& img': {
    position: 'relative',
    top: '-3px',
  },
}));

const UserName = styled(Typography)({
  display: 'none',
  '@media (min-width: 768px)': {
    display: 'block',
  },
});

interface Props {
  handleMenu: () => void;
}

const TopNavbar = ({ handleMenu }: Props) => {
  const { lang, changeLang, t } = useLanguageContext();
  const { getProfile } = useUserContext();
  const { user } = useUserContext();
  const router = useRouter();
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
    router.push(NAV_APP_LINKS.account.link);
  };

  const onLogout = async () => {
    setIsLoading(true);
    try {
      sessionStorage.clear();
      await db.logOut();
      googleLogout();
    } catch (error) {
      console.error('Error in TopNavbar (onLogout):', error);
      toast.error('Unable to log out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToDashboard = () => {
    router.push(NAV_APP_LINKS.dashboard.link);
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
    <nav
      aria-label="Top navigation bar"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <MenuButton onClick={handleMenu} aria-label="Open menu">
        <MenuIcon color="secondary" />
      </MenuButton>
      <LogoButton
        disableRipple
        onClick={goToDashboard}
        aria-label="Go to dashboard"
      >
        <Logo />
      </LogoButton>
      <Stack direction="row" alignItems="center" spacing={1}>
        <ThemeToggle />
        <ProfileButton
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          disableRipple
          aria-label="Open user menu"
        >
          <UserName fontWeight="bold" pr={2}>
            {user?.firstName} {user?.lastName}
          </UserName>
          <UserBubble
            userPicture={user?.pictureUrl}
            userName={`${user?.firstName} ${user?.lastName}`}
          />
        </ProfileButton>
      </Stack>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          sx={{ width: 200, maxWidth: '100%' }}
          onClick={onViewProfile}
          aria-label="View profile"
        >
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
        <MenuItem aria-label="Change language">
          <ListItemIcon>
            <LanguageRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{ marginLeft: '-5px' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography>EN</Typography>
              <Switch
                onChange={() => changeLang()}
                defaultChecked={lang === LANG.es}
                value={lang}
                aria-label="Toggle language"
              />
              <Typography>ES</Typography>
            </Stack>
          </ListItemText>
        </MenuItem>
        <MenuItem
          sx={{ width: 200, maxWidth: '100%' }}
          onClick={onLogout}
          aria-label="Log out"
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t.logout}</ListItemText>
        </MenuItem>
      </Menu>
    </nav>
  );
};

export default TopNavbar;
