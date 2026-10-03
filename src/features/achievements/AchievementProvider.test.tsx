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
      result.current.queueAchievement("onboarding-complete");
    });
    expect(result.current.achievement).toBe("onboarding-complete");

    await act(async () => {
      result.current.dismissAchievement();
    });
    expect(result.current.achievement).toBeNull();
  });
});
