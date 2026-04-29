import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { alpha, keyframes, styled } from '@mui/material/styles';

import UserBubble from '@/components/UserBubble';

export interface CandleIntention {
  id: string;
  intention: string;
  prayerCount: number;
  /** Has the current user already prayed for this intention? */
  hasPrayed?: boolean;
  userName: string;
  userPicture?: string;
}

interface Props {
  intentions: CandleIntention;
  onPray?: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Candle flame animation                                             */
/* ------------------------------------------------------------------ */

const flicker = keyframes`
  0%, 100% { transform: scale(1) rotate(-1deg);   opacity: 1;   }
  25%      { transform: scale(1.04) rotate(1deg);  opacity: 0.9; }
  50%      { transform: scale(0.96) rotate(-0.5deg); opacity: 1;   }
  75%      { transform: scale(1.02) rotate(0.5deg); opacity: 0.95;}
`;

const FlameWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  width: 56,
  flexShrink: 0,
});

const Flame = styled(Box)(({ theme }) => ({
  width: 22,
  height: 40,
  background: `radial-gradient(ellipse at 60% 80%,
    ${theme.palette.warning.light} 0%,
    ${alpha(theme.palette.warning.main, 0.85)} 40%,
    ${alpha('#ff6f00', 0.6)} 70%,
    transparent 100%)`,
  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
  position: 'relative',
  animation: `${flicker} 2.5s ease-in-out infinite`,
  boxShadow: `0 0 12px 4px ${alpha(theme.palette.warning.main, 0.45)}`,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 6,
    height: 18,
    background: theme.palette.grey[400],
    borderRadius: 2,
  },
}));

const CandleCards = ({ intentions, onPray }: Props) => {
  const item = intentions;

  return (
    <>
      <FlameWrapper>
        <Flame />
      </FlameWrapper>
      <Box>
        <Typography variant="body2" fontWeight={700}>
          {item.intention}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
          <UserBubble
            userName={item.userName}
            userPicture={item.userPicture}
            size={22}
            clickable={false}
          />
          <Typography variant="caption" color="text.secondary" noWrap>
            {item.userName}
          </Typography>
        </Stack>
      </Box>

      <Tooltip title="Pray for this intention">
        <Stack direction="row" alignItems="center" spacing={0.25}>
          <IconButton
            size="small"
            color={item.hasPrayed ? 'primary' : 'default'}
            onClick={() => onPray?.(item.id)}
          >
            🙏
          </IconButton>
          {item.prayerCount > 0 && (
            <Typography variant="caption" color="text.secondary">
              {item.prayerCount}
            </Typography>
          )}
        </Stack>
      </Tooltip>
    </>
  );
};

export default CandleCards;
