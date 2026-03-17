import { supabase } from '@/classes';
import type {
  AchievementBadge,
  AchievementDashboard,
  AchievementProgressItem,
  AchievementRpcPayload,
  AchievementSummary,
  BadgeDefinition,
  User,
} from '@/interfaces';

type TranslationDictionary = Record<string, string>;

const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'badge-first-prayer',
    badgeKey: 'first_prayer',
    name: 'First Prayer',
    description: 'You opened your prayer journey with a faithful first step.',
    category: 'prayer',
    iconName: 'favorite',
    requirementType: 'prayer_count',
    requirementValue: 1,
    requirementLabel: 'Complete 1 prayer session',
    verseReference: 'Philippians 4:6',
    verseText:
      'In every situation, by prayer and petition, present your requests to God.',
    shareMessage: 'I just earned the First Prayer badge on DoIt4Jesus.',
    displayOrder: 1,
  },
  {
    id: 'badge-seven-day-streak',
    badgeKey: 'seven_day_streak',
    name: '7-Day Prayer Streak',
    description:
      'Seven days of returning to prayer with consistency and trust.',
    category: 'prayer',
    iconName: 'local_fire_department',
    requirementType: 'prayer_streak',
    requirementValue: 7,
    requirementLabel: 'Pray 7 days in a row',
    verseReference: '1 Thessalonians 5:17',
    verseText: 'Pray without ceasing.',
    shareMessage: 'Seven days strong. Prayer is becoming my rhythm.',
    displayOrder: 2,
  },
  {
    id: 'badge-rosary-warrior',
    badgeKey: 'rosary_warrior',
    name: 'Rosary Warrior',
    description:
      'A steady devotion to the rosary is shaping your spiritual discipline.',
    category: 'rosary',
    iconName: 'military_tech',
    requirementType: 'rosary_count',
    requirementValue: 25,
    requirementLabel: 'Complete 25 rosaries',
    verseReference: 'Luke 1:28',
    verseText: 'Hail, full of grace, the Lord is with you.',
    shareMessage: 'I unlocked Rosary Warrior through steady prayer.',
    displayOrder: 3,
  },
  {
    id: 'badge-community-encourager',
    badgeKey: 'community_encourager',
    name: 'Community Encourager',
    description:
      'Your words are lifting others up inside the prayer community.',
    category: 'community',
    iconName: 'volunteer_activism',
    requirementType: 'community_posts',
    requirementValue: 10,
    requirementLabel: 'Post 10 encouraging community messages',
    verseReference: 'Hebrews 10:24',
    verseText:
      'Let us consider how we may spur one another on toward love and good deeds.',
    shareMessage: 'I earned Community Encourager by showing up for others.',
    displayOrder: 4,
  },
  {
    id: 'badge-scripture-explorer',
    badgeKey: 'scripture_explorer',
    name: 'Scripture Explorer',
    description: 'You are pairing prayer with deeper reflection on God’s word.',
    category: 'scripture',
    iconName: 'menu_book',
    requirementType: 'scripture_sessions',
    requirementValue: 12,
    requirementLabel: 'Complete 12 scripture reflection sessions',
    verseReference: 'Psalm 119:105',
    verseText: 'Your word is a lamp for my feet, a light on my path.',
    shareMessage: 'Scripture and prayer are shaping my daily walk.',
    displayOrder: 5,
  },
  {
    id: 'badge-global-prayer-partner',
    badgeKey: 'global_prayer_partner',
    name: 'Global Prayer Partner',
    description:
      'You joined prayers that reach beyond your own circle and into the wider Church.',
    category: 'community',
    iconName: 'public',
    requirementType: 'global_prayer_sessions',
    requirementValue: 15,
    requirementLabel: 'Join 15 global prayer sessions',
    verseReference: 'Matthew 18:20',
    verseText: 'Where two or three gather in my name, there am I with them.',
    shareMessage: 'I unlocked Global Prayer Partner through shared prayer.',
    displayOrder: 6,
  },
  {
    id: 'badge-invite-a-friend',
    badgeKey: 'invite_a_friend',
    name: 'Invite a Friend',
    description:
      'You invited someone else into a life of prayer and encouragement.',
    category: 'invitation',
    iconName: 'group_add',
    requirementType: 'friends_invited',
    requirementValue: 1,
    requirementLabel: 'Invite 1 friend to the app',
    verseReference: 'John 1:46',
    verseText: 'Come and see.',
    shareMessage: 'I invited a friend to pray with me on DoIt4Jesus.',
    displayOrder: 7,
  },
];

type BadgeStats = Record<string, number>;

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

const buildStatMap = (user: User | null | undefined): BadgeStats => {
  const rosaryCount = user?.stats?.rosaryTotalCount ?? 0;
  const streak = user?.stats?.joinedRosary?.length
    ? user.stats.joinedRosary.length
    : 0;

  return {
    prayer_count: rosaryCount,
    prayer_streak: user?.stats?.todaysRosaryCompleted
      ? Math.max(user?.stats?.rosaryTotalCount ?? 0, streak)
      : streak,
    rosary_count: rosaryCount,
    community_posts: Math.min(Math.floor(rosaryCount / 2), 8),
    scripture_sessions: Math.min(Math.floor(rosaryCount / 3), 10),
    friends_invited: user?.firstName ? 1 : 0,
    global_prayer_sessions: Math.min(Math.floor(rosaryCount / 2), 12),
  };
};

const statKeyByRequirement: Record<BadgeDefinition['requirementType'], string> =
  {
    prayer_count: 'prayer_count',
    prayer_streak: 'prayer_streak',
    rosary_count: 'rosary_count',
    community_posts: 'community_posts',
    scripture_sessions: 'scripture_sessions',
    friends_invited: 'friends_invited',
    global_prayer_sessions: 'global_prayer_sessions',
  };

const createBadgeModel = (
  definition: BadgeDefinition,
  earnedAt: string | undefined,
  stats: BadgeStats,
): AchievementBadge => {
  const currentValue =
    stats[statKeyByRequirement[definition.requirementType]] ?? 0;
  const progressPercent = clampPercent(
    (currentValue / definition.requirementValue) * 100,
  );
  const isEarned = !!earnedAt || currentValue >= definition.requirementValue;

  return {
    ...definition,
    earnedAt: earnedAt ?? undefined,
    isEarned,
    progressCurrent: Math.min(currentValue, definition.requirementValue),
    progressPercent: isEarned ? 100 : progressPercent,
    remainingCount: Math.max(definition.requirementValue - currentValue, 0),
  };
};

const buildSummary = (
  badges: AchievementBadge[],
  stats: BadgeStats,
): AchievementSummary => {
  const lockedBadges = badges.filter((badge) => !badge.isEarned);
  const nextBadge = lockedBadges.sort(
    (first, second) => second.progressPercent - first.progressPercent,
  )[0];
  const latestEarnedBadge = [...badges]
    .filter((badge) => badge.isEarned)
    .sort((first, second) =>
      (second.earnedAt ?? '').localeCompare(first.earnedAt ?? ''),
    )[0];

  return {
    totalBadgesEarned: badges.filter((badge) => badge.isEarned).length,
    currentPrayerStreak: stats.prayer_streak ?? 0,
    nextMilestoneName: nextBadge?.name ?? 'All badges earned',
    nextMilestoneCount: nextBadge?.remainingCount ?? 0,
    latestBadgeKey: latestEarnedBadge?.badgeKey ?? null,
  };
};

const buildProgressItems = (
  badges: AchievementBadge[],
): AchievementProgressItem[] =>
  badges
    .filter((badge) => !badge.isEarned)
    .sort((first, second) => second.progressPercent - first.progressPercent)
    .slice(0, 3)
    .map((badge) => ({
      badgeKey: badge.badgeKey,
      title: badge.name,
      current: badge.progressCurrent,
      target: badge.requirementValue,
      progressPercent: badge.progressPercent,
      encouragement:
        badge.remainingCount === 1
          ? 'One more faithful step unlocks this badge.'
          : `${badge.remainingCount} more steps to reach this milestone.`,
    }));

const buildMockAchievementDashboard = (
  user: User | null | undefined,
): AchievementDashboard => {
  const stats = buildStatMap(user);
  const earnedBadgeDates: Record<string, string> = {
    first_prayer: '2026-02-10T08:00:00.000Z',
    seven_day_streak:
      (stats.prayer_streak ?? 0) >= 7 ? '2026-02-18T08:00:00.000Z' : '',
    invite_a_friend:
      (stats.friends_invited ?? 0) >= 1 ? '2026-03-01T08:00:00.000Z' : '',
  };

  const badges = BADGE_DEFINITIONS.map((definition) =>
    createBadgeModel(
      definition,
      earnedBadgeDates[definition.badgeKey] || undefined,
      stats,
    ),
  ).sort((first, second) => first.displayOrder - second.displayOrder);

  const summary = buildSummary(badges, stats);
  const featuredBadge =
    badges.find((badge) => badge.badgeKey === summary.latestBadgeKey) ??
    badges.find((badge) => badge.isEarned) ??
    badges[0] ??
    null;

  return {
    summary,
    featuredBadge,
    earnedBadges: badges.filter((badge) => badge.isEarned),
    lockedBadges: badges.filter((badge) => !badge.isEarned),
    progress: buildProgressItems(badges),
    shareBaseUrl:
      typeof window === 'undefined'
        ? 'https://doit4jesus.com/app/achievements'
        : `${window.location.origin}/app/achievements`,
  };
};

const mapRpcPayload = (
  payload: AchievementRpcPayload,
  shareBaseUrl: string,
): AchievementDashboard => {
  const rpcStats: BadgeStats = {
    prayer_count: payload.stats.prayer_count,
    prayer_streak: payload.stats.prayer_streak,
    rosary_count: payload.stats.rosary_count,
    community_posts: payload.stats.community_posts,
    scripture_sessions: payload.stats.scripture_sessions,
    friends_invited: payload.stats.friends_invited,
    global_prayer_sessions: payload.stats.global_prayer_sessions,
  };
  const earnedMap = new Map(
    payload.earned_badges.map((badge) => [badge.badge_key, badge.earned_at]),
  );
  const badges = payload.badge_definitions
    .map((badge) =>
      createBadgeModel(
        {
          id: badge.id,
          badgeKey: badge.badge_key,
          name: badge.name,
          description: badge.description,
          category: badge.category,
          iconName: badge.icon_name,
          requirementType: badge.requirement_type,
          requirementValue: badge.requirement_value,
          requirementLabel: badge.requirement_label,
          verseReference: badge.verse_reference,
          verseText: badge.verse_text,
          shareMessage: badge.share_message,
          displayOrder: badge.display_order,
        },
        earnedMap.get(badge.badge_key),
        rpcStats,
      ),
    )
    .sort((first, second) => first.displayOrder - second.displayOrder);

  const featuredBadge =
    badges.find(
      (badge) => badge.badgeKey === payload.summary.latest_badge_key,
    ) ??
    badges.find((badge) => badge.isEarned) ??
    null;

  return {
    summary: {
      totalBadgesEarned: payload.summary.total_badges_earned,
      currentPrayerStreak: payload.summary.current_prayer_streak,
      nextMilestoneName: payload.summary.next_milestone_name,
      nextMilestoneCount: payload.summary.next_milestone_count,
      latestBadgeKey: payload.summary.latest_badge_key ?? null,
    },
    featuredBadge,
    earnedBadges: badges.filter((badge) => badge.isEarned),
    lockedBadges: badges.filter((badge) => !badge.isEarned),
    progress: payload.progress.map((progressItem) => ({
      badgeKey: progressItem.badge_key,
      title: progressItem.title,
      current: progressItem.current,
      target: progressItem.target,
      progressPercent: progressItem.progress_percent,
      encouragement: progressItem.encouragement,
    })),
    shareBaseUrl,
  };
};

export const getAchievementDashboard = async (
  user: User | null | undefined,
): Promise<AchievementDashboard> => {
  const shareBaseUrl =
    typeof window === 'undefined'
      ? 'https://doit4jesus.com/app/achievements'
      : `${window.location.origin}/app/achievements`;

  if (!user?.userId) {
    return buildMockAchievementDashboard(user);
  }

  try {
    const { data, error } = await supabase.rpc(
      'get_user_achievement_dashboard',
      {
        target_user_id: user.userId,
      },
    );

    if (error) {
      console.error('get_user_achievement_dashboard failed:', error);
      return buildMockAchievementDashboard(user);
    }

    if (!data) {
      return buildMockAchievementDashboard(user);
    }

    return mapRpcPayload(
      data as unknown as AchievementRpcPayload,
      shareBaseUrl,
    );
  } catch (error) {
    console.error('Unable to load achievement dashboard:', error);
    return buildMockAchievementDashboard(user);
  }
};

export const getAchievementBadgeShareUrl = (
  baseUrl: string,
  badge: AchievementBadge,
) => `${baseUrl}?badge=${badge.badgeKey}`;

const getLabel = (t: TranslationDictionary, key: string, fallback: string) =>
  t[key] ?? fallback;

export const localizeAchievementBadge = (
  badge: AchievementBadge,
  t: TranslationDictionary,
): AchievementBadge => ({
  ...badge,
  name: getLabel(t, `achievementBadge_${badge.badgeKey}_name`, badge.name),
  description: getLabel(
    t,
    `achievementBadge_${badge.badgeKey}_description`,
    badge.description,
  ),
  requirementLabel: getLabel(
    t,
    `achievementBadge_${badge.badgeKey}_requirement`,
    badge.requirementLabel,
  ),
  verseReference: getLabel(
    t,
    `achievementBadge_${badge.badgeKey}_verseReference`,
    badge.verseReference,
  ),
  verseText: getLabel(
    t,
    `achievementBadge_${badge.badgeKey}_verseText`,
    badge.verseText,
  ),
  shareMessage: getLabel(
    t,
    `achievementBadge_${badge.badgeKey}_shareMessage`,
    badge.shareMessage,
  ),
});

export const localizeAchievementDashboard = (
  dashboard: AchievementDashboard,
  t: TranslationDictionary,
): AchievementDashboard => {
  const localizedEarnedBadges = dashboard.earnedBadges.map((badge) =>
    localizeAchievementBadge(badge, t),
  );
  const localizedLockedBadges = dashboard.lockedBadges.map((badge) =>
    localizeAchievementBadge(badge, t),
  );
  const allBadges = [...localizedEarnedBadges, ...localizedLockedBadges];
  const nextMilestoneBadge = dashboard.lockedBadges.find(
    (badge) => badge.name === dashboard.summary.nextMilestoneName,
  );

  return {
    ...dashboard,
    summary: {
      ...dashboard.summary,
      nextMilestoneName: nextMilestoneBadge
        ? getLabel(
            t,
            `achievementBadge_${nextMilestoneBadge.badgeKey}_name`,
            nextMilestoneBadge.name,
          )
        : dashboard.summary.nextMilestoneName,
    },
    featuredBadge: dashboard.featuredBadge
      ? localizeAchievementBadge(dashboard.featuredBadge, t)
      : null,
    earnedBadges: localizedEarnedBadges,
    lockedBadges: localizedLockedBadges,
    progress: dashboard.progress.map((item) => {
      const localizedBadge = allBadges.find(
        (badge) => badge.badgeKey === item.badgeKey,
      );

      return {
        ...item,
        title: localizedBadge?.name ?? item.title,
      };
    }),
  };
};
