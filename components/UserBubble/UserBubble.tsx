import { Close as CloseIcon } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  IconButton,
  Avatar as MuiAvatar,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { useState } from 'react';
import { createPortal } from 'react-dom';

const AvatarWrapper = styled(Box)<{ isOnline: boolean }>(({ isOnline }) => ({
  display: 'inline-flex',
  borderRadius: '50%',
  border: isOnline ? '3px solid #4caf50' : '2px solid transparent',
}));

interface Props {
  userName?: string;
  userId?: string;
  userPicture?: string;
  isOnline?: boolean;
  size?: number;
  avatarSx?: SxProps<Theme>;
  clickable?: boolean;
}

const UserBubble = ({
  userName,
  userPicture,
  isOnline = false,
  size = 20,
  avatarSx,
  clickable = true,
}: Props) => {
  const tooltipMessage = isOnline ? `${userName} is online.` : userName;
  const [open, setOpen] = useState(false);

  const initials = userName
    ? userName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const portalTarget =
    typeof document !== 'undefined'
      ? document.getElementById('user-profile-portal')
      : null;

  const backdrop = (
    <Backdrop
      open={open}
      onClick={() => setOpen(false)}
      sx={{
        zIndex: (t) => t.zIndex.modal,
        flexDirection: 'column',
        gap: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
      }}
    >
      <IconButton
        onClick={() => setOpen(false)}
        sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}
      >
        <CloseIcon />
      </IconButton>
      <MuiAvatar
        src={userPicture ?? undefined}
        alt={userName || 'User Name'}
        sx={{ width: 150, height: 150, fontSize: '3rem' }}
      >
        {initials}
      </MuiAvatar>
      <Typography variant="h5" sx={{ color: 'white', mt: 2 }}>
        {userName}
      </Typography>
      {isOnline && (
        <Typography
          variant="body1"
          sx={{
            color: 'grey.300',
            textAlign: 'center',
            maxWidth: 320,
            px: 2,
          }}
        >
          Online
        </Typography>
      )}
    </Backdrop>
  );

  return (
    <>
      <AvatarWrapper
        isOnline={isOnline}
        onClick={clickable ? () => setOpen(true) : undefined}
        sx={{ cursor: clickable ? 'pointer' : 'default' }}
      >
        <Tooltip title={tooltipMessage}>
          <MuiAvatar
            src={userPicture ?? undefined}
            alt={userName || 'User Name'}
            sx={[
              { width: size, height: size, fontSize: size * 0.45 },
              ...(Array.isArray(avatarSx)
                ? avatarSx
                : avatarSx
                  ? [avatarSx]
                  : []),
            ]}
          >
            {initials}
          </MuiAvatar>
        </Tooltip>
      </AvatarWrapper>
      {portalTarget ? createPortal(backdrop, portalTarget) : backdrop}
    </>
  );
};

export default UserBubble;
