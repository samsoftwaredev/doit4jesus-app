import { act, renderHook } from "@testing-library/react-native";

import { AchievementProvider, useAchievement } from "./AchievementProvider";

describe("AchievementProvider", () => {
  it("exposes a queued achievement reactively and clears it when dismissed", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AchievementProvider>{children}</AchievementProvider>
    );
    const { result } = await renderHook(() => useAchievement(), { wrapper });

    expect(result.current.achievement).toBeNull();

    await act(async () => {
      result.current.queueAchievement({ type: "onboarding-complete" });
    });
    expect(result.current.achievement).toEqual({ type: "onboarding-complete" });

    await act(async () => {
      result.current.dismissAchievement();
    });
    expect(result.current.achievement).toBeNull();
  });

  it("keeps badge awards in arrival order until each toast is dismissed", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AchievementProvider>{children}</AchievementProvider>
    );
    const { result } = await renderHook(() => useAchievement(), { wrapper });

    await act(async () => {
      result.current.queueAchievement({
        type: "badge-award",
        badge: {
          code: "FIRST_ROSARY",
          iconUrl: "https://example.com/first-rosary.png",
          id: "badge-1",
          name: "First Rosary",
        },
      });
      result.current.queueAchievement({
        type: "badge-award",
        badge: { code: "ROSARY_STREAK_7", iconUrl: null, id: "badge-2", name: "Seven Day Streak" },
      });
    });

    expect(result.current.achievement).toMatchObject({ type: "badge-award", badge: { id: "badge-1" } });

    await act(async () => {
      result.current.dismissAchievement();
    });
    expect(result.current.achievement).toMatchObject({ type: "badge-award", badge: { id: "badge-2" } });
  });
});
