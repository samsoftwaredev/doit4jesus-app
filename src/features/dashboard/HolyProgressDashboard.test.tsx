import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { notifyRosaryCompletionRecorded } from "@/features/prayer/rosary/rosary-completion-events";

import { HolyProgressDashboard } from "./HolyProgressDashboard";

const mockPush = jest.fn();
const mockFetchDashboardProgress = jest.fn();
const mockFetchRosaryStats = jest.fn();
const mockGetConscienceQuestion = jest.fn();
const mockGetRosaryReminder = jest.fn();
const mockGetWeeklyGlobalLeaderboard = jest.fn();

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
      fetchDashboardProgress: (...args: unknown[]) => mockFetchDashboardProgress(...args),
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

describe("HolyProgressDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchDashboardProgress.mockResolvedValue({
      currentLevel: { levelNumber: 3, name: "Disciple" },
      lifetimePoints: 4320,
    });
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
    await fireEvent.press(screen.getByLabelText("View full leaderboard"));

    expect(mockPush).toHaveBeenCalledWith({ pathname: "/rosary", params: { source: "home-dashboard" } });
    expect(mockPush).toHaveBeenCalledWith("/friends/leaderboard");
  });

  it("renders the existing progress and daily liturgy sections after the primary dashboard cards", async () => {
    await render(<HolyProgressDashboard />);

    expect(screen.getByText("Existing User Progress")).toBeTruthy();
    expect(screen.getByText("Existing Daily Liturgy")).toBeTruthy();
  });
});
