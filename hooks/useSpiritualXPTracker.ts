import { useEffect } from 'react';

import { useUserContext } from '@/context/UserContext';
import { awardXP, grantLevelUpBadge } from '@/services/spiritualXp';

const toDateKey = (date: Date): string => date.toISOString().slice(0, 10);

const useSpiritualXPTracker = () => {
  const { user } = useUserContext();

  useEffect(() => {
    const userId = user?.userId;
    if (!userId) return;

    const rosaryCount = user?.stats?.rosaryTotalCount ?? 0;
    const todaysRosaryCompleted = user?.stats?.todaysRosaryCompleted ?? false;
    const currentStreak = user?.stats?.currentStreak ?? 0;
    const todayKey = toDateKey(new Date());

    const run = async () => {
      if (rosaryCount > 0) {
        const result = await awardXP(
          userId,
          'rosary_completed',
          { rosary_count: rosaryCount },
          { idempotencyKey: `rosary_completed:${rosaryCount}` },
        );
        if (result) await grantLevelUpBadge(userId, result);
      }

      if (todaysRosaryCompleted) {
        const result = await awardXP(
          userId,
          'daily_activity',
          { activity_date: todayKey },
          { idempotencyKey: `daily_activity:${todayKey}` },
        );
        if (result) await grantLevelUpBadge(userId, result);
      }

      if ([3, 7, 30].includes(currentStreak)) {
        const result = await awardXP(
          userId,
          'streak',
          { streak_length: currentStreak, activity_date: todayKey },
          { idempotencyKey: `streak:${currentStreak}:${todayKey}` },
        );
        if (result) await grantLevelUpBadge(userId, result);
      }
    };

    void run();
  }, [
    user?.userId,
    user?.stats?.rosaryTotalCount,
    user?.stats?.todaysRosaryCompleted,
    user?.stats?.currentStreak,
  ]);
};

export default useSpiritualXPTracker;
