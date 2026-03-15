import styled from '@emotion/styled';
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
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

import { Logo } from '../..';

const LinkItem = styled(Link)({
  transition: 'color 0.3s',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  borderRadius: '10px',
  color: '#71706a',
  padding: '5px',
  margin: '5px',
  '& svg': {
    transition: 'color 0.3s',
    color: '#71706a',
  },
  '&:hover, &:hover svg': {
    color: '#ffffff',
    backgroundColor: '#0b1c2b',
    borderRadius: '10px',
  },
});

const ActiveLinkItem = styled(LinkItem)({
  color: '#ffffff',
  '& svg': {
    color: '#ffffff',
  },
});

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

const CloseButton = styled(IconButton)({
  display: 'flex',
  color: '#ffffff',
});

interface Props {
  handleDrawerClose: () => void;
  menuItems: {
    url: string;
    label: string;
    icon: React.ReactNode;
  }[];
}

const SideNavbar = ({ menuItems, handleDrawerClose }: Props) => {
  const router = useRouter();

  return (
    <List>
      <SideNavHeader>
        <LogoButton disableRipple>
          <Logo type="white" />
        </LogoButton>
        <CloseButton onClick={handleDrawerClose}>
          <Close color="secondary" />
        </CloseButton>
      </SideNavHeader>
      {menuItems.map(({ label, icon, url }) => {
        const isActive = router.pathname === url;
        const StyledLink = isActive ? ActiveLinkItem : LinkItem;
        return (
          <ListItem sx={{ p: 0 }} key={label}>
            <StyledLink href={url}>
              <ListItemIcon
                sx={
                  isActive
                    ? { color: '#ffffff', '& svg': { color: '#ffffff' } }
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
