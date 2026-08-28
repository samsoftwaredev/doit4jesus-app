import { render, screen } from "@testing-library/react-native";

import { EarnedBadgeRow } from "./EarnedBadgeRow";

describe("EarnedBadgeRow", () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.example.test";
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_API_URL;
  });

  it("uses a relative backend image URL and formats the earned date", async () => {
    await render(
      <EarnedBadgeRow
        badge={{
          code: "ROSARY_STREAK_7",
          description: "Prayed seven days in a row.",
          earnedAt: "2026-01-10T12:00:00.000Z",
          iconUrl: "/badges/streak.png",
          id: "earned-1",
          name: "Seven Day Streak",
        }}
        isLast
      />,
    );

    expect(screen.getByLabelText(/Badge earned: Seven Day Streak/)).toBeTruthy();
    expect(screen.getByText("Prayed seven days in a row.")).toBeTruthy();
  });

  it("falls back to a supported icon and date message when metadata is unavailable", async () => {
    delete process.env.EXPO_PUBLIC_API_URL;

    await render(
      <EarnedBadgeRow
        badge={{
          code: "UNKNOWN_BADGE",
          description: "A special achievement.",
          earnedAt: "not-a-date",
          iconUrl: "/badges/unknown.png",
          id: "earned-2",
          name: "Unknown Badge",
        }}
        isLast={false}
      />,
    );

    expect(screen.getByLabelText(/Earned Date unavailable/)).toBeTruthy();
  });

  it("accepts absolute badge image URLs", async () => {
    await render(
      <EarnedBadgeRow
        badge={{
          code: "ROSARY_MASTER",
          description: "Prayed many Rosaries.",
          earnedAt: "2026-02-05T12:00:00.000Z",
          iconUrl: "https://cdn.example.test/badges/master.png",
          id: "earned-3",
          name: "Rosary Master",
        }}
        isLast
      />,
    );

    expect(screen.getByLabelText(/Badge earned: Rosary Master/)).toBeTruthy();
  });
});
