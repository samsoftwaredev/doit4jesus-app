export type BadgeCategory =
  | 'prayer'
  | 'rosary'
  | 'community'
  | 'scripture'
  | 'invitation';

export type BadgeRequirementType =
  | 'prayer_count'
  | 'prayer_streak'
  | 'rosary_count'
  | 'community_posts'
  | 'scripture_sessions'
  | 'friends_invited'
  | 'global_prayer_sessions';

export interface BadgeDefinition {
  id: string;
  badgeKey: string;
  name: string;
  description: string;
  category: BadgeCategory;
  iconName: string;
  requirementType: BadgeRequirementType;
  requirementValue: number;
  requirementLabel: string;
  verseReference: string;
  verseText: string;
  shareMessage: string;
  displayOrder: number;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeKey: string;
  earnedAt: string;
  sharedAt?: string | null;
}

export interface AchievementBadge extends BadgeDefinition {
  earnedAt?: string;
  isEarned: boolean;
  progressCurrent: number;
  progressPercent: number;
  remainingCount: number;
}

export interface AchievementSummary {
  totalBadgesEarned: number;
  currentPrayerStreak: number;
  nextMilestoneName: string;
  nextMilestoneCount: number;
  latestBadgeKey?: string | null;
}

export interface AchievementProgressItem {
  badgeKey: string;
  title: string;
  current: number;
  target: number;
  progressPercent: number;
  encouragement: string;
}

export interface AchievementDashboard {
  summary: AchievementSummary;
  featuredBadge: AchievementBadge | null;
  earnedBadges: AchievementBadge[];
  lockedBadges: AchievementBadge[];
  progress: AchievementProgressItem[];
  shareBaseUrl: string;
}

export interface AchievementRpcPayload {
  stats: {
    prayer_count: number;
    prayer_streak: number;
    rosary_count: number;
    community_posts: number;
    scripture_sessions: number;
    friends_invited: number;
    global_prayer_sessions: number;
  };
  summary: {
    total_badges_earned: number;
    current_prayer_streak: number;
    next_milestone_name: string;
    next_milestone_count: number;
    latest_badge_key?: string | null;
  };
  earned_badges: {
    id: string;
    badge_key: string;
    earned_at: string;
  }[];
  badge_definitions: {
    id: string;
    badge_key: string;
    name: string;
    description: string;
    category: BadgeCategory;
    icon_name: string;
    requirement_type: BadgeRequirementType;
    requirement_value: number;
    requirement_label: string;
    verse_reference: string;
    verse_text: string;
    share_message: string;
    display_order: number;
  }[];
  progress: {
    badge_key: string;
    title: string;
    current: number;
    target: number;
    progress_percent: number;
    encouragement: string;
  }[];
}
