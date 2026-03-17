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

import { Card } from '@/components';
import AchievementShareModal from '@/components/AchievementShareModal';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import { AchievementBadge, AchievementDashboard } from '@/interfaces';
import {
  getAchievementBadgeShareUrl,
  getAchievementDashboard,
  localizeAchievementDashboard,
} from '@/services/achievements';

const AchievementsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '10px',
});

const SummaryGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  gridTemplateColumns: '1fr',
  '@media (min-width: 640px)': {
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
  borderRadius: 10,
  backgroundColor: alpha(theme.palette.primary.main, 0.04),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
}));

const BadgeItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 10,
  border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
  backgroundColor: alpha(theme.palette.background.default, 0.5),
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
  const { t } = useLanguageContext();

  return (
    <BadgeItem
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
          label={badge.isEarned ? t.achievementEarned : t.achievementLocked}
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
            label={`${badge.remainingCount} ${t.achievementToGo}`}
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
            ? `${t.achievementEarnedOn} ${new Date(
                badge.earnedAt,
              ).toLocaleDateString()}`
            : `${Math.round(badge.progressPercent)}% ${t.complete.toLowerCase()}`}
        </Typography>
      </Stack>
    </BadgeItem>
  );
};

const AchievementsSection = () => {
  const { user } = useUserContext();
  const { t } = useLanguageContext();
  const theme = useTheme();
  const searchParams = useSearchParams();
  const [dashboard, setDashboard] = useState<AchievementDashboard | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const localizedDashboard = useMemo(
    () => (dashboard ? localizeAchievementDashboard(dashboard, t) : null),
    [dashboard, t],
  );

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
    if (!localizedDashboard) return;
    const badgeKey = searchParams.get('badge');
    if (!badgeKey) return;

    const matchedBadge =
      localizedDashboard.earnedBadges.find(
        (badge) => badge.badgeKey === badgeKey,
      ) ??
      localizedDashboard.lockedBadges.find(
        (badge) => badge.badgeKey === badgeKey,
      );

    if (matchedBadge) {
      setSelectedBadge(matchedBadge);
    }
  }, [localizedDashboard, searchParams]);

  useEffect(() => {
    if (!localizedDashboard || !selectedBadge) return;

    const localizedSelectedBadge =
      localizedDashboard.earnedBadges.find(
        (badge) => badge.badgeKey === selectedBadge.badgeKey,
      ) ??
      localizedDashboard.lockedBadges.find(
        (badge) => badge.badgeKey === selectedBadge.badgeKey,
      );

    if (localizedSelectedBadge) {
      setSelectedBadge(localizedSelectedBadge);
    }
  }, [localizedDashboard, selectedBadge]);

  const userName =
    user?.fullName?.trim() ||
    user?.firstName?.trim() ||
    t.achievementPrayerFriend;

  const sharePayload = useMemo(() => {
    if (!localizedDashboard || !selectedBadge) {
      return { shareUrl: '', shareText: '' };
    }

    const shareUrl = getAchievementBadgeShareUrl(
      localizedDashboard.shareBaseUrl,
      selectedBadge,
    );
    const shareText = `${selectedBadge.shareMessage} “${selectedBadge.verseText}”`;

    return { shareUrl, shareText };
  }, [localizedDashboard, selectedBadge]);

  const copyShareLink = async (badge: AchievementBadge) => {
    if (!localizedDashboard) return;

    const shareUrl = getAchievementBadgeShareUrl(
      localizedDashboard.shareBaseUrl,
      badge,
    );
    const shareText = `${badge.shareMessage} ${shareUrl}`;

    try {
      await navigator.clipboard.writeText(shareText);
      toast.success(t.achievementLinkCopied);
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      toast.error(t.achievementCopyError);
    }
  };

  const shareBadge = async (badge: AchievementBadge) => {
    if (!localizedDashboard) return;

    const shareUrl = getAchievementBadgeShareUrl(
      localizedDashboard.shareBaseUrl,
      badge,
    );
    const shareText = `${badge.shareMessage} ${shareUrl}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${badge.name} ${t.achievementShareTitleSuffix}`,
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
    toast.info(t.achievementNativeShareFallback);
  };

  if (isLoading || !localizedDashboard) {
    return (
      <Container className="container-box" maxWidth="md">
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={220} />
          <Skeleton variant="rounded" height={320} />
          <Skeleton variant="rounded" height={320} />
        </Stack>
      </Container>
    );
  }

  const { summary, featuredBadge, earnedBadges, lockedBadges, progress } =
    localizedDashboard;

  return (
    <Container className="container-box" maxWidth="md">
      <AchievementsGrid>
        <Card>
          <Stack spacing={2}>
            <Box>
              <Chip
                icon={<EmojiEventsIcon />}
                label={t.achievementHeroEyebrow}
                sx={{ mb: 1.5 }}
              />
              <Typography variant="h4" fontWeight={700} mb={1}>
                {t.achievementHeroTitle}
              </Typography>
              <Typography color="text.secondary">
                {t.achievementHeroDescription}
              </Typography>
            </Box>

            <SummaryGrid>
              <SummaryStatCard>
                <Typography color="text.secondary" variant="body2">
                  {t.achievementTotalBadges}
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {summary.totalBadgesEarned}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {t.achievementTotalBadgesDescription}
                </Typography>
              </SummaryStatCard>

              <SummaryStatCard>
                <Typography color="text.secondary" variant="body2">
                  {t.achievementCurrentStreak}
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {summary.currentPrayerStreak} {t.achievementDays}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {t.achievementCurrentStreakDescription}
                </Typography>
              </SummaryStatCard>

              <SummaryStatCard>
                <Typography color="text.secondary" variant="body2">
                  {t.achievementNextMilestone}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {summary.nextMilestoneName}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {summary.nextMilestoneCount === 0
                    ? t.achievementAllBadgesComplete
                    : `${summary.nextMilestoneCount} ${t.achievementMoreStepsToUnlock}`}
                </Typography>
              </SummaryStatCard>
            </SummaryGrid>
          </Stack>
        </Card>

        {featuredBadge && (
          <Card>
            <Box>
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
                        {t.achievementLatestAchievement}
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
                    {t.achievementFeaturedBadge}
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
                      {t.achievementShareThisBadge}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<TrendingUpIcon />}
                      onClick={() => {
                        const nextBadge = lockedBadges[0];
                        if (nextBadge) setSelectedBadge(nextBadge);
                      }}
                    >
                      {t.achievementViewNextBadge}
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Card>
        )}

        <Card>
          <Box>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
              spacing={1}
              mb={2}
            >
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  {t.achievementEarnedBadges}
                </Typography>
                <Typography color="text.secondary">
                  {t.achievementEarnedBadgesDescription}
                </Typography>
              </Box>
              <Chip
                icon={<EmojiEventsIcon />}
                label={`${earnedBadges.length} ${t.achievementEarned.toLowerCase()}`}
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
              <Alert severity="info">{t.achievementFirstBadgeWaiting}</Alert>
            )}
          </Box>
        </Card>

        <Card>
          <Box>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
              spacing={1}
              mb={2}
            >
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  {t.achievementLockedBadges}
                </Typography>
                <Typography color="text.secondary">
                  {t.achievementLockedBadgesDescription}
                </Typography>
              </Box>
              <Chip
                icon={<LockIcon />}
                label={`${lockedBadges.length} ${t.achievementLocked.toLowerCase()}`}
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
          </Box>
        </Card>

        <Card>
          <Box>
            <Typography variant="h5" fontWeight={800} mb={0.5}>
              {t.achievementProgressTitle}
            </Typography>
            <Typography color="text.secondary" mb={2.5}>
              {t.achievementProgressDescription}
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
                    {item.target - item.current <= 1
                      ? t.achievementOneStepAway
                      : `${item.target - item.current} ${t.achievementMoreStepsMilestone}`}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Card>
      </AchievementsGrid>

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
    </Container>
  );
};

export default AchievementsSection;
