import { AccountCircle, Logout, Menu as MenuIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Typography,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Logo, UserBubble } from "../..";
import styles from "./TopNavbar.module.scss";
import { db, supabase } from "classes/SupabaseDB";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NAV_APP_LINKS } from "@/constants";
import { useUserContext } from "@/context/UserContext";
import { Loading } from "@/components";
import { AppLayout } from "../../Templates";

interface Props {
  handleMenu: () => void;
}

const TopNavbar = ({ handleMenu }: Props) => {
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
    await db.logOut();
    setIsLoading(false);
  };

  const goToDashboard = () => {
    navigate.push(NAV_APP_LINKS.dashboard.link);
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") getProfile(null);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  });

  if (isLoading) {
    return (
      <AppLayout>
        <Loading isPage />
      </AppLayout>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
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
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        disableRipple
      >
        <Typography fontWeight="bold" pr={2}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <UserBubble
          userPicture={user?.pictureUrl}
          userName={`${user?.firstName} ${user?.lastName}`}
        />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem sx={{ width: 200, maxWidth: "100%" }} onClick={onViewProfile}>
          <ListItemIcon sx={{ paddingLeft: "5px" }}>
            <UserBubble
              userPicture={user?.pictureUrl}
              userName={`${user?.firstName} ${user?.lastName}`}
            />
          </ListItemIcon>
          <ListItemText sx={{ marginLeft: "-5px" }}>
            {NAV_APP_LINKS.account.label}
          </ListItemText>
        </MenuItem>
        <MenuItem sx={{ width: 200, maxWidth: "100%" }} onClick={onLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TopNavbar;
