import { AccountCircle, Menu } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { Logo } from "../..";
import styles from "./TopNavbar.module.scss";
import { db } from "@/class/SupabaseDB";
import { useState } from "react";
import { useRouter } from "next/router";
import { NAV_APP_LINKS, NAV_MAIN_LINKS } from "@/constants/nav";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/UserContext";

interface Props {
  handleMenu: () => void;
}

const TopNavbar = ({ handleMenu }: Props) => {
  const { user } = useUserContext();
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    await db.logOut();
    navigate.push(NAV_MAIN_LINKS.login.link);
    toast.success("Shalom! Until next time.");
    setIsLoading(false);
  };

  const goToDashboard = () => {
    navigate.push(NAV_APP_LINKS.app.link);
  };

  if (isLoading) return <p>Bye Bye!</p>;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <IconButton className={styles.topNavbarMenu} onClick={handleMenu}>
        <Menu />
      </IconButton>
      <Button
        disableRipple
        className={styles.topNavbarLogo}
        onClick={goToDashboard}
      >
        <Logo type="white" />
      </Button>
      <IconButton className={styles.topNavbarProfile} onClick={logout}>
        <Typography component={"a"}>{user?.firstName}&nbsp;</Typography>
        <AccountCircle />
      </IconButton>
    </Box>
  );
};

export default TopNavbar;
