import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

import { useAudioContext } from '@/context/AudioContext';
import { usePresenceContext } from '@/context/PresenceContext';

import { AudioNext, AudioPlay, AudioPrevious } from '../AudioControllers';
import MovingText from '../MovingText';
import MusicSettings from '../MusicSettings';
import MusicVideo from '../MusicVideo';
import OnlineUsers from '../OnlineUsers';

const PlayerContainer = styled(Box)({
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
    backgroundColor: 'black',
  },
});

const Controls = styled(Box)({
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
  gridTemplateAreas: `'buttonControl buttonControl' 'title mystery'`,
  height: '80px',
  padding: '0 14px',
  boxShadow: '-2px 0px 13px -4px rgba(176, 176, 176, 1)',
  backdropFilter: 'blur(50px)',
  '@media (min-width: 768px)': {
    gridTemplateColumns: '1fr 350px 1fr',
    gridTemplateRows: '1fr',
    gridTemplateAreas: `'title buttonControl mystery'`,
    alignItems: 'center',
  },
});

const PlayerTitle = styled(Typography)({
  color: '#fff',
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
});

const Mystery = styled(Typography)({
  color: '#fff',
  position: 'relative',
  top: '-20px',
  width: '100%',
  gridArea: 'mystery',
  textAlign: 'center',
  '@media (min-width: 768px)': {
    top: '0px',
    textAlign: 'right',
  },
});

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
    <>
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
          <Mystery>
            <OnlineUsers users={users} />
          </Mystery>
        </Controls>
      </PlayerContainer>
    </>
  );
};

export default MusicPlayer;
