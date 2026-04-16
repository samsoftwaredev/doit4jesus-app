import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';

import UserBubble from '@/components/UserBubble/UserBubble';
import { useLanguageContext } from '@/context/LanguageContext';
import type { LeaderboardEntry } from '@/interfaces/weeklyLeaderboard';

const PODIUM_COLORS = {
  1: { bg: '#ffd700', text: '#5a4300', label: 'gold' },
  2: { bg: '#c0c0c0', text: '#3a3a3a', label: 'silver' },
  3: { bg: '#cd7f32', text: '#3d2600', label: 'bronze' },
} as const;

const PodiumCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'podiumRank',
})<{ podiumRank: number }>(({ theme, podiumRank }) => {
  const colors = PODIUM_COLORS[podiumRank as keyof typeof PODIUM_COLORS];
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: 16,
    background: `linear-gradient(135deg, ${alpha(colors?.bg ?? '#888', 0.15)}, ${alpha(colors?.bg ?? '#888', 0.05)})`,
    border: `2px solid ${alpha(colors?.bg ?? '#888', 0.3)}`,
    flex: podiumRank === 1 ? '1.2' : '1',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  };
});

const RankBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'podiumRank',
})<{ podiumRank: number }>(({ podiumRank }) => {
  const colors = PODIUM_COLORS[podiumRank as keyof typeof PODIUM_COLORS];
  return {
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors?.bg ?? '#888',
    color: colors?.text ?? '#fff',
    fontWeight: 800,
    fontSize: '0.85rem',
    marginBottom: 8,
  };
});

interface Props {
  entries: LeaderboardEntry[];
}

const LeaderboardPodium = ({ entries }: Props) => {
  const { t } = useLanguageContext();
  const theme = useTheme();

  const top3 = entries.filter((e) => e.rank <= 3).slice(0, 3);

  if (top3.length === 0) return null;

  // Reorder for display: [2nd, 1st, 3rd]
  const ordered = [
    top3.find((e) => e.rank === 2),
    top3.find((e) => e.rank === 1),
    top3.find((e) => e.rank === 3),
  ].filter(Boolean) as LeaderboardEntry[];

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <EmojiEventsIcon sx={{ color: theme.palette.gold.main }} />
        <Typography variant="h6" fontWeight={700}>
          {t.weeklyLeaderboardTopPerformers}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1.5} alignItems="flex-end">
        {ordered.map((entry) => {
          const initials =
            `${entry.firstName?.[0] ?? ''}${entry.lastName?.[0] ?? ''}`.toUpperCase();
          return (
            <PodiumCard key={entry.userId} podiumRank={entry.rank}>
              <RankBadge podiumRank={entry.rank}>{entry.rank}</RankBadge>

              <Box sx={{ mb: 1 }}>
                <UserBubble
                  userName={`${entry.firstName} ${entry.lastName}`}
                  userPicture={entry.pictureUrl ?? undefined}
                  avatarSx={{
                    border: `3px solid ${PODIUM_COLORS[entry.rank as keyof typeof PODIUM_COLORS]?.bg ?? '#888'}`,
                  }}
                  size={entry.rank === 1 ? 64 : 52}
                />
              </Box>

              <Typography
                variant="body2"
                fontWeight={700}
                noWrap
                sx={{ maxWidth: 100 }}
              >
                {entry.firstName}
              </Typography>

              <Chip
                label={`${entry.totalXp.toLocaleString()} XP`}
                size="small"
                sx={{
                  mt: 0.5,
                  fontWeight: 700,
                  bgcolor: alpha(
                    PODIUM_COLORS[entry.rank as keyof typeof PODIUM_COLORS]
                      ?.bg ?? '#888',
                    0.2,
                  ),
                }}
              />
            </PodiumCard>
          );
        })}
      </Stack>
    </Box>
  );
};

export default LeaderboardPodium;
