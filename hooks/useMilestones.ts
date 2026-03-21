import { useCallback, useEffect, useState } from 'react';

import { db } from '@/classes/SupabaseDB';
import {
  type Milestone,
  getReachedMilestones,
  getReachedStreakMilestones,
} from '@/constants/milestones';

const MILESTONE = 'acknowledged_milestones';

function getAcknowledgedIds(): string[] {
  try {
    const stored = localStorage.getItem(MILESTONE);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addAcknowledgedId(id: string): void {
  const ids = getAcknowledgedIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(MILESTONE, JSON.stringify(ids));
  }
}

interface UseMilestonesReturn {
  currentMilestone: Milestone | null;
  showMilestone: boolean;
  dismissMilestone: () => void;
}

export function useMilestones(
  rosaryCount: number,
  streakCount: number,
  userId?: string,
): UseMilestonesReturn {
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(
    null,
  );
  const [showMilestone, setShowMilestone] = useState(false);
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const localAcknowledged = getAcknowledgedIds();

    if (!userId) {
      setAcknowledgedIds(localAcknowledged);
      setIsReady(true);
      return;
    }

    let isMounted = true;

    const loadAcknowledgedMilestones = async () => {
      const { data, error } = await db
        .getUserMilestones()
        .select('milestone_id')
        .eq('user_id', userId);

      if (!isMounted) return;

      if (error) {
        console.error('Failed to load acknowledged milestones:', error);
        setAcknowledgedIds(localAcknowledged);
        setIsReady(true);
        return;
      }

      const remoteAcknowledged = (data ?? []).map((item) => item.milestone_id);
      const mergedAcknowledged = Array.from(
        new Set([...remoteAcknowledged, ...localAcknowledged]),
      );

      setAcknowledgedIds(mergedAcknowledged);
      localStorage.setItem(MILESTONE, JSON.stringify(mergedAcknowledged));
      setIsReady(true);

      const localOnly = localAcknowledged.filter(
        (id) => !remoteAcknowledged.includes(id),
      );
      if (localOnly.length > 0) {
        const { error: syncError } = await db.getUserMilestones().upsert(
          localOnly.map((milestoneId) => ({
            user_id: userId,
            milestone_id: milestoneId,
          })),
          { onConflict: 'user_id,milestone_id' },
        );

        if (syncError) {
          console.error(
            'Failed to sync local milestones to database:',
            syncError,
          );
        }
      }
    };

    void loadAcknowledgedMilestones();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!isReady) return;

    const rosaryMilestones = getReachedMilestones(rosaryCount, acknowledgedIds);
    if (rosaryMilestones.length > 0) {
      setCurrentMilestone(rosaryMilestones[rosaryMilestones.length - 1]);
      setShowMilestone(true);
      return;
    }

    const streakMilestones = getReachedStreakMilestones(
      streakCount,
      acknowledgedIds,
    );
    if (streakMilestones.length > 0) {
      setCurrentMilestone(streakMilestones[streakMilestones.length - 1]);
      setShowMilestone(true);
      return;
    }

    setShowMilestone(false);
    setCurrentMilestone(null);
  }, [acknowledgedIds, isReady, rosaryCount, streakCount]);

  const dismissMilestone = useCallback(() => {
    if (currentMilestone) {
      addAcknowledgedId(currentMilestone.id);

      setAcknowledgedIds((previous) => {
        if (previous.includes(currentMilestone.id)) {
          return previous;
        }
        return [...previous, currentMilestone.id];
      });

      if (userId) {
        void db.getUserMilestones().upsert(
          {
            user_id: userId,
            milestone_id: currentMilestone.id,
          },
          { onConflict: 'user_id,milestone_id' },
        );
      }
    }
    setShowMilestone(false);
    setCurrentMilestone(null);
  }, [currentMilestone, userId]);

  return { currentMilestone, showMilestone, dismissMilestone };
}
