import { render, screen } from "@testing-library/react-native";

import { HolyProgressCard } from "./HolyProgressCard";

describe("HolyProgressCard", () => {
  it("renders Rosaries, Level, and locale-formatted Points from independent API models", async () => {
    await render(
      <HolyProgressCard
        isLoadingProgress={false}
        isLoadingStats={false}
        detailsError={false}
        isLoadingDetails={false}
        levelCatalog={[{ levelNumber: 4, minimumTotalXp: 6000, name: "Faithful" }]}
        progress={{
          currentLevel: { code: "devoted", levelNumber: 3, minimumTotalXp: 3000, name: "Devoted" },
          levelProgressPercentage: 44,
          lifetimePoints: 4320,
          nextLevel: { code: "faithful", levelNumber: 4, minimumTotalXp: 6000, name: "Faithful" },
          totalXp: 4320,
          weeklyPoints: 210,
          xpIntoCurrentLevel: 1320,
          xpRequiredForNextLevel: 3000,
          yearlyPoints: 4320,
        }}
        progressError={false}
        recentRosaryActivities={[
          {
            completedAt: "2026-08-29T15:25:00.000Z",
            id: "activity-1",
            occurredAt: "2026-08-29T15:00:00.000Z",
            quantity: 1,
          },
        ]}
        rosaryStats={{ rosariesPrayed: 86 }}
        statsError={false}
      />,
    );

    expect(screen.getByLabelText("Rosaries, 86")).toBeTruthy();
    expect(screen.getByLabelText("Level, 3")).toBeTruthy();
    expect(screen.getByLabelText("Points, 4320")).toBeTruthy();
    expect(screen.getAllByText("4,320")).toHaveLength(2);
    expect(screen.getByText("Devoted")).toBeTruthy();
    expect(screen.getByText("1,320 / 3,000 XP")).toBeTruthy();
    expect(screen.getByText("44% toward Faithful")).toBeTruthy();
    expect(screen.getByLabelText("Level progress: 1,320 of 3,000 XP. Next: Faithful.")).toBeTruthy();
    expect(screen.getByText("210")).toBeTruthy();
    expect(screen.getByText("1 Rosary · Aug 29")).toBeTruthy();
  });

  it("keeps available Rosaries visible when level and points are unavailable", async () => {
    await render(
      <HolyProgressCard
        isLoadingProgress={false}
        isLoadingStats={false}
        detailsError={false}
        isLoadingDetails={false}
        levelCatalog={[]}
        progress={null}
        progressError
        recentRosaryActivities={[]}
        rosaryStats={{ rosariesPrayed: 86 }}
        statsError={false}
      />,
    );

    expect(screen.getByLabelText("Rosaries, 86")).toBeTruthy();
    expect(screen.getByLabelText("Level, unavailable")).toBeTruthy();
    expect(screen.getByLabelText("Points, unavailable")).toBeTruthy();
  });
});
