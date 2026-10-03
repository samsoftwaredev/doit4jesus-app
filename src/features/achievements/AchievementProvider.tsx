import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type AchievementEvent = "onboarding-complete";

type AchievementContextValue = {
  achievement: AchievementEvent | null;
  dismissAchievement: () => void;
  queueAchievement: (achievement: AchievementEvent) => void;
};

const AchievementContext = createContext<AchievementContextValue | null>(null);

/** Provides one-session achievement events that can be displayed after navigation. */
export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [achievement, setAchievement] = useState<AchievementEvent | null>(null);

  /** Queues the newest achievement for the global toast host in this app session. */
  const queueAchievement = useCallback((nextAchievement: AchievementEvent) => {
    setAchievement(nextAchievement);
  }, []);

  /** Clears the displayed achievement so it does not replay after dismissal or timeout. */
  const dismissAchievement = useCallback(() => {
    setAchievement(null);
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
