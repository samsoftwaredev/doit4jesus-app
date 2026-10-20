import { createContext, useCallback, useContext, useMemo, useState } from "react";

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
  dismissAchievement: () => void;
  queueAchievement: (achievement: AchievementEvent) => void;
};

const AchievementContext = createContext<AchievementContextValue | null>(null);

/** Provides one-session achievement events that can be displayed after navigation. */
export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [achievements, setAchievements] = useState<AchievementEvent[]>([]);
  const achievement = achievements[0] ?? null;

  /** Adds an achievement to the end of the current session's visible toast queue. */
  const queueAchievement = useCallback((nextAchievement: AchievementEvent) => {
    setAchievements((currentAchievements) => [...currentAchievements, nextAchievement]);
  }, []);

  /** Removes the displayed achievement so the next queued toast can appear. */
  const dismissAchievement = useCallback(() => {
    setAchievements((currentAchievements) => currentAchievements.slice(1));
  }, []);

  const value = useMemo(
    () => ({ achievement, dismissAchievement, queueAchievement }),
    [achievement, dismissAchievement, queueAchievement],
  );

  return <AchievementContext.Provider value={value}>{children}</AchievementContext.Provider>;
}

/** Returns the session-scoped achievement state and controls for producers and the global toast host. */
export function useAchievement() {
  const context = useContext(AchievementContext);
  if (!context) throw new Error("useAchievement must be used within an AchievementProvider.");
  return context;
}
