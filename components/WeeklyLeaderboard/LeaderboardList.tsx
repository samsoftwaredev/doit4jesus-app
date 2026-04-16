import { Box, Stack, Typography } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';

import UserBubble from '@/components/UserBubble/UserBubble';
import { useLanguageContext } from '@/context/LanguageContext';
import type { LeaderboardEntry } from '@/interfaces/weeklyLeaderboard';

const ListRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isHighlighted',
})<{ isHighlighted: boolean }>(({ theme, isHighlighted }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  borderRadius: 12,
  transition: 'background-color 0.2s ease, transform 0.15s ease',
  backgroundColor: isHighlighted
    ? alpha(theme.palette.gold.main, 0.12)
    : 'transparent',
  border: isHighlighted
    ? `1px solid ${alpha(theme.palette.gold.main, 0.3)}`
    : '1px solid transparent',
  '&:hover': {
    backgroundColor: isHighlighted
      ? alpha(theme.palette.gold.main, 0.18)
      : alpha(theme.palette.action.hover, 0.06),
    transform: 'scale(1.01)',
  },
}));

const RankNumber = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'rank',
})<{ rank: number }>(({ rank }) => ({
  width: 32,
  textAlign: 'center',
  fontWeight: rank <= 3 ? 800 : 600,
  fontSize: rank <= 3 ? '1.1rem' : '0.95rem',
  color: rank <= 3 ? '#ffd700' : 'inherit',
}));

interface Props {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

const LeaderboardList = ({ entries, currentUserId }: Props) => {
  const { t } = useLanguageContext();
  const theme = useTheme();

  const listEntries = entries.filter((e) => e.rank > 3);

  if (listEntries.length === 0 && entries.length <= 3) return null;

  const displayEntries = listEntries.length > 0 ? listEntries : entries;

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
        {t.weeklyLeaderboardRankings}
      </Typography>

      <Stack spacing={0.5}>
        {displayEntries.map((entry) => {
          const isMe = entry.isCurrentUser || entry.userId === currentUserId;
          const initials =
            `${entry.firstName?.[0] ?? ''}${entry.lastName?.[0] ?? ''}`.toUpperCase();

          return (
            <ListRow key={entry.userId} isHighlighted={isMe}>
              <RankNumber rank={entry.rank}>#{entry.rank}</RankNumber>

              <Box sx={{ mx: 1.5 }}>
                <UserBubble
                  userName={`${entry.firstName} ${entry.lastName}`}
                  userPicture={entry.pictureUrl ?? undefined}
                  size={36}
                />
              </Box>

              <Box flex={1} minWidth={0}>
                <Typography
                  variant="body2"
                  fontWeight={isMe ? 700 : 500}
                  noWrap
                >
                  {entry.firstName} {entry.lastName}
                  {isMe && (
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        ml: 0.5,
                        color: theme.palette.gold.main,
                        fontWeight: 700,
                      }}
                    >
                      ({t.weeklyLeaderboardYou})
                    </Typography>
                  )}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ color: theme.palette.gold.main }}
              >
                {entry.totalXp.toLocaleString()} XP
              </Typography>
            </ListRow>
          );
        })}
      </Stack>
    </Box>
  );
};

export default LeaderboardList;
