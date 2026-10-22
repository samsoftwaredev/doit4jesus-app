import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type BadgeAchievement = {
  code: string;
  iconUrl: string | null;
  id: string;
  name: string;
};

export type AchievementEvent =
  | { type: "onboarding-complete" }
  | { type: "daily-scripture-complete" }
  | { type: "rosary-video-complete" }
  | { badge: BadgeAchievement; type: "badge-award" };

type AchievementContextValue = {
  achievement: AchievementEvent | null;
  achievementSequence: number | null;
  dismissAchievement: () => void;
  queueAchievement: (achievement: AchievementEvent) => void;
};

type QueuedAchievement = {
  event: AchievementEvent;
  sequence: number;
};

const AchievementContext = createContext<AchievementContextValue | null>(null);

/** Provides one-session achievement events that can be displayed after navigation. */
export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [achievements, setAchievements] = useState<QueuedAchievement[]>([]);
  const nextSequence = useRef(0);
  const queuedAchievement = achievements[0] ?? null;
  const achievement = queuedAchievement?.event ?? null;
  const achievementSequence = queuedAchievement?.sequence ?? null;

  /** Adds an achievement with a unique replay sequence to the session's visible toast queue. */
  const queueAchievement = useCallback((nextAchievement: AchievementEvent) => {
    nextSequence.current += 1;
    const queued = { event: nextAchievement, sequence: nextSequence.current };
    setAchievements((currentAchievements) => [...currentAchievements, queued]);
  }, []);

  /** Removes the displayed achievement so the next queued toast can appear. */
  const dismissAchievement = useCallback(() => {
    setAchievements((currentAchievements) => currentAchievements.slice(1));
  }, []);

  const value = useMemo(
    () => ({ achievement, achievementSequence, dismissAchievement, queueAchievement }),
    [achievement, achievementSequence, dismissAchievement, queueAchievement],
  );

  return <AchievementContext.Provider value={value}>{children}</AchievementContext.Provider>;
}

/** Returns the session-scoped achievement state and controls for producers and the global toast host. */
export function useAchievement() {
  const context = useContext(AchievementContext);
  if (!context) throw new Error("useAchievement must be used within an AchievementProvider.");
  return context;
}
