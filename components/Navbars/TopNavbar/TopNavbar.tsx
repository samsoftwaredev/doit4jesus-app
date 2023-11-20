import { Menu } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import { Logo } from "../..";
import styles from "./TopNavbar.module.scss";

interface Props {
  handleMenu: () => void;
}

const TopNavbar = ({ handleMenu }: Props) => {
  return (
    <>
      <IconButton className={styles.topNavbarMenu} onClick={handleMenu}>
        <Menu />
      </IconButton>
      <Button disableRipple className={styles.topNavbarLogo}>
        <Logo type="white" />
      </Button>
      <Box className={styles.topNavbarProfile} />
      {/* <Button endIcon={<AccountBoxIcon />}>Logout</Button> */}
    </>
  );
};

export default TopNavbar;
