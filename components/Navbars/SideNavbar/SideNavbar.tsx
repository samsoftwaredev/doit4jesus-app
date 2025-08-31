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

import { css } from '@/utils/helpers';

import { Logo } from '../..';
import styles from './SideNavbar.module.scss';

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
      <Box className={styles.sideNavHeader}>
        <Button disableRipple className={styles.logo}>
          <Logo type="white" />
        </Button>
        <IconButton onClick={handleDrawerClose} className={styles.close}>
          <Close color="secondary" />
        </IconButton>
      </Box>
      {menuItems.map(({ label, icon, url }) => (
        <ListItem sx={{ p: 0 }} key={label}>
          <Link
            href={url}
            className={css(
              styles.linkItem,
              router.pathname === url ? styles.active : '',
            )}
          >
            <ListItemIcon
              className={router.pathname === url ? styles.active : ''}
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
