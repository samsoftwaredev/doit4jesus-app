import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GridViewIcon from '@mui/icons-material/GridView';
import SoldierIcon from '@mui/icons-material/MilitaryTech';
import TableChartIcon from '@mui/icons-material/TableChart';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { usePathname } from 'next/navigation';
import React, { useMemo, useState } from 'react';

import Meta from '@/components/Meta';
import { SideNavbar, TopNavbar } from '@/components/Navbars';
import { useLanguageContext } from '@/context/LanguageContext';

const LayoutContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'grid',
  gridTemplateColumns: '0px 1fr',
  gridTemplateRows: '60px 30px 1fr',
  gridColumnGap: '0px',
  gridRowGap: '0px',
  minHeight: '100vh',
  '@media (min-width: 768px)': {
    gridTemplateColumns: '300px 1fr',
  },
}));

const PageTitle = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '3em',
  color: theme.palette.text.primary,
  gridColumnStart: 1,
  gridColumnEnd: 3,
}));

const TopNavbarArea = styled(Box)(({ theme }) => ({
  gridColumnStart: 1,
  gridColumnEnd: 3,
  backgroundColor: theme.palette.background.default,
  margin: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0px 40px',
  marginTop: '30px',
  marginBottom: '30px',
  zIndex: 889,
  '@media (min-width: 768px)': {
    justifyContent: 'flex-start',
  },
}));

const SideNavbarArea = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  transition: 'all 0.3s',
  borderRadius: '10px',
  gridColumnStart: 1,
  gridColumnEnd: 2,
  margin: 0,
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  paddingLeft: 0,
  position: 'fixed',
  top: 0,
  left: open ? 0 : '748px',
  right: 0,
  bottom: 0,
  zIndex: 890,
  '@media (min-width: 768px)': {
    position: 'relative',
    left: 0,
    backgroundColor: theme.palette.background.paper,
    marginRight: '0.5em',
    marginLeft: '1em',
    marginTop: '1em',
    paddingLeft: '0.5em',
    width: 'calc(100% - 40px)',
  },
}));

const ContentArea = styled(Box)({
  borderRadius: '10px',
  gridColumnStart: 2,
  gridColumnEnd: 3,
  paddingBottom: '80px',
});

interface Props {
  children: React.ReactNode;
}

const AppLayout = ({ children }: Props) => {
  const { t } = useLanguageContext();
  const pathname = usePathname();

  const menuItems = [
    { url: '/app/dashboard', label: t.dashboard, icon: <TableChartIcon /> },
    {
      url: '/app/achievements',
      label: t.achievements,
      icon: <EmojiEventsIcon />,
    },
    // { url: "/app/soldiers", label: "Militant Church", icon: <SoldierIcon /> },
    { url: '/app/rosaries', label: t.rosaryMysteries, icon: <GridViewIcon /> },
    { url: '/app/friends', label: t.friends, icon: <SoldierIcon /> },
    // { url: '/app/live-event', label: 'Live Event', icon: <CellTowerIcon /> },
    // {
    //   url: "/app/attending-events",
    //   label: "Attending Events",
    //   icon: <StarIcon />,
    // },
    // TODO: enable confession once module is completed
    {
      url: '/app/confession',
      label: 'Exam of Conscience',
      icon: <EmojiEventsIcon />,
    },
    // { url: "/app/settings", label: "Settings", icon: <SettingsIcon /> },
    // { url: "/app/support", label: "Support", icon: <SupportAgentIcon /> },
  ];

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const pageTitle = useMemo(
    () => menuItems.find((menu) => menu.url === pathname),
    [pathname],
  );

  return (
    <>
      <Meta pageTitle={pageTitle?.label} />
      <LayoutContainer>
        <TopNavbarArea>
          <TopNavbar handleMenu={handleDrawerOpen} />
        </TopNavbarArea>
        <PageTitle>
          <Typography component="h1" variant="h4">
            {pageTitle?.label}
          </Typography>
        </PageTitle>
        <SideNavbarArea open={drawerOpen}>
          <SideNavbar
            menuItems={menuItems}
            handleDrawerClose={handleDrawerOpen}
          />
        </SideNavbarArea>
        <ContentArea>{children}</ContentArea>
      </LayoutContainer>
    </>
  );
};

export default AppLayout;
