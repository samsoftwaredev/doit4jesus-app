import Link from "next/link";
import * as React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import { Close } from "@mui/icons-material";

import { css } from "@/utils/helpers";

import styles from "./SideNavbar.module.scss";
import { Logo } from "../..";

interface Props {
  handleDrawerClose: () => void;
  menuItems: {
    url: string;
    label: string;
    icon: React.ReactNode;
  }[];
}

const SideNavbar = ({ menuItems, handleDrawerClose }: Props) => {
  const navigate = useRouter();

  return (
    <List>
      <Box display="flex" justifyContent="space-between" px={1}>
        <Button disableRipple className={styles.logo}>
          <Logo type="white" />
        </Button>
        <IconButton onClick={handleDrawerClose} className={styles.close}>
          <Close />
        </IconButton>
      </Box>
      {menuItems.map(({ label, icon, url }) => (
        <ListItem sx={{ p: 0 }} key={label}>
          <Link
            href={url}
            className={css(
              styles.linkItem,
              navigate.pathname === url ? styles.active : ""
            )}
          >
            <ListItemIcon
              className={navigate.pathname === url ? styles.active : ""}
            >
              {icon}
            </ListItemIcon>
            <ListItemText primary={label} />
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

export default SideNavbar;
