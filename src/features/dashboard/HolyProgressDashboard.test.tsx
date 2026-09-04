import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { notifyRosaryCompletionRecorded } from "@/features/prayer/rosary/rosary-completion-events";

import { HolyProgressDashboard } from "./HolyProgressDashboard";

const mockPush = jest.fn();
const mockFetchDashboardProgress = jest.fn();
const mockFetchLevels = jest.fn();
const mockFetchRecentRosaryActivities = jest.fn();
const mockFetchRosaryStats = jest.fn();
const mockGetConscienceQuestion = jest.fn();
const mockGetRosaryReminder = jest.fn();
const mockGetWeeklyGlobalLeaderboard = jest.fn();
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

jest.mock("expo-router", () => {
  const React = jest.requireActual("react") as typeof import("react");
  return {
    useFocusEffect: (effect: () => void | (() => void)) => React.useEffect(effect, [effect]),
    useRouter: () => ({ push: mockPush }),
  };
});

jest.mock("@/features/progress", () => ({
  ...(() => {
    const { Text } = jest.requireActual<typeof import("react-native")>("react-native");
    return {
      EarnedBadgesSection: () => <Text>Dashboard Earned Badges</Text>,
      fetchDashboardProgress: (...args: unknown[]) => mockFetchDashboardProgress(...args),
      fetchLevels: (...args: unknown[]) => mockFetchLevels(...args),
      fetchRecentRosaryActivities: (...args: unknown[]) => mockFetchRecentRosaryActivities(...args),
      fetchRosaryStats: (...args: unknown[]) => mockFetchRosaryStats(...args),
      UserProgressSection: () => <Text>Existing User Progress</Text>,
    };
  })(),
}));

jest.mock("@/features/liturgy/screens", () => {
  const { Text } = jest.requireActual<typeof import("react-native")>("react-native");
  return { DailyLiturgyDashboard: () => <Text>Existing Daily Liturgy</Text> };
});

jest.mock("./dashboard.api", () => ({
  getConscienceQuestion: (...args: unknown[]) => mockGetConscienceQuestion(...args),
  getRosaryReminder: (...args: unknown[]) => mockGetRosaryReminder(...args),
  getWeeklyGlobalLeaderboard: (...args: unknown[]) => mockGetWeeklyGlobalLeaderboard(...args),
}));

jest.mock("@/hooks/useResponsiveLayout", () => ({
  useResponsiveLayout: () => mockResponsiveLayout(),
}));

describe("HolyProgressDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    mockFetchLevels.mockResolvedValue([{ levelNumber: 4, minimumTotalXp: 6000, name: "Faithful" }]);
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
  });

  it("loads the four dashboard sections and refetches authoritative Rosary data after completion", async () => {
    const rendered = await render(<HolyProgressDashboard />);

    expect(await screen.findByLabelText("Rosaries, 86")).toBeTruthy();
    expect(screen.getByText("Did I show mercy?")).toBeTruthy();
    expect(screen.getByText("28 Day Streak")).toBeTruthy();
    expect(screen.getByLabelText("Rank 1, St. Michael, 245 Rosaries")).toBeTruthy();

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
    await rendered.unmount();
  });

  it("uses the existing Rosary route and full leaderboard route", async () => {
    await render(<HolyProgressDashboard />);
    await screen.findByLabelText("Pray Rosary");

    await fireEvent.press(screen.getByLabelText("Pray Rosary"));
    await fireEvent.press(screen.getByLabelText("View leaderboard"));

    expect(mockPush).toHaveBeenCalledWith({ pathname: "/rosary", params: { source: "home-dashboard" } });
    expect(mockPush).toHaveBeenCalledWith("/friends/leaderboard");
  });

  it("renders progress, earned badges, and daily liturgy directly in the dashboard composition", async () => {
    await render(<HolyProgressDashboard />);

    expect(screen.getByText("Existing User Progress")).toBeTruthy();
    expect(screen.getByText("Dashboard Earned Badges")).toBeTruthy();
    expect(screen.getByText("Existing Daily Liturgy")).toBeTruthy();
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
  });
});
