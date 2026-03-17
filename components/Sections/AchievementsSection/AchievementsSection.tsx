import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LockIcon from '@mui/icons-material/Lock';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import PublicIcon from '@mui/icons-material/Public';
import ShareIcon from '@mui/icons-material/Share';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import AchievementShareModal from '@/components/AchievementShareModal';
import { useUserContext } from '@/context/UserContext';
import { AchievementBadge, AchievementDashboard } from '@/interfaces';
import {
  getAchievementBadgeShareUrl,
  getAchievementDashboard,
} from '@/services/achievements';

const PageShell = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  paddingBottom: theme.spacing(8),
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at top right, rgba(255, 215, 0, 0.18), transparent 30%), radial-gradient(circle at bottom left, rgba(66, 165, 245, 0.18), transparent 25%)',
    pointerEvents: 'none',
  },
}));

const SectionCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2.5),
  borderRadius: 24,
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg, rgba(22, 55, 85, 0.98), rgba(8, 28, 43, 0.95))'
      : 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(243,246,250,0.95))',
  border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 20px 60px rgba(0, 0, 0, 0.22)'
      : '0 20px 60px rgba(9, 28, 44, 0.08)',
}));

const HeroCard = styled(SectionCard)(({ theme }) => ({
  padding: theme.spacing(3),
  background:
    'linear-gradient(135deg, rgba(8, 28, 43, 0.98), rgba(22, 55, 85, 0.96) 55%, rgba(184, 150, 11, 0.92))',
  color: '#ffffff',
}));

const SummaryGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1.5),
  gridTemplateColumns: '1fr',
  '@media (min-width: 768px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

const BadgeGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1.5),
  gridTemplateColumns: '1fr',
  '@media (min-width: 640px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (min-width: 1024px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

const SummaryStatCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 20,
  background: alpha('#ffffff', 0.1),
  border: '1px solid rgba(255,255,255,0.12)',
  backdropFilter: 'blur(10px)',
}));

const iconMap = {
  favorite: FavoriteIcon,
  local_fire_department: LocalFireDepartmentIcon,
  military_tech: MilitaryTechIcon,
  volunteer_activism: VolunteerActivismIcon,
  menu_book: MenuBookIcon,
  public: PublicIcon,
  group_add: GroupAddIcon,
};

const getBadgeIcon = (badge: AchievementBadge) => {
  const IconComponent =
    iconMap[badge.iconName as keyof typeof iconMap] ?? AutoAwesomeIcon;

  return (
    <Box
      sx={(theme) => ({
        width: 56,
        height: 56,
        display: 'grid',
        placeItems: 'center',
        borderRadius: '18px',
        color: badge.isEarned
          ? theme.palette.gold.main
          : theme.palette.text.secondary,
        background: badge.isEarned
          ? `linear-gradient(135deg, ${alpha(theme.palette.gold.main, 0.22)}, ${alpha(theme.palette.primary.main, 0.2)})`
          : alpha(theme.palette.text.primary, 0.06),
        border: `1px solid ${alpha(
          badge.isEarned ? theme.palette.gold.main : theme.palette.text.primary,
          0.18,
        )}`,
      })}
    >
      <IconComponent />
    </Box>
  );
};

const AchievementBadgeCard = ({
  badge,
  onSelect,
}: {
  badge: AchievementBadge;
  onSelect: (badge: AchievementBadge) => void;
}) => {
  const theme = useTheme();

  return (
    <SectionCard
      role="button"
      onClick={() => onSelect(badge)}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: alpha(theme.palette.gold.main, 0.35),
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
        {getBadgeIcon(badge)}
        <Box flex={1}>
          <Typography variant="h6" fontWeight={700}>
            {badge.name}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {badge.description}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <Chip
          label={badge.isEarned ? 'Earned' : 'Locked'}
          size="small"
          sx={{
            bgcolor: badge.isEarned
              ? alpha(theme.palette.success.main, 0.14)
              : alpha(theme.palette.warning.main, 0.14),
            color: badge.isEarned
              ? theme.palette.success.main
              : theme.palette.warning.main,
          }}
        />
        {!badge.isEarned && (
          <Chip
            icon={<LockIcon fontSize="small" />}
            label={`${badge.remainingCount} to go`}
            size="small"
            variant="outlined"
          />
        )}
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={1}>
        {badge.requirementLabel}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={badge.progressPercent}
        sx={{
          height: 10,
          borderRadius: 999,
          bgcolor: alpha(theme.palette.text.primary, 0.1),
          '& .MuiLinearProgress-bar': {
            borderRadius: 999,
            background: badge.isEarned
              ? `linear-gradient(90deg, ${theme.palette.gold.main}, ${theme.palette.primary.light})`
              : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.info.light})`,
          },
        }}
      />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={1.5}
      >
        <Typography variant="caption" color="text.secondary">
          {badge.progressCurrent}/{badge.requirementValue}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {badge.isEarned && badge.earnedAt
            ? `Earned ${new Date(badge.earnedAt).toLocaleDateString()}`
            : `${Math.round(badge.progressPercent)}% complete`}
        </Typography>
      </Stack>
    </SectionCard>
  );
};

const AchievementsSection = () => {
  const { user } = useUserContext();
  const theme = useTheme();
  const searchParams = useSearchParams();
  const [dashboard, setDashboard] = useState<AchievementDashboard | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAchievements = async () => {
      setIsLoading(true);
      const result = await getAchievementDashboard(user);
      if (isMounted) {
        setDashboard(result);
        setIsLoading(false);
      }
    };

    loadAchievements();

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!dashboard) return;
    const badgeKey = searchParams.get('badge');
    if (!badgeKey) return;

    const matchedBadge =
      dashboard.earnedBadges.find((badge) => badge.badgeKey === badgeKey) ??
      dashboard.lockedBadges.find((badge) => badge.badgeKey === badgeKey);

    if (matchedBadge) {
      setSelectedBadge(matchedBadge);
    }
  }, [dashboard, searchParams]);

  const userName =
    user?.fullName?.trim() || user?.firstName?.trim() || 'Prayer Friend';

  const sharePayload = useMemo(() => {
    if (!dashboard || !selectedBadge) {
      return { shareUrl: '', shareText: '' };
    }

    const shareUrl = getAchievementBadgeShareUrl(
      dashboard.shareBaseUrl,
      selectedBadge,
    );
    const shareText = `${selectedBadge.shareMessage} “${selectedBadge.verseText}”`;

    return { shareUrl, shareText };
  }, [dashboard, selectedBadge]);

  const copyShareLink = async (badge: AchievementBadge) => {
    if (!dashboard) return;

    const shareUrl = getAchievementBadgeShareUrl(dashboard.shareBaseUrl, badge);
    const shareText = `${badge.shareMessage} ${shareUrl}`;

    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Achievement link copied to clipboard.');
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      toast.error('Unable to copy the achievement link.');
    }
  };

  const shareBadge = async (badge: AchievementBadge) => {
    if (!dashboard) return;

    const shareUrl = getAchievementBadgeShareUrl(dashboard.shareBaseUrl, badge);
    const shareText = `${badge.shareMessage} ${shareUrl}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${badge.name} on DoIt4Jesus`,
          text: badge.shareMessage,
          url: shareUrl,
        });
        return;
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
      }
    }

    await copyShareLink(badge);
    toast.info('Native share is unavailable, so a shareable link was copied.');
  };

  if (isLoading || !dashboard) {
    return (
      <Container maxWidth="lg">
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={220} />
          <Skeleton variant="rounded" height={320} />
          <Skeleton variant="rounded" height={320} />
        </Stack>
      </Container>
    );
  }

  const { summary, featuredBadge, earnedBadges, lockedBadges, progress } =
    dashboard;

  return (
    <PageShell>
      <Container maxWidth="lg">
        <Stack spacing={2.5}>
          <HeroCard>
            <Stack spacing={2.5}>
              <Box>
                <Chip
                  icon={<EmojiEventsIcon />}
                  label="Prayer Journey Achievements"
                  sx={{
                    mb: 1.5,
                    bgcolor: alpha('#ffffff', 0.12),
                    color: '#ffffff',
                  }}
                />
                <Typography variant="h4" fontWeight={800} mb={1}>
                  Every prayer builds a faithful life.
                </Typography>
                <Typography
                  sx={{ color: alpha('#ffffff', 0.82), maxWidth: 720 }}
                >
                  Track the badges you have earned, see what is next, and share
                  moments that might encourage someone else to pray.
                </Typography>
              </Box>

              <SummaryGrid>
                <SummaryStatCard>
                  <Typography color={alpha('#ffffff', 0.72)} variant="body2">
                    Total badges
                  </Typography>
                  <Typography variant="h3" fontWeight={800}>
                    {summary.totalBadgesEarned}
                  </Typography>
                  <Typography color={alpha('#ffffff', 0.72)} variant="body2">
                    Earned through prayer, rosary, and community life
                  </Typography>
                </SummaryStatCard>

                <SummaryStatCard>
                  <Typography color={alpha('#ffffff', 0.72)} variant="body2">
                    Current streak
                  </Typography>
                  <Typography variant="h3" fontWeight={800}>
                    {summary.currentPrayerStreak} days
                  </Typography>
                  <Typography color={alpha('#ffffff', 0.72)} variant="body2">
                    Consistency creates spiritual momentum
                  </Typography>
                </SummaryStatCard>

                <SummaryStatCard>
                  <Typography color={alpha('#ffffff', 0.72)} variant="body2">
                    Next milestone
                  </Typography>
                  <Typography variant="h5" fontWeight={800}>
                    {summary.nextMilestoneName}
                  </Typography>
                  <Typography color={alpha('#ffffff', 0.72)} variant="body2">
                    {summary.nextMilestoneCount === 0
                      ? 'You have completed every current badge.'
                      : `${summary.nextMilestoneCount} more steps to unlock it`}
                  </Typography>
                </SummaryStatCard>
              </SummaryGrid>
            </Stack>
          </HeroCard>

          {featuredBadge && (
            <SectionCard>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2.5}
                alignItems={{ md: 'center' }}
              >
                <Box
                  sx={{
                    minWidth: { md: 320 },
                    p: 2.5,
                    borderRadius: 4,
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.gold.main,
                      0.18,
                    )}, ${alpha(theme.palette.primary.main, 0.18)})`,
                    border: `1px solid ${alpha(theme.palette.gold.main, 0.28)}`,
                  }}
                >
                  <Stack spacing={1.5}>
                    {getBadgeIcon(featuredBadge)}
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Latest achievement
                      </Typography>
                      <Typography variant="h4" fontWeight={800}>
                        {featuredBadge.name}
                      </Typography>
                    </Box>
                    <Typography color="text.secondary">
                      {featuredBadge.description}
                    </Typography>
                  </Stack>
                </Box>

                <Box flex={1}>
                  <Typography variant="h6" fontWeight={700} mb={1}>
                    Featured badge
                  </Typography>
                  <Typography color="text.secondary" mb={2}>
                    {featuredBadge.verseText}
                    {'\n'}
                    <Box
                      component="span"
                      sx={{ color: theme.palette.gold.main }}
                    >
                      {featuredBadge.verseReference}
                    </Box>
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button
                      variant="contained"
                      startIcon={<ShareIcon />}
                      onClick={() => setSelectedBadge(featuredBadge)}
                    >
                      Share this badge
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<TrendingUpIcon />}
                      onClick={() => {
                        const nextBadge = lockedBadges[0];
                        if (nextBadge) setSelectedBadge(nextBadge);
                      }}
                    >
                      View next badge
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </SectionCard>
          )}

          <SectionCard>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
              spacing={1}
              mb={2}
            >
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  Earned badges
                </Typography>
                <Typography color="text.secondary">
                  Tap any badge to open its share card and details.
                </Typography>
              </Box>
              <Chip
                icon={<EmojiEventsIcon />}
                label={`${earnedBadges.length} earned`}
              />
            </Stack>

            {earnedBadges.length > 0 ? (
              <BadgeGrid>
                {earnedBadges.map((badge) => (
                  <AchievementBadgeCard
                    badge={badge}
                    key={badge.badgeKey}
                    onSelect={setSelectedBadge}
                  />
                ))}
              </BadgeGrid>
            ) : (
              <Alert severity="info">
                Your first badge is waiting. Complete a prayer session to begin
                your journey.
              </Alert>
            )}
          </SectionCard>

          <SectionCard>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
              spacing={1}
              mb={2}
            >
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  Locked badges
                </Typography>
                <Typography color="text.secondary">
                  Preview upcoming achievements and what they require.
                </Typography>
              </Box>
              <Chip
                icon={<LockIcon />}
                label={`${lockedBadges.length} locked`}
              />
            </Stack>

            <BadgeGrid>
              {lockedBadges.map((badge) => (
                <AchievementBadgeCard
                  badge={badge}
                  key={badge.badgeKey}
                  onSelect={setSelectedBadge}
                />
              ))}
            </BadgeGrid>
          </SectionCard>

          <SectionCard>
            <Typography variant="h5" fontWeight={800} mb={0.5}>
              Progress toward your next badges
            </Typography>
            <Typography color="text.secondary" mb={2.5}>
              Clear progress markers keep the journey motivating without noise.
            </Typography>

            <Stack spacing={1.5}>
              {progress.map((item) => (
                <Box
                  key={item.badgeKey}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    spacing={1}
                    mb={1}
                  >
                    <Typography fontWeight={700}>{item.title}</Typography>
                    <Typography color="text.secondary">
                      {item.current}/{item.target}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={item.progressPercent}
                    sx={{
                      height: 10,
                      borderRadius: 999,
                      mb: 1,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 999,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.gold.main})`,
                      },
                    }}
                  />
                  <Typography color="text.secondary" variant="body2">
                    {item.encouragement}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </SectionCard>
        </Stack>
      </Container>

      <AchievementShareModal
        badge={selectedBadge}
        open={!!selectedBadge}
        shareUrl={sharePayload.shareUrl}
        shareText={sharePayload.shareText}
        userName={userName}
        onClose={() => setSelectedBadge(null)}
        onShare={shareBadge}
        onCopy={copyShareLink}
      />
    </PageShell>
  );
};

export default AchievementsSection;
