import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { saintAvatars } from "@/features/profile/saints";
import { i18n } from "@/localization";

import type { GlobalRosaryLeaderboard, LeaderboardEntryViewModel } from "../dashboard.types";
import { LeaderboardCard } from "./LeaderboardCard";

const weeklyEntries: LeaderboardEntryViewModel[] = [
  {
    avatarUrl: "https://example.test/first.png",
    countryCode: "US",
    displayName: "First Warrior",
    isCurrentUser: false,
    rank: 1,
    rosaries: 245,
    saintAvatarId: "a1000000-0000-4000-8000-000000000005",
    userId: "first-warrior",
  },
  {
    avatarUrl: "https://example.test/second.png",
    countryCode: "MX",
    displayName: "Second Warrior",
    isCurrentUser: false,
    rank: 2,
    rosaries: 190,
    saintAvatarId: null,
    userId: "second-warrior",
  },
  {
    avatarUrl: null,
    countryCode: null,
    displayName: "Third Warrior",
    isCurrentUser: false,
    rank: 3,
    rosaries: 156,
    saintAvatarId: null,
    userId: "third-warrior",
  },
];

const lifetimeEntries: LeaderboardEntryViewModel[] = [
  {
    avatarUrl: null,
    countryCode: "US",
    displayName: "Lifetime Leader",
    isCurrentUser: false,
    rank: 1,
    rosaries: 1245,
    saintAvatarId: null,
    userId: "lifetime-leader",
  },
  {
    avatarUrl: null,
    countryCode: "MX",
    displayName: "Lifetime Runner-up",
    isCurrentUser: false,
    rank: 2,
    rosaries: 1100,
    saintAvatarId: null,
    userId: "lifetime-runner-up",
  },
  {
    avatarUrl: null,
    countryCode: null,
    displayName: "Lifetime Tenth",
    isCurrentUser: false,
    rank: 10,
    rosaries: 529,
    saintAvatarId: null,
    userId: "lifetime-tenth",
  },
];

function leaderboard(
  periodType: "weekly" | "lifetime",
  entries: LeaderboardEntryViewModel[],
  currentUserEntry: LeaderboardEntryViewModel | null = null,
): GlobalRosaryLeaderboard {
  return {
    currentUserEntry,
    entries,
    meta: { limit: periodType === "weekly" ? 3 : 10, offset: 0, total: entries.length },
    period: {
      code: periodType === "weekly" ? "week-2026-W42" : "lifetime",
      createdAt: "2026-10-19T15:00:00Z",
      endsAt: "2026-10-19T15:00:00Z",
      finalizedAt: null,
      id: `${periodType}-period`,
      name: periodType === "weekly" ? "Week of 2026-10-19" : "Lifetime",
      periodType,
      startsAt: "2024-01-15T12:00:00Z",
      status: "active",
    },
  };
}

const weeklyLeaderboard = leaderboard("weekly", weeklyEntries);
const lifetimeLeaderboard = leaderboard("lifetime", lifetimeEntries);
const defaultProps = {
  isLifetimeLoading: false,
  isWeeklyLoading: false,
  lifetimeError: false,
  lifetimeLeaderboard,
  onRetryLifetime: jest.fn(),
  onRetryWeekly: jest.fn(),
  weeklyError: false,
  weeklyLeaderboard,
};

function getAvatarImageSource(label: string) {
  const avatarImage = screen.getByLabelText(label).children[0];
  if (!avatarImage || typeof avatarImage === "string") throw new Error(`Expected ${label} to contain an image.`);
  return avatarImage.props.source;
}

describe("LeaderboardCard", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage("en");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders the weekly podium as second, first, and third with progressively sized artwork", async () => {
    await render(<LeaderboardCard {...defaultProps} />);

    expect(screen.getByText("This Week’s Top 3")).toBeTruthy();
    expect(screen.getByTestId("weekly-podium-scroll").props.horizontal).toBe(true);
    expect(screen.getAllByTestId(/^weekly-podium-entry-/).map((entry) => entry.props.testID)).toEqual([
      "weekly-podium-entry-2",
      "weekly-podium-entry-1",
      "weekly-podium-entry-3",
    ]);

    const firstAvatar = StyleSheet.flatten(screen.getByLabelText("First Warrior's avatar").props.style);
    const secondAvatar = StyleSheet.flatten(screen.getByLabelText("Second Warrior's avatar").props.style);
    const thirdAvatar = StyleSheet.flatten(screen.getByLabelText("Third Warrior's avatar").props.style);
    expect(firstAvatar.width).toBeGreaterThan(secondAvatar.width);
    expect(secondAvatar.width).toBeGreaterThan(thirdAvatar.width);
    expect(screen.getByLabelText("Rank 1, First Warrior, 245 Rosaries")).toBeTruthy();
  });

  it("renders the lifetime top ten vertically in server-provided rank order", async () => {
    await render(<LeaderboardCard {...defaultProps} />);

    expect(screen.getByText("Lifetime Top 10")).toBeTruthy();
    expect(screen.getAllByTestId(/^lifetime-leaderboard-entry-/).map((entry) => entry.props.testID)).toEqual([
      "lifetime-leaderboard-entry-1",
      "lifetime-leaderboard-entry-2",
      "lifetime-leaderboard-entry-10",
    ]);
    expect(screen.getByLabelText("Rank 10, Lifetime Tenth, 529 Rosaries")).toBeTruthy();
    expect(screen.getByLabelText("Lifetime Leader's avatar")).toBeTruthy();
  });

  it("displays country flags on weekly and lifetime leaderboard avatars when available", async () => {
    await render(<LeaderboardCard {...defaultProps} />);

    expect(screen.getByLabelText("First Warrior's avatar").children).toHaveLength(2);
    expect(screen.getByLabelText("Lifetime Leader's avatar").children).toHaveLength(2);
    expect(screen.getByLabelText("Third Warrior's avatar").children).toHaveLength(1);
  });

  it("keeps lifetime results visible when the weekly board fails and retries only weekly", async () => {
    const onRetryWeekly = jest.fn();
    await render(
      <LeaderboardCard {...defaultProps} onRetryWeekly={onRetryWeekly} weeklyError weeklyLeaderboard={null} />,
    );

    expect(screen.getByText("Weekly leaderboard unavailable")).toBeTruthy();
    expect(screen.getByLabelText("Rank 1, Lifetime Leader, 1,245 Rosaries")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Retry weekly leaderboard" }));
    expect(onRetryWeekly).toHaveBeenCalledTimes(1);
    expect(defaultProps.onRetryLifetime).not.toHaveBeenCalled();
  });

  it("keeps the weekly podium visible when the lifetime board fails and retries only lifetime", async () => {
    const onRetryLifetime = jest.fn();
    await render(
      <LeaderboardCard {...defaultProps} lifetimeError lifetimeLeaderboard={null} onRetryLifetime={onRetryLifetime} />,
    );

    expect(screen.getByText("Lifetime leaderboard unavailable")).toBeTruthy();
    expect(screen.getByLabelText("Rank 1, First Warrior, 245 Rosaries")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Retry lifetime leaderboard" }));
    expect(onRetryLifetime).toHaveBeenCalledTimes(1);
    expect(defaultProps.onRetryWeekly).not.toHaveBeenCalled();
  });

  it("keeps the two board regions available for loading and empty results", async () => {
    await render(
      <LeaderboardCard
        {...defaultProps}
        isWeeklyLoading
        lifetimeLeaderboard={leaderboard("lifetime", [])}
        weeklyLeaderboard={null}
      />,
    );

    expect(screen.getByLabelText("Loading weekly leaderboard")).toBeTruthy();
    expect(screen.getByText("No lifetime leaderboard results yet.")).toBeTruthy();
    expect(screen.queryByText("Your rank")).toBeNull();
  });

  it("pins the current user below each board only when outside the displayed leaders", async () => {
    const weeklyCurrentUser = {
      ...weeklyEntries[0],
      displayName: "Weekly Me",
      isCurrentUser: true,
      rank: 18,
      rosaries: 4,
      userId: "weekly-me",
    };
    const lifetimeCurrentUser = {
      ...lifetimeEntries[0],
      displayName: "Lifetime Me",
      isCurrentUser: true,
      rank: 24,
      rosaries: 17,
      userId: "lifetime-me",
    };

    await render(
      <LeaderboardCard
        {...defaultProps}
        lifetimeLeaderboard={leaderboard("lifetime", lifetimeEntries, lifetimeCurrentUser)}
        weeklyLeaderboard={leaderboard("weekly", weeklyEntries, weeklyCurrentUser)}
      />,
    );

    expect(screen.getAllByText("Your rank")).toHaveLength(2);
    expect(screen.getByLabelText("Your rank: rank 18, Weekly Me, 4 Rosaries")).toBeTruthy();
    expect(screen.getByLabelText("Your rank: rank 24, Lifetime Me, 17 Rosaries")).toBeTruthy();
  });

  it("marks the current user in the leaders without rendering a duplicate pinned row", async () => {
    const currentLeader = { ...lifetimeEntries[0], isCurrentUser: true };

    await render(
      <LeaderboardCard
        {...defaultProps}
        lifetimeLeaderboard={leaderboard("lifetime", [currentLeader, ...lifetimeEntries.slice(1)], currentLeader)}
      />,
    );

    expect(screen.getByLabelText("Rank 1, Lifetime Leader, 1,245 Rosaries. You")).toBeTruthy();
    expect(screen.queryByLabelText("Your rank: rank 1, Lifetime Leader, 1,245 Rosaries")).toBeNull();
  });

  it("prioritizes saint, uploaded, and default avatar sources without linking to the friends leaderboard", async () => {
    await render(<LeaderboardCard {...defaultProps} />);

    const saintBenedict = saintAvatars.find((saint) => saint.name === "St. Benedict of Nursia")!;
    const virginMary = saintAvatars.find((saint) => saint.name === "Blessed Virgin Mary")!;
    expect(getAvatarImageSource("First Warrior's avatar")).toEqual([saintBenedict.image]);
    expect(getAvatarImageSource("Second Warrior's avatar")).toEqual([{ uri: "https://example.test/second.png" }]);
    expect(getAvatarImageSource("Third Warrior's avatar")).toEqual([virginMary.image]);
    expect(screen.getByLabelText("First Warrior's avatar")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "View leaderboard" })).toBeNull();
  });

  it("localizes both global boards and the pinned rank in Spanish", async () => {
    await i18n.changeLanguage("es");
    const currentUser = {
      ...lifetimeEntries[0],
      displayName: "Samuel",
      isCurrentUser: true,
      rank: 24,
      userId: "samuel",
    };
    await render(
      <LeaderboardCard {...defaultProps} lifetimeLeaderboard={leaderboard("lifetime", lifetimeEntries, currentUser)} />,
    );

    expect(screen.getByText("Los 3 mejores de esta semana")).toBeTruthy();
    expect(screen.getByText("Los 10 mejores de todos los tiempos")).toBeTruthy();
    expect(screen.getByLabelText("Puesto 1, First Warrior, 245 Rosarios")).toBeTruthy();
    expect(screen.getByLabelText("Tu puesto: puesto 24, Samuel, 1,245 Rosarios")).toBeTruthy();
  });
});
