import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { Logo } from '../..';

const LinkItem = styled(Link)(({ theme }) => ({
  transition: 'color 0.3s',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  borderRadius: '10px',
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  padding: '5px',
  margin: '5px',
  '& svg': {
    transition: 'color 0.3s',
    color: theme.palette.text.secondary,
  },
  '&:hover, &:hover svg': {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.action.hover,
    borderRadius: '10px',
  },
}));

const ActiveLinkItem = styled(LinkItem)(({ theme }) => ({
  color: theme.palette.text.primary,
  '& svg': {
    color: theme.palette.text.primary,
  },
}));

const SideNavHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px 16px',
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

const LogoButton = styled(Button)({
  display: 'flex',
});

const CloseButton = styled(IconButton)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.text.primary,
}));

interface Props {
  handleDrawerClose: () => void;
  menuItems: {
    url: string;
    label: string;
    icon: React.ReactNode;
  }[];
}

const SideNavbar = ({ menuItems, handleDrawerClose }: Props) => {
  const pathname = usePathname();
  const theme = useTheme();

  return (
    <List>
      <SideNavHeader>
        <LogoButton disableRipple>
          <Logo type={theme.palette.mode === 'dark' ? 'white' : 'black'} />
        </LogoButton>
        <CloseButton onClick={handleDrawerClose}>
          <Close />
        </CloseButton>
      </SideNavHeader>
      {menuItems.map(({ label, icon, url }) => {
        const isActive = pathname === url;
        const StyledLink = isActive ? ActiveLinkItem : LinkItem;
        return (
          <ListItem sx={{ p: 0 }} key={label}>
            <StyledLink href={url}>
              <ListItemIcon
                sx={
                  isActive
                    ? {
                        color: 'text.primary',
                        '& svg': { color: 'text.primary' },
                      }
                    : undefined
                }
              >
                {icon}
              </ListItemIcon>
              <ListItemText primary={label} />
            </StyledLink>
          </ListItem>
        );
      })}
    </List>
  );
};

export default SideNavbar;
