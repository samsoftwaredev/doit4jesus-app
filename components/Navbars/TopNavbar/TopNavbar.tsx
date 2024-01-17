import { AccountCircle, Menu } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import { Logo } from "../..";
import styles from "./TopNavbar.module.scss";
import { db } from "@/class/SupabaseDB";

interface Props {
  handleMenu: () => void;
}

const TopNavbar = ({ handleMenu }: Props) => {
  const logout = async () => {
    await db.logOut();
  };

  return (
    <Box>
      <IconButton className={styles.topNavbarMenu} onClick={handleMenu}>
        <Menu />
      </IconButton>
      <Button disableRipple className={styles.topNavbarLogo}>
        <Logo type="white" />
      </Button>
      <IconButton>
        <AccountCircle className={styles.topNavbarProfile} onClick={logout} />
      </IconButton>
    </Box>
  );
};

export default TopNavbar;
