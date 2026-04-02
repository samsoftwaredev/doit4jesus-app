import { Box } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

import { useAudioContext } from '@/context/AudioContext';
import { usePresenceContext } from '@/context/PresenceContext';

import { AudioNext, AudioPlay, AudioPrevious } from '../AudioControllers';
import MovingText from '../MovingText';
import MusicSettings from '../MusicSettings';
import MusicVideo from '../MusicVideo';
import OnlineUsers from '../OnlineUsers';

const PlayerContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  right: 0,
  left: 0,
  zIndex: 999,
  '&::before': {
    position: 'fixed',
    bottom: '5px',
    right: 0,
    left: 0,
    zIndex: -100,
    content: '""',
    height: '20px',
    width: '100%',
    backgroundColor: theme.palette.background.default,
  },
}));

const Controls = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  right: 0,
  left: 0,
  zIndex: 1000,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: '1fr 20px',
  gap: '1em 1em',
  gridAutoFlow: 'row',
  gridTemplateAreas: `'buttonControl buttonControl' 'title userPresenceBar'`,
  height: '80px',
  padding: '0 14px',
  boxShadow:
    theme.palette.mode === 'dark'
      ? `-2px 0px 13px -4px ${alpha(theme.palette.common.white, 0.3)}`
      : `-2px 0px 13px -4px ${alpha(theme.palette.common.black, 0.15)}`,
  backdropFilter: 'blur(50px)',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.default, 0.85)
      : alpha(theme.palette.background.paper, 0.85),
  '@media (min-width: 768px)': {
    gridTemplateColumns: '1fr 350px 1fr',
    gridTemplateRows: '1fr',
    gridTemplateAreas: `'title buttonControl userPresenceBar'`,
    alignItems: 'center',
  },
}));

const PlayerTitle = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: '250px',
  textWrap: 'nowrap',
  whiteSpace: 'nowrap',
  gridArea: 'title',
  position: 'relative',
  top: '-20px',
  '@media (min-width: 768px)': {
    display: 'block',
    top: '0px',
  },
}));

const UserPresenceBar = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  position: 'relative',
  top: '-20px',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'end',
  gridArea: 'userPresenceBar',
  textAlign: 'center',
  '@media (min-width: 768px)': {
    top: '0px',
    textAlign: 'right',
  },
}));

const ButtonControl = styled(Box)({
  gridArea: 'buttonControl',
  width: '100%',
  textAlign: 'center',
});

const MusicPlayer = () => {
  const { users } = usePresenceContext();
  const { audioPlayer, hideMusicPlayer } = useAudioContext();

  if (hideMusicPlayer) return null;

  return (
    <PlayerContainer>
      <Controls>
        <PlayerTitle>
          <MovingText>{audioPlayer?.audioTitle}</MovingText>
        </PlayerTitle>
        <ButtonControl>
          <MusicSettings />
          <AudioPrevious />
          <AudioPlay />
          <AudioNext />
          <MusicVideo />
        </ButtonControl>
        <UserPresenceBar>
          <OnlineUsers users={users} />
        </UserPresenceBar>
      </Controls>
    </PlayerContainer>
  );
};

export default MusicPlayer;
