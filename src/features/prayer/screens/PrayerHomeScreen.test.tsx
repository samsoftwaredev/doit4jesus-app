import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Pressable, Text, View } from "react-native";

import { i18n } from "@/localization";

import { PrayerScreen } from "./PrayerHomeScreen";

const mockPush = jest.fn();
const mockGetGlobalRosaryStats = jest.fn();
const mockGetLifetimeGlobalLeaderboard = jest.fn();
const mockGetWeeklyGlobalLeaderboard = jest.fn();
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
  useLocalSearchParams: () => ({}),
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/features/dashboard/dashboard.api", () => ({
  getLifetimeGlobalLeaderboard: (...args: unknown[]) => mockGetLifetimeGlobalLeaderboard(...args),
  getWeeklyGlobalLeaderboard: (...args: unknown[]) => mockGetWeeklyGlobalLeaderboard(...args),
}));

jest.mock("@/features/prayer/data/globalRosaryStats.api", () => ({
  getGlobalRosaryStats: (...args: unknown[]) => mockGetGlobalRosaryStats(...args),
}));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useCurrentLocalDate: () => mockCurrentLocalDate,
}));

jest.mock("@/features/prayer/components", () => {
  const {
    Pressable: MockPressable,
    Text: MockText,
    View: MockView,
  } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    AllMysteries: () => <MockText>All Mysteries Section</MockText>,
    GlobalRosaryStatsCard: ({
      error,
      isLoading,
      onRetry,
      stats,
    }: {
      error: boolean;
      isLoading: boolean;
      onRetry: () => void;
      stats: {
        currentUserContribution: { percentage: number; rosariesPrayed: number } | null;
        totalRosariesPrayed: number;
      } | null;
    }) => (
      <MockView>
        {isLoading ? <MockText>Global stats loading</MockText> : null}
        {!isLoading && stats ? <MockText>Global total {stats.totalRosariesPrayed}</MockText> : null}
        {error ? (
          <MockPressable accessibilityLabel="Retry global Rosary statistics" onPress={onRetry}>
            <MockText>Global stats unavailable</MockText>
          </MockPressable>
        ) : null}
      </MockView>
    ),
    MomentForPrayer: ({
      mysteryTitle,
      onPrayToday,
      weekday,
    }: {
      mysteryTitle: string;
      onPrayToday: () => void;
      weekday: string;
    }) => (
      <>
        <MockText>Today&apos;s Rosary Section</MockText>
        <MockText>{weekday}</MockText>
        <MockText>{mysteryTitle}</MockText>
        <MockPressable accessibilityLabel="Pray today's Rosary" onPress={onPrayToday} />
      </>
    ),
    PrayersByOthers: MockPrayersByOthers,
    RosaryGuideCards: () => <MockText>Rosary Guide Cards</MockText>,
  };
});
jest.mock("@/features/liturgy/screens", () => {
  const { Text: MockText } = jest.requireActual<typeof import("react-native")>("react-native");
  return { DailyLiturgyDashboard: () => <MockText>Daily Liturgy Section</MockText> };
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
    mockGetGlobalRosaryStats.mockResolvedValue({ currentUserContribution: null, totalRosariesPrayed: 26 });
    mockGetWeeklyGlobalLeaderboard.mockResolvedValue([
      { avatarUrl: null, displayName: "St. Michael", rank: 1, rosaries: 245 },
    ]);
    mockGetLifetimeGlobalLeaderboard.mockResolvedValue([
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
    await fireEvent.press(screen.getByLabelText("Pray today's Rosary"));
    expect(mockPush).toHaveBeenLastCalledWith({
      pathname: "/rosary",
      params: { isDecade: "false", mysteryType: "sorrowful", source: "today" },
    });
  });

  it("renders daily liturgy below the Rosary promises and excludes relocated sections", async () => {
    fetchApprovedPrayerIntentions.mockResolvedValue({
      data: [],
      meta: { hasMore: false, limit: 10, nextOffset: null, offset: 0 },
    });

    await render(<PrayerScreen />);

    expect(screen.getByRole("header", { name: "Prayer" })).toBeTruthy();
    expect(screen.getByText("Pray the Rosary and lift up the intentions of others.")).toBeTruthy();
    expect(screen.getByText("Daily Liturgy Section")).toBeTruthy();

    const sections = screen.getAllByTestId(/^prayer-section-/);
    expect(sections.map((section) => section.props.testID)).toEqual([
      "prayer-section-today",
      "prayer-section-rosary-guide",
      "prayer-section-liturgy",
      "prayer-section-mysteries",
      "prayer-section-intentions",
      "prayer-section-global-stats",
    ]);
    expect(mockGetWeeklyGlobalLeaderboard).not.toHaveBeenCalled();
    expect(mockGetLifetimeGlobalLeaderboard).not.toHaveBeenCalled();
    expect(mockGetGlobalRosaryStats).not.toHaveBeenCalled();
  });

  it("loads global Rosary statistics once when the final card enters the viewport", async () => {
    fetchApprovedPrayerIntentions.mockResolvedValue({
      data: [],
      meta: { hasMore: false, limit: 10, nextOffset: null, offset: 0 },
    });
    await render(<PrayerScreen />);

    const scrollView = screen.getByTestId("prayer-home-scroll");
    const globalStatsSection = screen.getByTestId("prayer-section-global-stats");
    await fireEvent(scrollView, "layout", { nativeEvent: { layout: { height: 600 } } });
    await fireEvent(globalStatsSection, "layout", {
      nativeEvent: { layout: { height: 180, y: 1200 } },
    });
    expect(mockGetGlobalRosaryStats).not.toHaveBeenCalled();

    await fireEvent.scroll(scrollView, { nativeEvent: { contentOffset: { y: 500 } } });
    expect(mockGetGlobalRosaryStats).not.toHaveBeenCalled();

    await fireEvent.scroll(scrollView, { nativeEvent: { contentOffset: { y: 650 } } });
    expect(await screen.findByText("Global total 26")).toBeTruthy();
    expect(mockGetGlobalRosaryStats).toHaveBeenCalledTimes(1);

    await fireEvent.scroll(scrollView, { nativeEvent: { contentOffset: { y: 0 } } });
    await fireEvent.scroll(scrollView, { nativeEvent: { contentOffset: { y: 650 } } });
    await act(async () => {
      mockFocusEffect?.();
    });
    expect(mockGetGlobalRosaryStats).toHaveBeenCalledTimes(1);
  });

  it("retries global Rosary statistics after a visible request fails", async () => {
    mockGetGlobalRosaryStats.mockRejectedValueOnce(new Error("Network unavailable")).mockResolvedValueOnce({
      currentUserContribution: { percentage: 7.1429, rosariesPrayed: 2 },
      totalRosariesPrayed: 28,
    });
    fetchApprovedPrayerIntentions.mockResolvedValue({
      data: [],
      meta: { hasMore: false, limit: 10, nextOffset: null, offset: 0 },
    });
    await render(<PrayerScreen />);

    const scrollView = screen.getByTestId("prayer-home-scroll");
    await fireEvent(scrollView, "layout", { nativeEvent: { layout: { height: 600 } } });
    await fireEvent(screen.getByTestId("prayer-section-global-stats"), "layout", {
      nativeEvent: { layout: { height: 180, y: 1200 } },
    });
    await fireEvent.scroll(scrollView, { nativeEvent: { contentOffset: { y: 650 } } });

    await fireEvent.press(await screen.findByLabelText("Retry global Rosary statistics"));
    expect(await screen.findByText("Global total 28")).toBeTruthy();
    expect(mockGetGlobalRosaryStats).toHaveBeenCalledTimes(2);
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
    expect(screen.getByText("Rosary Guide Cards")).toBeTruthy();
    expect(screen.getByText("Daily Liturgy Section")).toBeTruthy();
  });
});
