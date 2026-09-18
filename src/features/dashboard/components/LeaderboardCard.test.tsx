import { fireEvent, render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { LeaderboardCard } from "./LeaderboardCard";

describe("LeaderboardCard", () => {
  const entries = [
    { avatarUrl: null, displayName: "St. Michael", rank: 1, rosaries: 245 },
    { avatarUrl: "https://example.test/warrior.png", displayName: "Samuel", rank: 1, rosaries: 245 },
    { avatarUrl: null, displayName: "Fiat Warrior", rank: 3, rosaries: 156 },
    { avatarUrl: null, displayName: "Ave Maria", rank: 7, rosaries: 129 },
  ];

  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("displays server-provided ranks and Rosary counts without deriving positions from index", async () => {
    await render(<LeaderboardCard entries={entries} error={false} isLoading={false} onRetry={jest.fn()} />);

    expect(screen.getByText("Top Rosary prayer warriors globally this week.")).toBeTruthy();
    expect(screen.getByLabelText("Rank 1, St. Michael, 245 Rosaries")).toBeTruthy();
    expect(screen.getByLabelText("Rank 1, Samuel, 245 Rosaries")).toBeTruthy();
    expect(screen.getByLabelText("Rank 7, Ave Maria, 129 Rosaries")).toBeTruthy();
    expect(screen.getAllByText("1")).toHaveLength(2);
    expect(screen.getAllByText("245")).toHaveLength(2);
  });

  it("uses the project avatar fallback without linking to the friends leaderboard", async () => {
    await render(<LeaderboardCard entries={entries} error={false} isLoading={false} onRetry={jest.fn()} />);

    expect(screen.getByLabelText("St. Michael's avatar")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "View leaderboard" })).toBeNull();
  });

  it("shows a recoverable unavailable state when the endpoint fails", async () => {
    const onRetry = jest.fn();
    await render(<LeaderboardCard entries={null} error isLoading={false} onRetry={onRetry} />);
    expect(screen.getByText("Leaderboard unavailable")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Retry leaderboard" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("localizes the global description in Spanish", async () => {
    await i18n.changeLanguage("es");
    await render(<LeaderboardCard entries={entries} error={false} isLoading={false} onRetry={jest.fn()} />);

    expect(
      screen.getByText("Los principales guerreros de oración del Rosario a nivel mundial esta semana."),
    ).toBeTruthy();
  });
});
