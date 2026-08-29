import { render, screen } from "@testing-library/react-native";

import { HolyProgressCard } from "./HolyProgressCard";

describe("HolyProgressCard", () => {
  it("renders Rosaries, Level, and locale-formatted Points from independent API models", async () => {
    await render(
      <HolyProgressCard
        isLoadingProgress={false}
        isLoadingStats={false}
        progress={{ currentLevel: { levelNumber: 3, name: "Disciple" }, lifetimePoints: 4320 }}
        progressError={false}
        rosaryStats={{ rosariesPrayed: 86 }}
        statsError={false}
      />,
    );

    expect(screen.getByLabelText("Rosaries, 86")).toBeTruthy();
    expect(screen.getByLabelText("Level, 3")).toBeTruthy();
    expect(screen.getByLabelText("Points, 4320")).toBeTruthy();
    expect(screen.getByText("4,320")).toBeTruthy();
    expect(screen.getByText("Disciple")).toBeTruthy();
  });

  it("keeps available Rosaries visible when level and points are unavailable", async () => {
    await render(
      <HolyProgressCard
        isLoadingProgress={false}
        isLoadingStats={false}
        progress={null}
        progressError
        rosaryStats={{ rosariesPrayed: 86 }}
        statsError={false}
      />,
    );

    expect(screen.getByLabelText("Rosaries, 86")).toBeTruthy();
    expect(screen.getByLabelText("Level, unavailable")).toBeTruthy();
    expect(screen.getByLabelText("Points, unavailable")).toBeTruthy();
  });
});
