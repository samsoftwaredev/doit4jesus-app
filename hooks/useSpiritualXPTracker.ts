import { useEffect } from 'react';

import { useUserContext } from '@/context/UserContext';
import { awardXP } from '@/services/spiritualXp';

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const toDateKey = (date: Date): string => date.toISOString().slice(0, 10);

const getCurrentStreakLength = (
  joinedRosary: { date: string }[] | undefined,
): number => {
  if (!joinedRosary || joinedRosary.length === 0) return 0;

  const uniqueDayKeys = Array.from(
    new Set(joinedRosary.map((item) => toDateKey(new Date(item.date)))),
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (uniqueDayKeys.length === 0) return 0;

  let streak = 1;
  let previous = new Date(uniqueDayKeys[0]);

  for (let i = 1; i < uniqueDayKeys.length; i += 1) {
    const current = new Date(uniqueDayKeys[i]);
    const dayDelta = Math.round(
      (previous.getTime() - current.getTime()) / MS_IN_DAY,
    );
    if (dayDelta === 1) {
      streak += 1;
      previous = current;
    } else {
      break;
    }
  }

  return streak;
};

const useSpiritualXPTracker = () => {
  const { user } = useUserContext();

  useEffect(() => {
    const userId = user?.userId;
    if (!userId) return;

    const rosaryCount = user?.stats?.rosaryTotalCount ?? 0;
    const todaysRosaryCompleted = user?.stats?.todaysRosaryCompleted ?? false;
    const currentStreak = getCurrentStreakLength(user?.stats?.joinedRosary);
    const todayKey = toDateKey(new Date());

    const run = async () => {
      if (rosaryCount > 0) {
        await awardXP(
          userId,
          'rosary_completed',
          { rosary_count: rosaryCount },
          { idempotencyKey: `rosary_completed:${rosaryCount}` },
        );
      }

      if (todaysRosaryCompleted) {
        await awardXP(
          userId,
          'daily_activity',
          { activity_date: todayKey },
          { idempotencyKey: `daily_activity:${todayKey}` },
        );
      }

      if ([3, 7, 30].includes(currentStreak)) {
        await awardXP(
          userId,
          'streak',
          { streak_length: currentStreak, activity_date: todayKey },
          { idempotencyKey: `streak:${currentStreak}:${todayKey}` },
        );
      }
    };

    void run();
  }, [
    user?.userId,
    user?.stats?.rosaryTotalCount,
    user?.stats?.todaysRosaryCompleted,
    user?.stats?.joinedRosary,
  ]);
};

export default useSpiritualXPTracker;
