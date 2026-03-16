export interface Milestone {
  id: string;
  threshold: number;
  label: string;
  message: string;
}

export const MILESTONES: Milestone[] = [
  {
    id: 'rosary_10',
    threshold: 10,
    label: '10 Rosaries',
    message: 'You prayed 10 Rosaries. The battle has begun!',
  },
  {
    id: 'rosary_30',
    threshold: 30,
    label: '30 Rosaries',
    message: 'You prayed 30 Rosaries. A true warrior of light!',
  },
  {
    id: 'rosary_50',
    threshold: 50,
    label: '50 Rosaries',
    message: '50 Rosaries strong. Heaven is cheering you on!',
  },
  {
    id: 'rosary_100',
    threshold: 100,
    label: '100 Rosaries',
    message: '100 Rosaries! You are a Rosary Champion!',
  },
  {
    id: 'rosary_200',
    threshold: 200,
    label: '200 Rosaries',
    message: '200 Rosaries! Your prayers move mountains!',
  },
  {
    id: 'rosary_500',
    threshold: 500,
    label: '500 Rosaries',
    message: '500 Rosaries! A legend in spiritual warfare!',
  },
  {
    id: 'rosary_1000',
    threshold: 1000,
    label: '1,000 Rosaries',
    message: '1,000 Rosaries! An army of one!',
  },
];

export const STREAK_MILESTONES: Milestone[] = [
  {
    id: 'streak_7',
    threshold: 7,
    label: '7-Day Streak',
    message: '7 days of faithful prayer!',
  },
  {
    id: 'streak_30',
    threshold: 30,
    label: '30-Day Streak',
    message: '30-day prayer streak! Unstoppable!',
  },
  {
    id: 'streak_100',
    threshold: 100,
    label: '100-Day Streak',
    message: '100-day streak! A fortress of prayer!',
  },
  {
    id: 'streak_365',
    threshold: 365,
    label: '365-Day Streak',
    message: 'One full year of daily prayer!',
  },
];

export const SHARE_MOTIVATING_MESSAGES = [
  'Join the battle.',
  'Battle evil, one bead at a time.',
  'Pray. Level up. Repeat.',
  'Warriors pray together.',
  'Heaven needs more warriors.',
];

export function getRandomMotivatingMessage(): string {
  return SHARE_MOTIVATING_MESSAGES[
    Math.floor(Math.random() * SHARE_MOTIVATING_MESSAGES.length)
  ];
}

export function getReachedMilestones(
  rosaryCount: number,
  acknowledgedIds: string[],
): Milestone[] {
  return MILESTONES.filter(
    (m) => rosaryCount >= m.threshold && !acknowledgedIds.includes(m.id),
  );
}

export function getReachedStreakMilestones(
  streakCount: number,
  acknowledgedIds: string[],
): Milestone[] {
  return STREAK_MILESTONES.filter(
    (m) => streakCount >= m.threshold && !acknowledgedIds.includes(m.id),
  );
}
