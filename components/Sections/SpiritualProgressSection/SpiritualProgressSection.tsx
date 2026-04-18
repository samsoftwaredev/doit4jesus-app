import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Alert,
  Box,
  Chip,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';

import { Card, Loading } from '@/components';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import { SpiritualProgressSnapshot } from '@/interfaces';
import { getSpiritualProgress } from '@/services/spiritualXp';

const ConfettiCelebration = dynamic(
  () => import('@/components/ConfettiCelebration'),
  { ssr: false },
);

const Grid = styled(Box)({
  display: 'grid',
  gap: 12,
  gridTemplateColumns: '1fr',
  '@media (min-width: 1024px)': {
    gridTemplateColumns: '1fr 1fr',
  },
});

const HeroTitle = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(120deg, ${theme.palette.gold.main}, ${theme.palette.secondary.light})`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
}));

const actionLabelMap: Record<string, string> = {
  rosary_completed: 'completedRosaryAction',
  daily_activity: 'dailyPrayerAction',
  streak: 'streakBonusAction',
  helping_user: 'helpingUserAction',
  prayer_request_submitted: 'prayerRequestSubmittedAction',
  prayer_request_engagement: 'prayerRequestEngagementAction',
  scripture_reading: 'scriptureReflectionAction',
  friend_invite: 'invitedFriendAction',
  level_up: 'levelUpAction',
};

const formatXPEvent = (
  type: string,
  metadata: Record<string, unknown> | null,
): string => {
  if (type === 'streak' && typeof metadata?.streak_length === 'number') {
    return `streakLabel:${metadata.streak_length}`;
  }
  if (type === 'level_up') {
    const newTitle = metadata?.new_title;
    if (typeof newTitle === 'string' && newTitle.length > 0) {
      return `advancedTo:${newTitle}`;
    }
  }
  return actionLabelMap[type] ?? type;
};

const SpiritualProgressSection = () => {
  const theme = useTheme();
  const { t } = useLanguageContext();
  const { user } = useUserContext();
  const [snapshot, setSnapshot] = useState<SpiritualProgressSnapshot | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  const refresh = async () => {
    if (!user?.userId) return;
    setIsLoading(true);
    const data = await getSpiritualProgress(user.userId);
    setSnapshot(data);
    setShowCelebration(Boolean(data?.recentlyLeveledUp));
    setIsLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, [user?.userId]);

  const nearbyLevels = useMemo(() => {
    if (!snapshot) return [];
    return snapshot.levels.filter(
      (level) =>
        level.level >= snapshot.profile.currentLevel &&
        level.level <= snapshot.profile.currentLevel + 4,
    );
  }, [snapshot]);

  if (isLoading) return <Loading isFeature />;

  if (!snapshot) {
    return (
      <Container className="container-box" maxWidth="md">
        <Alert severity="error">{t.unableToLoadSpiritualProgress}</Alert>
      </Container>
    );
  }

  return (
    <Container className="container-box" maxWidth="md">
      {showCelebration ? <ConfettiCelebration /> : null}

      <Card sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="overline"
          color="textSecondary"
          sx={{ letterSpacing: 2 }}
        >
          {t.spiritualXpSystem}
        </Typography>
        <HeroTitle variant="h3" fontWeight={800}>
          {t.spiritualProgress}
        </HeroTitle>
        <Typography color="text.secondary">
          {t.faithfulActionsDescription}
        </Typography>
      </Card>

      <Grid>
        <Card>
          <Stack spacing={1.2}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5" fontWeight={700}>
                {t.xpSummary}
              </Typography>
              <Chip
                color="warning"
                icon={<StarIcon />}
                label={`Level ${snapshot.profile.currentLevel}`}
              />
            </Stack>

            <Typography variant="h4" fontWeight={800}>
              {snapshot.profile.currentTitle}
            </Typography>

            <Typography variant="body1">
              {t.totalXp}{' '}
              <strong>{snapshot.profile.totalXp.toLocaleString()}</strong>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {snapshot.nextLevel
                ? t.xpToNextLevel
                    .replace('{{xp}}', snapshot.xpToNextLevel.toLocaleString())
                    .replace('{{title}}', snapshot.nextLevel.title)
                : t.maximumLevelReached}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={snapshot.progressPercentToNext}
              sx={{ height: 10, borderRadius: 999 }}
            />

            {snapshot.currentLevelBadgeKey ? (
              <Alert icon={<EmojiEventsIcon />} severity="success">
                {t.badgeUnlocked}{' '}
                <strong>{snapshot.currentLevelBadgeKey}</strong>
              </Alert>
            ) : null}
          </Stack>
        </Card>

        <Card>
          <Stack spacing={1.2}>
            <Typography variant="h5" fontWeight={700}>
              {t.nextMilestone}
            </Typography>
            {snapshot.nextLevel ? (
              <>
                <Typography variant="h4" fontWeight={800}>
                  {snapshot.nextLevel.title}
                </Typography>
                <Typography color="text.secondary">
                  {t.reachTotalXp.replace(
                    '{{xp}}',
                    snapshot.nextLevel.minXp.toLocaleString(),
                  )}
                </Typography>
                <Chip
                  icon={<TrendingUpIcon />}
                  label={t.xpRemaining.replace(
                    '{{xp}}',
                    snapshot.xpToNextLevel.toLocaleString(),
                  )}
                  sx={{ width: 'fit-content' }}
                />
              </>
            ) : (
              <Alert severity="success">{t.allMilestonesComplete}</Alert>
            )}

            <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
              {t.weeklySummary}
            </Typography>
            <Typography>
              {t.weeklyXpSummary
                .replace(
                  '{{xp}}',
                  snapshot.weeklySummary.totalXp.toLocaleString(),
                )
                .replace(
                  '{{count}}',
                  String(snapshot.weeklySummary.eventCount),
                )}
            </Typography>
            {snapshot.weeklySummary.breakdown.slice(0, 3).map((item) => (
              <Box
                key={item.type}
                sx={{
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {(t as Record<string, string>)[
                    formatXPEvent(item.type, null as never)
                  ] ?? formatXPEvent(item.type, null as never)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  +{item.totalXp} XP • {item.events} events
                </Typography>
              </Box>
            ))}
          </Stack>
        </Card>

        <Card>
          <Stack spacing={1.2}>
            <Typography variant="h5" fontWeight={700}>
              {t.levelPath}
            </Typography>
            {nearbyLevels.map((level) => {
              const isCurrent = level.level === snapshot.profile.currentLevel;
              const isNext = snapshot.nextLevel?.level === level.level;

              return (
                <Box
                  key={level.level}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 2,
                    px: 1.5,
                    py: 1,
                    border: `1px solid ${alpha(theme.palette.text.primary, 0.14)}`,
                    bgcolor: isCurrent
                      ? alpha(theme.palette.gold.main, 0.18)
                      : alpha(theme.palette.background.paper, 0.3),
                  }}
                >
                  <Box>
                    <Typography fontWeight={700}>{level.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {level.minXp.toLocaleString()} XP
                    </Typography>
                  </Box>

                  {isCurrent ? (
                    <Chip size="small" color="warning" label={t.current} />
                  ) : null}
                  {isNext ? (
                    <Chip
                      size="small"
                      color="primary"
                      icon={<KeyboardArrowUpIcon />}
                      label={t.next}
                    />
                  ) : null}
                </Box>
              );
            })}
          </Stack>
        </Card>

        <Card>
          <Stack spacing={1.2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <MilitaryTechIcon color="secondary" />
              <Typography variant="h5" fontWeight={700}>
                {t.xpActivityFeed}
              </Typography>
            </Stack>

            {snapshot.recentEvents.length === 0 ? (
              <Typography color="text.secondary">
                {t.noXpActivityYet}
              </Typography>
            ) : (
              snapshot.recentEvents.slice(0, 12).map((event) => {
                const metadata =
                  event.metadata && typeof event.metadata === 'object'
                    ? (event.metadata as Record<string, unknown>)
                    : null;
                return (
                  <Box
                    key={event.id}
                    sx={{
                      borderRadius: 2,
                      px: 1.5,
                      py: 1,
                      border: `1px solid ${alpha(theme.palette.text.primary, 0.14)}`,
                    }}
                  >
                    <Typography fontWeight={700}>
                      {event.xpAmount > 0
                        ? `+${event.xpAmount} XP`
                        : t.milestone}{' '}
                      —{' '}
                      {(() => {
                        const label = formatXPEvent(event.type, metadata);
                        if (label.startsWith('streakLabel:')) {
                          return t.dayStreakLabel.replace(
                            '{{count}}',
                            label.split(':')[1],
                          );
                        }
                        if (label.startsWith('advancedTo:')) {
                          return t.advancedToTitle.replace(
                            '{{title}}',
                            label.split(':')[1],
                          );
                        }
                        return (t as Record<string, string>)[label] ?? label;
                      })()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(event.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                );
              })
            )}
          </Stack>
        </Card>
      </Grid>
    </Container>
  );
};

export default SpiritualProgressSection;
