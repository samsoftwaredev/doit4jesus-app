import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Pressable, Text, View } from "react-native";

import { i18n } from "@/localization";

import { PrayerScreen } from "./PrayerHomeScreen";

const mockPush = jest.fn();
const mockGetWeeklyGlobalLeaderboard = jest.fn();
const mockGetYearlyGlobalLeaderboard = jest.fn();
let mockCurrentLocalDate = "2026-08-24";
let mockFocusEffect: (() => void | (() => void)) | undefined;

function MockPrayersByOthers({
  intentions,
  isLoadingMore,
  onLoadMore,
}: {
  intentions: { id: string; title: string }[];
  isLoadingMore: boolean;
  onLoadMore: () => void;
}) {
  return (
    <View>
      {intentions.map((intention) => (
        <Text key={intention.id}>{intention.title}</Text>
      ))}
      <Text>{isLoadingMore ? "Loading another page" : "More intentions ready"}</Text>
      <Pressable accessibilityLabel="Load the next home intention page" onPress={onLoadMore}>
        <Text>Load more</Text>
      </Pressable>
    </View>
  );
}

jest.mock("@/features/prayer/intentions", () => ({
  cacheApprovedPrayerIntentions: jest.fn(),
  fetchApprovedPrayerIntentions: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useFocusEffect: (effect: () => void | (() => void)) => {
    const React = jest.requireActual("react") as typeof import("react");
    mockFocusEffect = effect;
    React.useEffect(effect, [effect]);
  },
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/features/dashboard/dashboard.api", () => ({
  getWeeklyGlobalLeaderboard: (...args: unknown[]) => mockGetWeeklyGlobalLeaderboard(...args),
  getYearlyGlobalLeaderboard: (...args: unknown[]) => mockGetYearlyGlobalLeaderboard(...args),
}));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useCurrentLocalDate: () => mockCurrentLocalDate,
}));

jest.mock("@/features/prayer/components", () => {
  const { Text: MockText } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    AllMysteries: () => <MockText>All Mysteries Section</MockText>,
    MomentForPrayer: ({ mysteryTitle, weekday }: { mysteryTitle: string; weekday: string }) => (
      <>
        <MockText>Today&apos;s Rosary Section</MockText>
        <MockText>{weekday}</MockText>
        <MockText>{mysteryTitle}</MockText>
      </>
    ),
    PrayersByOthers: MockPrayersByOthers,
  };
});

jest.mock("@/features/prayer/rosary/garden/components", () => {
  const { Pressable: MockPressable, Text: MockText } =
    jest.requireActual<typeof import("react-native")>("react-native");
  return {
    RosaryGardenSection: ({ onPrayToday }: { onPrayToday: () => void }) => (
      <MockPressable accessibilityLabel="Pray from the embedded garden" onPress={onPrayToday}>
        <MockText>Rosary Garden Section</MockText>
      </MockPressable>
    ),
  };
});

const { fetchApprovedPrayerIntentions } = jest.requireMock("@/features/prayer/intentions") as {
  fetchApprovedPrayerIntentions: jest.Mock;
};

const firstIntention = {
  approvedAt: "2026-08-01T00:00:00.000Z",
  createdAt: "2026-07-28T00:00:00.000Z",
  creator: { avatarUrl: null, countryCode: "US", displayName: "John Paul" },
  description: "Please pray for healing and strength.",
  expiresAt: "2026-09-01T00:00:00.000Z",
  id: "intention-1",
  symbol: "candle",
  title: "Praying for Recovery",
};

const secondIntention = {
  ...firstIntention,
  id: "intention-2",
  title: "Praying for Peace",
};

describe("PrayerScreen", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockCurrentLocalDate = "2026-08-24";
    mockGetWeeklyGlobalLeaderboard.mockResolvedValue([
      { avatarUrl: null, displayName: "St. Michael", rank: 1, rosaries: 245 },
    ]);
    mockGetYearlyGlobalLeaderboard.mockResolvedValue([
      { avatarUrl: null, displayName: "St. Joseph", rank: 1, rosaries: 845 },
    ]);
    await i18n.changeLanguage("en");
  });

  it("updates today's weekday, mystery, and prayer destination when the local date changes", async () => {
    fetchApprovedPrayerIntentions.mockResolvedValue({
      data: [],
      meta: { hasMore: false, limit: 10, nextOffset: null, offset: 0 },
    });
    const view = await render(<PrayerScreen />);

    expect(screen.getByText("Monday")).toBeTruthy();
    expect(screen.getByText("Joyful Mysteries")).toBeTruthy();

    mockCurrentLocalDate = "2026-08-25";
    await view.rerender(<PrayerScreen />);

    expect(screen.getByText("Tuesday")).toBeTruthy();
    expect(screen.getByText("Sorrowful Mysteries")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Pray from the embedded garden"));
    expect(mockPush).toHaveBeenLastCalledWith({
      pathname: "/rosary",
      params: { isDecade: "false", mysteryType: "sorrowful", source: "today" },
    });
  });

  it("renders Prayer and Rosary Garden content in one ordered page", async () => {
    fetchApprovedPrayerIntentions.mockResolvedValue({
      data: [],
      meta: { hasMore: false, limit: 10, nextOffset: null, offset: 0 },
    });

    await render(<PrayerScreen />);

    expect(screen.getByRole("header", { name: "Prayer" })).toBeTruthy();
    expect(screen.getByText("Pray the Rosary and lift up the intentions of others.")).toBeTruthy();
    expect(screen.queryByLabelText("Open Rosary Garden")).toBeNull();

    const sections = screen.getAllByTestId(/^prayer-section-/);
    expect(sections.map((section) => section.props.testID)).toEqual([
      "prayer-section-today",
      "prayer-section-garden",
      "prayer-section-global-leaderboard",
      "prayer-section-mysteries",
      "prayer-section-intentions",
    ]);
    expect(await screen.findByLabelText("Rank 1, St. Michael, 245 Rosaries")).toBeTruthy();
    expect(screen.getByLabelText("Rank 1, St. Joseph, 845 Rosaries")).toBeTruthy();
    expect(screen.getByText("This Week’s Top 3")).toBeTruthy();
    expect(screen.getByText("This Year’s Top 10")).toBeTruthy();
    expect(mockGetWeeklyGlobalLeaderboard).toHaveBeenCalledTimes(1);
    expect(mockGetYearlyGlobalLeaderboard).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByLabelText("Pray from the embedded garden"));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/rosary",
      params: { isDecade: "false", mysteryType: expect.any(String), source: "today" },
    });
  });

  it("shows a recoverable weekly failure without hiding yearly results", async () => {
    mockGetWeeklyGlobalLeaderboard
      .mockRejectedValueOnce(new Error("Network unavailable"))
      .mockResolvedValueOnce([{ avatarUrl: null, displayName: "Ave Maria", rank: 2, rosaries: 180 }]);
    fetchApprovedPrayerIntentions.mockResolvedValue({
      data: [],
      meta: { hasMore: false, limit: 10, nextOffset: null, offset: 0 },
    });

    await render(<PrayerScreen />);

    expect(await screen.findByText("Weekly leaderboard unavailable")).toBeTruthy();
    expect(screen.getByLabelText("Rank 1, St. Joseph, 845 Rosaries")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Retry weekly leaderboard" }));
    expect(await screen.findByLabelText("Rank 2, Ave Maria, 180 Rosaries")).toBeTruthy();
    expect(mockGetWeeklyGlobalLeaderboard).toHaveBeenCalledTimes(2);
    expect(mockGetYearlyGlobalLeaderboard).toHaveBeenCalledTimes(1);
  });

  it("ignores an older weekly response after a newer focus request succeeds", async () => {
    let resolveOlderRequest: ((entries: unknown[]) => void) | undefined;
    mockGetWeeklyGlobalLeaderboard
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveOlderRequest = resolve;
          }),
      )
      .mockResolvedValueOnce([{ avatarUrl: null, displayName: "Current Leader", rank: 1, rosaries: 500 }]);
    fetchApprovedPrayerIntentions.mockResolvedValue({
      data: [],
      meta: { hasMore: false, limit: 10, nextOffset: null, offset: 0 },
    });

    await render(<PrayerScreen />);
    await waitFor(() => expect(mockGetWeeklyGlobalLeaderboard).toHaveBeenCalledTimes(1));

    await act(async () => {
      mockFocusEffect?.();
    });
    expect(await screen.findByLabelText("Rank 1, Current Leader, 500 Rosaries")).toBeTruthy();

    await act(async () => {
      resolveOlderRequest?.([{ avatarUrl: null, displayName: "Stale Leader", rank: 1, rosaries: 1 }]);
    });
    expect(screen.queryByLabelText("Rank 1, Stale Leader, 1 Rosaries")).toBeNull();
    expect(screen.getByLabelText("Rank 1, Current Leader, 500 Rosaries")).toBeTruthy();
  });

  it("loads successive intention pages for the horizontal home carousel", async () => {
    fetchApprovedPrayerIntentions
      .mockResolvedValueOnce({
        data: [firstIntention],
        meta: { hasMore: true, limit: 10, nextOffset: 10, offset: 0 },
      })
      .mockResolvedValueOnce({
        data: [secondIntention],
        meta: { hasMore: false, limit: 10, nextOffset: null, offset: 10 },
      });

    await render(<PrayerScreen />);
    await waitFor(() => expect(screen.getByText(firstIntention.title)).toBeTruthy());

    await fireEvent.press(screen.getByLabelText("Load the next home intention page"));

    await waitFor(() => {
      expect(fetchApprovedPrayerIntentions).toHaveBeenNthCalledWith(2, { limit: 10, offset: 10 });
      expect(screen.getByText(secondIntention.title)).toBeTruthy();
    });
  });

  it("localizes the consolidated Prayer page", async () => {
    await i18n.changeLanguage("es");
    fetchApprovedPrayerIntentions.mockResolvedValue({
      data: [],
      meta: { hasMore: false, limit: 10, nextOffset: null, offset: 0 },
    });

    await render(<PrayerScreen />);

    expect(screen.getByRole("header", { name: "Oración" })).toBeTruthy();
    expect(screen.getByText("Reza el Rosario y eleva las intenciones de los demás.")).toBeTruthy();
    expect(screen.getByText("Rosary Garden Section")).toBeTruthy();
    expect(await screen.findByText("Los 3 mejores de esta semana")).toBeTruthy();
    expect(screen.getByText("Los 10 mejores de este año")).toBeTruthy();
  });
});
