import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { saintAvatars } from "@/features/profile/saints";
import { i18n } from "@/localization";

import { LeaderboardCard } from "./LeaderboardCard";

const weeklyEntries = [
  {
    avatarUrl: "https://example.test/first.png",
    countryCode: "US",
    displayName: "First Warrior",
    rank: 1,
    rosaries: 245,
    saintAvatarId: "a1000000-0000-4000-8000-000000000005",
  },
  {
    avatarUrl: "https://example.test/second.png",
    countryCode: "MX",
    displayName: "Second Warrior",
    rank: 2,
    rosaries: 190,
    saintAvatarId: null,
  },
  {
    avatarUrl: null,
    countryCode: null,
    displayName: "Third Warrior",
    rank: 3,
    rosaries: 156,
    saintAvatarId: null,
  },
];

const yearlyEntries = [
  { avatarUrl: null, countryCode: "US", displayName: "Year Leader", rank: 1, rosaries: 1245, saintAvatarId: null },
  {
    avatarUrl: null,
    countryCode: "MX",
    displayName: "Year Runner-up",
    rank: 2,
    rosaries: 1100,
    saintAvatarId: null,
  },
  { avatarUrl: null, countryCode: null, displayName: "Year Tenth", rank: 10, rosaries: 529, saintAvatarId: null },
];

const defaultProps = {
  isWeeklyLoading: false,
  isYearlyLoading: false,
  onRetryWeekly: jest.fn(),
  onRetryYearly: jest.fn(),
  weeklyEntries,
  weeklyError: false,
  yearlyEntries,
  yearlyError: false,
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

  it("renders the yearly top ten vertically in server-provided rank order", async () => {
    await render(<LeaderboardCard {...defaultProps} />);

    expect(screen.getByText("This Year’s Top 10")).toBeTruthy();
    expect(screen.getAllByTestId(/^yearly-leaderboard-entry-/).map((entry) => entry.props.testID)).toEqual([
      "yearly-leaderboard-entry-1",
      "yearly-leaderboard-entry-2",
      "yearly-leaderboard-entry-10",
    ]);
    expect(screen.getByLabelText("Rank 10, Year Tenth, 529 Rosaries")).toBeTruthy();
    expect(screen.getByLabelText("Year Leader's avatar")).toBeTruthy();
  });

  it("displays country flags on weekly and yearly leaderboard avatars when available", async () => {
    await render(<LeaderboardCard {...defaultProps} />);

    expect(screen.getByLabelText("First Warrior's avatar").children).toHaveLength(2);
    expect(screen.getByLabelText("Year Leader's avatar").children).toHaveLength(2);
    expect(screen.getByLabelText("Third Warrior's avatar").children).toHaveLength(1);
  });

  it("keeps yearly results visible when the weekly board fails and retries only weekly", async () => {
    const onRetryWeekly = jest.fn();
    await render(<LeaderboardCard {...defaultProps} onRetryWeekly={onRetryWeekly} weeklyEntries={null} weeklyError />);

    expect(screen.getByText("Weekly leaderboard unavailable")).toBeTruthy();
    expect(screen.getByLabelText("Rank 1, Year Leader, 1,245 Rosaries")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Retry weekly leaderboard" }));
    expect(onRetryWeekly).toHaveBeenCalledTimes(1);
    expect(defaultProps.onRetryYearly).not.toHaveBeenCalled();
  });

  it("keeps the weekly podium visible when the yearly board fails and retries only yearly", async () => {
    const onRetryYearly = jest.fn();
    await render(<LeaderboardCard {...defaultProps} onRetryYearly={onRetryYearly} yearlyEntries={null} yearlyError />);

    expect(screen.getByText("Yearly leaderboard unavailable")).toBeTruthy();
    expect(screen.getByLabelText("Rank 1, First Warrior, 245 Rosaries")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Retry yearly leaderboard" }));
    expect(onRetryYearly).toHaveBeenCalledTimes(1);
    expect(defaultProps.onRetryWeekly).not.toHaveBeenCalled();
  });

  it("keeps the two board regions available for loading and empty results", async () => {
    await render(<LeaderboardCard {...defaultProps} isWeeklyLoading weeklyEntries={null} yearlyEntries={[]} />);

    expect(screen.getByLabelText("Loading weekly leaderboard")).toBeTruthy();
    expect(screen.getByText("No yearly leaderboard results yet.")).toBeTruthy();
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

  it("localizes both global boards in Spanish", async () => {
    await i18n.changeLanguage("es");
    await render(<LeaderboardCard {...defaultProps} />);

    expect(screen.getByText("Los 3 mejores de esta semana")).toBeTruthy();
    expect(screen.getByText("Los 10 mejores de este año")).toBeTruthy();
    expect(screen.getByLabelText("Puesto 1, First Warrior, 245 Rosarios")).toBeTruthy();
  });
});
