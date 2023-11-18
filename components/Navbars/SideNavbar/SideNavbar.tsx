import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GridViewIcon from "@mui/icons-material/GridView";
import StarIcon from "@mui/icons-material/Star";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CellTowerIcon from "@mui/icons-material/CellTower";
import { useRouter } from "next/router";
import ConfessionIcon from "@mui/icons-material/PsychologyAlt";
import styles from "./SideNavbar.module.scss";
import Link from "next/link";

interface Props {
  open: boolean;
  handleDrawerClose: () => void;
}

export default function SideNavbar({ open, handleDrawerClose }: Props) {
  const navigate = useRouter();
  const menuItems = [
    { url: "/app", label: "All Events", icon: <GridViewIcon /> },
    { url: "/app/live-event", label: "Live Event", icon: <CellTowerIcon /> },
    {
      url: "/app/attending-events",
      label: "Attending Events",
      icon: <StarIcon />,
    },
    { url: "/app/calendar", label: "Calendar", icon: <CalendarTodayIcon /> },
    { url: "/app/settings", label: "Settings", icon: <SettingsIcon /> },
    {
      url: "/app/confession",
      label: "Exam of Conscience",
      icon: <ConfessionIcon />,
    },
    { url: "/app/support", label: "Support", icon: <SupportAgentIcon /> },
  ];
  return (
    <List className={styles.container}>
      {menuItems.map(({ label, icon, url }) => (
        <ListItem key={label}>
          <Link href={url} className={styles.linkItem}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </Link>
        </ListItem>
      ))}
    </List>
  );
}
