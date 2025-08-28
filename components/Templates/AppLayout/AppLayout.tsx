import GridViewIcon from '@mui/icons-material/GridView';
import SoldierIcon from '@mui/icons-material/MilitaryTech';
import TableChartIcon from '@mui/icons-material/TableChart';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';

import Meta from '@/components/Meta';
import { SideNavbar, TopNavbar } from '@/components/Navbars';
import { useLanguageContext } from '@/context/LanguageContext';
import { css } from '@/utils/helpers';

import styles from './AppLayout.module.scss';

interface Props {
  children: React.ReactNode;
}

const AppLayout = ({ children }: Props) => {
  const { t } = useLanguageContext();

  const menuItems = [
    { url: '/app/dashboard', label: t.dashboard, icon: <TableChartIcon /> },
    // { url: "/app/soldiers", label: "Militant Church", icon: <SoldierIcon /> },
    { url: '/app', label: t.rosaryMysteries, icon: <GridViewIcon /> },
    { url: '/app/friends', label: t.friends, icon: <SoldierIcon /> },
    // { url: '/app/live-event', label: 'Live Event', icon: <CellTowerIcon /> },
    // {
    //   url: "/app/attending-events",
    //   label: "Attending Events",
    //   icon: <StarIcon />,
    // },
    // TODO: enable confession once module is completed
    // {
    //   url: "/app/confession",
    //   label: "Exam of Conscience",
    //   icon: <ConfessionIcon />,
    // },
    // { url: "/app/settings", label: "Settings", icon: <SettingsIcon /> },
    // { url: "/app/support", label: "Support", icon: <SupportAgentIcon /> },
  ];

  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const pageTitle = useMemo(
    () => menuItems.find((menu) => menu.url === router.pathname),
    [router.pathname],
  );

  return (
    <>
      <Meta pageTitle={pageTitle?.label} />
      <Box className={styles.container}>
        <Box component="menu" className={styles.topNavbar}>
          <TopNavbar handleMenu={handleDrawerOpen} />
        </Box>
        <Box component="header" className={styles.pageTitle}>
          <Typography component="h1" variant="h4">
            {pageTitle?.label}
          </Typography>
        </Box>
        <Box
          component="menu"
          className={css(
            styles.sideNavbar,
            drawerOpen ? styles.sideNavbarOpen : styles.sideNavbarClose,
          )}
        >
          <SideNavbar
            menuItems={menuItems}
            handleDrawerClose={handleDrawerOpen}
          />
        </Box>
        <Box className={styles.content} component="main">
          {children}
        </Box>
      </Box>
    </>
  );
};

export default AppLayout;
