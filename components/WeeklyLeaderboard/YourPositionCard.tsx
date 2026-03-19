import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';

import { useLanguageContext } from '@/context/LanguageContext';
import type { UserLeaderboardPosition } from '@/interfaces/weeklyLeaderboard';

const PositionCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 16,
  background: `linear-gradient(135deg, ${alpha(theme.palette.gold.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
  border: `1px solid ${alpha(theme.palette.gold.main, 0.2)}`,
}));

const RankDisplay = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 800,
  lineHeight: 1,
  background: `linear-gradient(135deg, ${theme.palette.gold.main}, ${theme.palette.gold.dark})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

interface Props {
  position: UserLeaderboardPosition | null;
}

const YourPositionCard = ({ position }: Props) => {
  const { t } = useLanguageContext();
  const theme = useTheme();

  if (!position || position.currentRank === 0) {
    return (
      <PositionCard>
        <Stack alignItems="center" spacing={1} py={2}>
          <TrendingUpIcon
            sx={{ fontSize: 40, color: theme.palette.gold.main, opacity: 0.6 }}
          />
          <Typography variant="body1" fontWeight={600} textAlign="center">
            {t.weeklyLeaderboardStartPraying}
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {t.weeklyLeaderboardEmptyDescription}
          </Typography>
        </Stack>
      </PositionCard>
    );
  }

  return (
    <PositionCard>
      <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
        {t.weeklyLeaderboardYourPosition}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={3}>
        <Box textAlign="center">
          <RankDisplay>#{position.currentRank}</RankDisplay>
          <Typography variant="caption" color="text.secondary">
            {t.weeklyLeaderboardRank}
          </Typography>
        </Box>

        <Box flex={1}>
          <Stack spacing={1}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t.weeklyLeaderboardXpThisWeek}
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {position.totalXp.toLocaleString()} XP
              </Typography>
            </Box>

            {position.xpToNextRank > 0 && (
              <Chip
                icon={<ArrowUpwardIcon sx={{ fontSize: 16 }} />}
                label={t.weeklyLeaderboardXpToNextRank
                  .replace('{{xp}}', position.xpToNextRank.toLocaleString())
                  .replace('{{rank}}', String(position.currentRank - 1))}
                size="small"
                sx={{
                  fontWeight: 600,
                  bgcolor: alpha(theme.palette.gold.main, 0.15),
                  color: theme.palette.gold.dark,
                  width: 'fit-content',
                }}
              />
            )}
          </Stack>
        </Box>
      </Stack>
    </PositionCard>
  );
};

export default YourPositionCard;
