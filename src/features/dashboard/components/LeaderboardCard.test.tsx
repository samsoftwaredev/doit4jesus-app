import { fireEvent, render, screen } from "@testing-library/react-native";

import { LeaderboardCard } from "./LeaderboardCard";

describe("LeaderboardCard", () => {
  const entries = [
    { avatarUrl: null, displayName: "St. Michael", rank: 1, rosaries: 245 },
    { avatarUrl: "https://example.test/warrior.png", displayName: "Samuel", rank: 1, rosaries: 245 },
    { avatarUrl: null, displayName: "Fiat Warrior", rank: 3, rosaries: 156 },
    { avatarUrl: null, displayName: "Ave Maria", rank: 7, rosaries: 129 },
  ];

  it("displays server-provided ranks and Rosary counts without deriving positions from index", async () => {
    await render(
      <LeaderboardCard entries={entries} error={false} isLoading={false} onRetry={jest.fn()} onViewFull={jest.fn()} />,
    );

    expect(screen.getByLabelText("Rank 1, St. Michael, 245 Rosaries")).toBeTruthy();
    expect(screen.getByLabelText("Rank 1, Samuel, 245 Rosaries")).toBeTruthy();
    expect(screen.getByLabelText("Rank 7, Ave Maria, 129 Rosaries")).toBeTruthy();
    expect(screen.getAllByText("1")).toHaveLength(2);
    expect(screen.getAllByText("245")).toHaveLength(2);
  });

  it("uses the project avatar fallback when avatar_url is null and opens the full leaderboard", async () => {
    const onViewFull = jest.fn();
    await render(
      <LeaderboardCard entries={entries} error={false} isLoading={false} onRetry={jest.fn()} onViewFull={onViewFull} />,
    );

    expect(screen.getByLabelText("St. Michael's avatar")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("View leaderboard"));
    expect(onViewFull).toHaveBeenCalledTimes(1);
  });

  it("shows a recoverable unavailable state when the endpoint fails", async () => {
    await render(<LeaderboardCard entries={null} error isLoading={false} onRetry={jest.fn()} onViewFull={jest.fn()} />);
    expect(screen.getByText("Leaderboard unavailable")).toBeTruthy();
  });
});
