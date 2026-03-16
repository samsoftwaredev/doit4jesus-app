import { useCallback, useEffect, useState } from 'react';

import {
  type Milestone,
  getReachedMilestones,
  getReachedStreakMilestones,
} from '@/constants/milestones';

const STORAGE_KEY = 'acknowledged_milestones';

function getAcknowledgedIds(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addAcknowledgedId(id: string): void {
  const ids = getAcknowledgedIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
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
): UseMilestonesReturn {
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(
    null,
  );
  const [showMilestone, setShowMilestone] = useState(false);

  useEffect(() => {
    const acknowledged = getAcknowledgedIds();

    // Check rosary milestones first, then streak milestones
    const rosaryMilestones = getReachedMilestones(rosaryCount, acknowledged);
    if (rosaryMilestones.length > 0) {
      // Show the highest unacknowledged milestone
      setCurrentMilestone(rosaryMilestones[rosaryMilestones.length - 1]);
      setShowMilestone(true);
      return;
    }

    const streakMilestones = getReachedStreakMilestones(
      streakCount,
      acknowledged,
    );
    if (streakMilestones.length > 0) {
      setCurrentMilestone(streakMilestones[streakMilestones.length - 1]);
      setShowMilestone(true);
    }
  }, [rosaryCount, streakCount]);

  const dismissMilestone = useCallback(() => {
    if (currentMilestone) {
      addAcknowledgedId(currentMilestone.id);
    }
    setShowMilestone(false);
    setCurrentMilestone(null);
  }, [currentMilestone]);

  return { currentMilestone, showMilestone, dismissMilestone };
}
