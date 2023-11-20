import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useRouter } from "next/router";
import styles from "./SideNavbar.module.scss";
import Link from "next/link";
import { css } from "@/utils/helpers";

interface Props {
  open: boolean;
  handleDrawerClose: () => void;
  menuItems: {
    url: string;
    label: string;
    icon: React.ReactNode;
  }[];
}

export default function SideNavbar({
  menuItems,
  open,
  handleDrawerClose,
}: Props) {
  const navigate = useRouter();

  return (
    <List>
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
}
