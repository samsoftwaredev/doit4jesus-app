import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { notifyRosaryCompletionRecorded } from "@/features/prayer/rosary/rosary-completion-events";
import { i18n } from "@/localization";

import { HolyProgressDashboard } from "./HolyProgressDashboard";

const mockPush = jest.fn();
const mockNavigate = jest.fn();
const mockFetchDashboardProgress = jest.fn();
const mockFetchLevels = jest.fn();
const mockFetchRecentRosaryActivities = jest.fn();
const mockFetchRosaryStats = jest.fn();
const mockGetConscienceQuestion = jest.fn();
const mockGetRosaryReminder = jest.fn();
const mockGetLifetimeGlobalLeaderboard = jest.fn();
const mockGetWeeklyGlobalLeaderboard = jest.fn();
const mockFetchScreenData = jest.fn();
const mockFetchApprovedPrayerIntentions = jest.fn();
const mockGetGlobalRosaryStats = jest.fn();
const mockLeaderboardCardProps = jest.fn();
const mockFocusCleanups: (() => void)[] = [];
let mockCurrentLocalDate = "2026-08-24";
let mockRosaryArtStyle: "classic" | "comic" = "comic";
let mockProfile: { displayName: string | null; gender: "female" | "male" | null } | null = null;
const mockResponsiveLayout = jest.fn(() => ({
  contentWidth: 390,
  fontScale: 1,
  gutter: 16,
  height: 844,
  isDesktop: false,
  isLandscape: false,
  isLargeText: false,
  isNarrowPhone: false,
  isTablet: false,
  size: "phone",
  width: 390,
}));
const firstIntention = { id: "intention-1", title: "Praying for Recovery" };
const secondIntention = { id: "intention-2", title: "Praying for Peace" };

jest.mock("expo-router", () => {
  const React = jest.requireActual("react") as typeof import("react");
  return {
    useFocusEffect: (effect: () => void | (() => void)) =>
      React.useEffect(() => {
        const cleanup = effect();
        if (cleanup) mockFocusCleanups.push(cleanup);
        return cleanup;
      }, [effect]),
    useRouter: () => ({ navigate: mockNavigate, push: mockPush }),
  };
});

jest.mock("@/features/progress", () => ({
  ...(() => {
    const { Text, View } = jest.requireActual<typeof import("react-native")>("react-native");
    return {
      EarnedBadgesSection: () => <Text>Dashboard Earned Badges</Text>,
      fetchDashboardProgress: (...args: unknown[]) => mockFetchDashboardProgress(...args),
      fetchLevels: (...args: unknown[]) => mockFetchLevels(...args),
      fetchRecentRosaryActivities: (...args: unknown[]) => mockFetchRecentRosaryActivities(...args),
      fetchRosaryStats: (...args: unknown[]) => mockFetchRosaryStats(...args),
      UserProgressSection: () => (
        <View testID="mock-streak-progress">
          <Text>Existing User Progress</Text>
        </View>
      ),
    };
  })(),
}));

jest.mock("@/features/prayer/rosary/hooks/useRosaryArtStylePreference", () => ({
  useRosaryArtStylePreference: () => ({ rosaryArtStyle: mockRosaryArtStyle }),
}));

jest.mock("@/features/prayer/components", () => {
  const actual = jest.requireActual("@/features/prayer/components") as Record<string, unknown>;
  const { Pressable, Text, View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    ...actual,
    AllMysteries: ({ onOpenMystery }: { onOpenMystery: (mysteryType: string) => void }) => (
      <Pressable accessibilityLabel="Open Joyful Mysteries" onPress={() => onOpenMystery("joyful")}>
        <Text>All Mysteries Section</Text>
      </Pressable>
    ),
    GlobalRosaryStatsCard: ({
      error,
      isLoading,
      onRetry,
      stats,
    }: {
      error: boolean;
      isLoading: boolean;
      onRetry: () => void;
      stats: { totalRosariesPrayed: number } | null;
    }) => (
      <View>
        {isLoading ? <Text>Global stats loading</Text> : null}
        {stats ? <Text>Global total {stats.totalRosariesPrayed}</Text> : null}
        {error ? (
          <Pressable accessibilityLabel="Retry global Rosary statistics" onPress={onRetry}>
            <Text>Global stats unavailable</Text>
          </Pressable>
        ) : null}
      </View>
    ),
    PrayersByOthers: ({
      errorMessage,
      hasMore,
      intentions,
      onCreateIntention,
      onLoadMore,
      onOpenIntention,
      onOpenMyIntentions,
      onRetry,
      onSeeAll,
    }: {
      errorMessage?: string;
      hasMore: boolean;
      intentions: { id: string; title: string }[];
      onCreateIntention: () => void;
      onLoadMore: () => void;
      onOpenIntention: (id: string) => void;
      onOpenMyIntentions: () => void;
      onRetry: () => void;
      onSeeAll: () => void;
    }) => (
      <View>
        <Text>Prayers by Others Section</Text>
        {intentions.map((intention) => (
          <Pressable
            accessibilityLabel={`Open ${intention.title}`}
            key={intention.id}
            onPress={() => onOpenIntention(intention.id)}
          >
            <Text>{intention.title}</Text>
          </Pressable>
        ))}
        <Pressable accessibilityLabel="Share an intention" onPress={onCreateIntention} />
        <Pressable accessibilityLabel="Open my intentions" onPress={onOpenMyIntentions} />
        <Pressable accessibilityLabel="See all intentions" onPress={onSeeAll} />
        {hasMore ? <Pressable accessibilityLabel="Load more intentions" onPress={onLoadMore} /> : null}
        {errorMessage ? <Pressable accessibilityLabel="Retry intentions" onPress={onRetry} /> : null}
      </View>
    ),
    RosaryGuideCards: () => (
      <View>
        <Text>History of the Rosary</Text>
        <Text>What It Promises</Text>
      </View>
    ),
  };
});

jest.mock("@/features/prayer/intentions", () => ({
  cacheApprovedPrayerIntentions: jest.fn(),
  fetchApprovedPrayerIntentions: (...args: unknown[]) => mockFetchApprovedPrayerIntentions(...args),
  parseApprovedPrayerIntentionsPage: (data: unknown, meta: unknown) => ({ data, meta }),
}));

jest.mock("@/features/prayer/data/globalRosaryStats.api", () => ({
  getGlobalRosaryStats: (...args: unknown[]) => mockGetGlobalRosaryStats(...args),
}));

jest.mock("@/features/screen-data", () => ({
  fetchScreenData: (...args: unknown[]) => mockFetchScreenData(...args),
}));

jest.mock("@/hooks/useCurrentLocalDate", () => ({
  useCurrentLocalDate: () => mockCurrentLocalDate,
}));

jest.mock("@/features/liturgy/screens", () => {
  const { Text, View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    DailyLiturgyDashboard: () => (
      <View>
        <Text>Daily Mass</Text>
        <Text>Today’s Scripture Readings</Text>
        <Text>Daily Scripture Quote</Text>
      </View>
    ),
  };
});

jest.mock("@/features/prayer/rosary/garden/components", () => {
  const { Text } = jest.requireActual<typeof import("react-native")>("react-native");
  return { RosaryGardenSection: () => <Text>Rosary Garden Section</Text> };
});

jest.mock("./components", () => {
  const actual = jest.requireActual("./components") as Record<string, unknown>;
  const { Pressable, Text, View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    ...actual,
    LeaderboardCard: (props: {
      isLifetimeLoading: boolean;
      isWeeklyLoading: boolean;
      lifetimeError: boolean;
      onRetryLifetime: () => void;
      onRetryWeekly: () => void;
      lifetimeLeaderboard?: unknown;
      weeklyLeaderboard?: unknown;
      weeklyError: boolean;
    }) => {
      mockLeaderboardCardProps(props);
      return (
        <View>
          <Text>Global Leaderboards</Text>
          {props.isWeeklyLoading ? <Text>Weekly leaderboard loading</Text> : null}
          {props.isLifetimeLoading ? <Text>Lifetime leaderboard loading</Text> : null}
          {props.weeklyError ? (
            <Pressable accessibilityLabel="Retry weekly global leaderboard" onPress={props.onRetryWeekly} />
          ) : null}
          {props.lifetimeError ? (
            <Pressable accessibilityLabel="Retry lifetime global leaderboard" onPress={props.onRetryLifetime} />
          ) : null}
        </View>
      );
    },
  };
});

jest.mock("./dashboard.api", () => ({
  getConscienceQuestion: (...args: unknown[]) => mockGetConscienceQuestion(...args),
  getLifetimeGlobalLeaderboard: (...args: unknown[]) => mockGetLifetimeGlobalLeaderboard(...args),
  getRosaryReminder: (...args: unknown[]) => mockGetRosaryReminder(...args),
  getWeeklyGlobalLeaderboard: (...args: unknown[]) => mockGetWeeklyGlobalLeaderboard(...args),
}));

jest.mock("@/hooks/useResponsiveLayout", () => ({
  useResponsiveLayout: () => mockResponsiveLayout(),
}));

jest.mock("@/features/profile", () => ({
  useCurrentProfile: () => ({ profile: mockProfile }),
}));

describe("HolyProgressDashboard", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockFocusCleanups.length = 0;
    await i18n.changeLanguage("en");
    mockCurrentLocalDate = "2026-08-24";
    mockRosaryArtStyle = "comic";
    mockProfile = { displayName: "Mateo", gender: "male" };
    mockResponsiveLayout.mockReturnValue({
      contentWidth: 390,
      fontScale: 1,
      gutter: 16,
      height: 844,
      isDesktop: false,
      isLandscape: false,
      isLargeText: false,
      isNarrowPhone: false,
      isTablet: false,
      size: "phone",
      width: 390,
    });
    mockFetchDashboardProgress.mockResolvedValue({
      currentLevel: { code: "devoted", levelNumber: 3, minimumTotalXp: 3000, name: "Devoted" },
      levelProgressPercentage: 44,
      lifetimePoints: 4320,
      nextLevel: { code: "faithful", levelNumber: 4, minimumTotalXp: 6000, name: "Faithful" },
      totalXp: 4320,
      weeklyPoints: 210,
      xpIntoCurrentLevel: 1320,
      xpRequiredForNextLevel: 3000,
      yearlyPoints: 4320,
    });
    mockFetchLevels.mockResolvedValue([{ code: "faithful", levelNumber: 4, minimumTotalXp: 6000, name: "Faithful" }]);
    mockFetchRecentRosaryActivities.mockResolvedValue([
      {
        completedAt: "2026-08-29T15:25:00.000Z",
        id: "activity-1",
        occurredAt: "2026-08-29T15:00:00.000Z",
        quantity: 1,
      },
    ]);
    mockFetchRosaryStats.mockResolvedValue({ rosariesPrayed: 86 });
    mockGetConscienceQuestion.mockResolvedValue({
      id: "conscience-1",
      question: "Did I show mercy?",
      reflection: "Choose charity today.",
    });
    mockGetRosaryReminder.mockResolvedValue({
      completed: false,
      deadlineAt: "2026-08-30T05:00:00.000Z",
      serverNow: "2026-08-29T18:00:00.000Z",
      streak: { current: 28, longest: 42, status: "active" },
    });
    mockGetWeeklyGlobalLeaderboard.mockResolvedValue([
      { avatarUrl: null, displayName: "St. Michael", rank: 1, rosaries: 245 },
    ]);
    mockGetLifetimeGlobalLeaderboard.mockResolvedValue({ currentUserEntry: null, entries: [] });
    mockFetchScreenData.mockResolvedValue({ errors: {}, screen: "prayer", sections: {} });
    mockFetchApprovedPrayerIntentions.mockResolvedValue({
      data: [],
      meta: { hasMore: false, limit: 10, nextOffset: null, offset: 0 },
    });
    mockGetGlobalRosaryStats.mockResolvedValue({ currentUserContribution: null, totalRosariesPrayed: 26 });
  });

  it("loads the four dashboard sections and refetches authoritative Rosary data after completion", async () => {
    const rendered = await render(<HolyProgressDashboard />);

    expect(await screen.findByLabelText("Rosaries, 86")).toBeTruthy();
    expect(screen.getByRole("header", { name: "LEVEL PROGRESS" })).toBeTruthy();
    expect(screen.getByText("Did I show mercy?")).toBeTruthy();
    expect(screen.getByText("Plant Today’s Flower")).toBeTruthy();
    expect(screen.getByText("28 Day Streak")).toBeTruthy();
    expect(screen.getByText("Global Leaderboards")).toBeTruthy();
    expect(mockGetWeeklyGlobalLeaderboard).toHaveBeenCalledTimes(1);
    expect(mockGetLifetimeGlobalLeaderboard).toHaveBeenCalledTimes(1);

    await act(async () => {
      notifyRosaryCompletionRecorded();
    });

    await waitFor(() => {
      expect(mockFetchDashboardProgress).toHaveBeenCalledTimes(2);
      expect(mockFetchLevels).toHaveBeenCalledTimes(2);
      expect(mockFetchRecentRosaryActivities).toHaveBeenCalledTimes(2);
      expect(mockFetchRosaryStats).toHaveBeenCalledTimes(2);
      expect(mockGetRosaryReminder).toHaveBeenCalledTimes(2);
    });
    expect(mockGetWeeklyGlobalLeaderboard).toHaveBeenCalledTimes(1);
    expect(mockGetLifetimeGlobalLeaderboard).toHaveBeenCalledTimes(1);
    await rendered.unmount();
  });

  it("places level progress directly after holy progress", async () => {
    await render(<HolyProgressDashboard />);
    await screen.findByRole("header", { name: "LEVEL PROGRESS" });

    const cards = screen.getByTestId("dashboard-primary-grid").props.children;
    expect(cards[0].props.testID).toBe("holy-progress-card-container");
    expect(cards[1].props.testID).toBe("level-progress-card-container");
    expect(cards[2].props.testID).toBe("global-leaderboard-card-container");
    expect(cards).toHaveLength(5);
  });

  it("places today's Rosary first, before streak progress, and opens the scheduled full Rosary", async () => {
    await render(<HolyProgressDashboard />);

    expect(screen.getByText("Monday")).toBeTruthy();
    expect(screen.getByText("Joyful Mysteries")).toBeTruthy();
    const sections = screen.getByLabelText("Holy Progress Dashboard").props.children;
    expect(sections[0].props.testID).toBe("today-rosary-card-container");
    expect(sections[1].props.testID).toBe("streak-progress-container");

    await fireEvent.press(screen.getByLabelText("Pray digital Rosary for today's Joyful Mysteries"));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/rosary",
      params: { isDecade: "false", mysteryType: "joyful", source: "today" },
    });

    await fireEvent.press(screen.getByLabelText("Pray video Rosary for today's Joyful Mysteries"));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/rosary-video",
      params: { mysteryType: "joyful" },
    });
  });

  it("keeps the daily Rosary reminder directly after the streak progress", async () => {
    await render(<HolyProgressDashboard />);
    await screen.findByLabelText("Pray Rosary");

    const sections = screen.getByLabelText("Holy Progress Dashboard").props.children;
    expect(sections[2].props.testID).toBe("daily-rosary-card-container");
  });

  it("uses the existing Rosary route without presenting a global leaderboard action", async () => {
    await render(<HolyProgressDashboard />);
    await screen.findByLabelText("Pray Rosary");

    await fireEvent.press(screen.getByLabelText("Pray Rosary"));

    expect(mockPush).toHaveBeenCalledWith({ pathname: "/rosary", params: { source: "home-dashboard" } });
    expect(screen.queryByLabelText("View leaderboard")).toBeNull();
  });

  it("opens Home at the Rosary Garden from the daily Rosary card", async () => {
    await render(<HolyProgressDashboard />);
    await screen.findByRole("button", { name: "View Garden" });

    await fireEvent.press(screen.getByRole("button", { name: "View Garden" }));

    expect(mockNavigate).toHaveBeenCalledWith({ pathname: "/home", params: { scrollTo: "garden" } });
  });

  it("renders the former Prayer content directly in the Home dashboard", async () => {
    await render(<HolyProgressDashboard />);

    expect(screen.getByText("Existing User Progress")).toBeTruthy();
    expect(screen.getByText("Dashboard Earned Badges")).toBeTruthy();
    expect(screen.getByText("Rosary Garden Section")).toBeTruthy();
    expect(screen.getByText("History of the Rosary")).toBeTruthy();
    expect(screen.getByText("What It Promises")).toBeTruthy();
    expect(screen.getByText("Daily Mass")).toBeTruthy();
    expect(screen.getByText("Today’s Scripture Readings")).toBeTruthy();
    expect(screen.getByText("Daily Scripture Quote")).toBeTruthy();
    expect(screen.getByText("Prayers by Others Section")).toBeTruthy();
    expect(screen.getByText("All Mysteries Section")).toBeTruthy();
    expect(await screen.findByText("Global total 26")).toBeTruthy();
  });

  it("places the combined sections in the requested source and screen-reader order", async () => {
    await render(<HolyProgressDashboard />);
    await screen.findByText("Global total 26");

    const sections = screen.getByLabelText("Holy Progress Dashboard").props.children;
    expect(sections.map((section: { props: { testID?: string } }) => section.props.testID)).toEqual([
      "today-rosary-card-container",
      "streak-progress-container",
      "daily-rosary-card-container",
      "rosary-garden-section-container",
      "rosary-guide-section-container",
      "daily-liturgy-section-container",
      "dashboard-primary-grid",
      "prayers-by-others-section-container",
      "all-mysteries-section-container",
      "global-rosary-stats-section-container",
    ]);

    const progressCards = screen.getByTestId("dashboard-primary-grid").props.children;
    expect(progressCards[0].props.testID).toBe("holy-progress-card-container");
    expect(progressCards[1].props.testID).toBe("level-progress-card-container");
    expect(progressCards[2].props.testID).toBe("global-leaderboard-card-container");
  });

  it("uses the Prayer aggregate for initial intentions without issuing a duplicate preview request", async () => {
    mockFetchScreenData.mockResolvedValue({
      errors: {},
      screen: "prayer",
      sections: {
        prayerIntentions: {
          data: [firstIntention],
          meta: { hasMore: false, limit: 10, nextOffset: null, offset: 0 },
        },
      },
    });

    await render(<HolyProgressDashboard />);

    expect(await screen.findByText(firstIntention.title)).toBeTruthy();
    expect(mockFetchScreenData).toHaveBeenCalledWith({ screen: "prayer", selectedMonth: 8, selectedYear: 2026 });
    expect(mockFetchApprovedPrayerIntentions).not.toHaveBeenCalled();
  });

  it("paginates public intentions and preserves all moved intention actions", async () => {
    mockFetchApprovedPrayerIntentions
      .mockResolvedValueOnce({
        data: [firstIntention],
        meta: { hasMore: true, limit: 10, nextOffset: 10, offset: 0 },
      })
      .mockResolvedValueOnce({
        data: [secondIntention],
        meta: { hasMore: false, limit: 10, nextOffset: null, offset: 10 },
      });

    await render(<HolyProgressDashboard />);
    expect(await screen.findByText(firstIntention.title)).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Load more intentions"));
    expect(await screen.findByText(secondIntention.title)).toBeTruthy();
    expect(mockFetchApprovedPrayerIntentions).toHaveBeenNthCalledWith(2, { limit: 10, offset: 10 });

    await fireEvent.press(screen.getByLabelText(`Open ${firstIntention.title}`));
    await fireEvent.press(screen.getByLabelText("Share an intention"));
    await fireEvent.press(screen.getByLabelText("Open my intentions"));
    await fireEvent.press(screen.getByLabelText("See all intentions"));
    await fireEvent.press(screen.getByLabelText("Open Joyful Mysteries"));

    expect(mockPush).toHaveBeenCalledWith({ pathname: "/intention-rosary", params: { intentionId: "intention-1" } });
    expect(mockPush).toHaveBeenCalledWith("/create-prayer-intention");
    expect(mockPush).toHaveBeenCalledWith("/my-prayer-intentions");
    expect(mockPush).toHaveBeenCalledWith("/prayer-intentions");
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/rosary",
      params: { isDecade: "false", mysteryType: "joyful", source: "manual" },
    });
  });

  it("retries global Rosary statistics independently after an error", async () => {
    mockGetGlobalRosaryStats
      .mockRejectedValueOnce(new Error("Network unavailable"))
      .mockResolvedValueOnce({ currentUserContribution: null, totalRosariesPrayed: 28 });

    await render(<HolyProgressDashboard />);

    await fireEvent.press(await screen.findByLabelText("Retry global Rosary statistics"));
    expect(await screen.findByText("Global total 28")).toBeTruthy();
    expect(mockGetGlobalRosaryStats).toHaveBeenCalledTimes(2);
  });

  it("retries weekly and lifetime global leaderboards independently on Home", async () => {
    mockGetWeeklyGlobalLeaderboard
      .mockRejectedValueOnce(new Error("Weekly unavailable"))
      .mockResolvedValueOnce({ currentUserEntry: null, entries: [] });
    mockGetLifetimeGlobalLeaderboard
      .mockRejectedValueOnce(new Error("Lifetime unavailable"))
      .mockResolvedValueOnce({ currentUserEntry: null, entries: [] });

    await render(<HolyProgressDashboard />);

    await fireEvent.press(await screen.findByLabelText("Retry weekly global leaderboard"));
    await fireEvent.press(await screen.findByLabelText("Retry lifetime global leaderboard"));

    expect(mockGetWeeklyGlobalLeaderboard).toHaveBeenCalledTimes(2);
    expect(mockGetLifetimeGlobalLeaderboard).toHaveBeenCalledTimes(2);
  });

  it("ignores a pending global leaderboard response after Home loses focus", async () => {
    const staleWeeklyLeaderboard = { currentUserEntry: null, entries: [], period: { code: "stale-week" } };
    let resolveWeeklyLeaderboard: (value: typeof staleWeeklyLeaderboard) => void = () => undefined;
    mockGetWeeklyGlobalLeaderboard.mockReturnValue(
      new Promise<typeof staleWeeklyLeaderboard>((resolve) => {
        resolveWeeklyLeaderboard = resolve;
      }),
    );

    const rendered = await render(<HolyProgressDashboard />);

    await waitFor(() => expect(mockGetWeeklyGlobalLeaderboard).toHaveBeenCalledTimes(1));
    const cleanup = mockFocusCleanups.find(
      (registeredCleanup) => registeredCleanup.name === "invalidateGlobalLeaderboardRequests",
    );
    expect(cleanup).toBeDefined();

    await act(async () => {
      cleanup?.();
      resolveWeeklyLeaderboard(staleWeeklyLeaderboard);
      await Promise.resolve();
    });

    expect(
      mockLeaderboardCardProps.mock.calls.some(
        ([props]: [{ weeklyLeaderboard?: unknown }]) => props.weeklyLeaderboard === staleWeeklyLeaderboard,
      ),
    ).toBe(false);
    await rendered.unmount();
  });

  it("places the Rosary Garden directly after Plant Today’s Flower", async () => {
    await render(<HolyProgressDashboard />);

    const sections = screen.getByLabelText("Holy Progress Dashboard").props.children;
    expect(sections[2].props.testID).toBe("daily-rosary-card-container");
    expect(sections[3].props.testID).toBe("rosary-garden-section-container");
  });

  it("replaces an unavailable streak card with a male user's journey welcome while retaining progress content", async () => {
    mockGetRosaryReminder.mockRejectedValue(new Error("404"));

    await render(<HolyProgressDashboard />);

    expect(await screen.findByRole("header", { name: "Your journey begins, Mateo!" })).toBeTruthy();
    expect(screen.getByLabelText("Knight companion")).toBeTruthy();
    expect(screen.queryByLabelText("Retry Rosary reminder")).toBeNull();
    expect(screen.getByText("Existing User Progress")).toBeTruthy();
  });

  it("reflows primary cards into columns only when the viewport has room", async () => {
    mockResponsiveLayout.mockReturnValue({
      ...mockResponsiveLayout(),
      contentWidth: 1200,
      height: 900,
      isDesktop: true,
      isLandscape: true,
      isTablet: true,
      size: "desktop",
      width: 1440,
    });

    await render(<HolyProgressDashboard />);

    expect(screen.getByTestId("dashboard-primary-grid").props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ flexDirection: "row" })]),
    );
    expect(StyleSheet.flatten(screen.getByTestId("global-leaderboard-card-container").props.style)).toMatchObject({
      width: "100%",
    });
  });
});
