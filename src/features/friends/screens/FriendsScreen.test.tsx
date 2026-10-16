import { fireEvent, render, screen } from "@testing-library/react-native";

import { FriendsScreen } from "./FriendsScreen";
import { johnRequest, leaderboard, maria, mockFriendsDashboard } from "./friends.test-utils";

const mockPush = jest.fn();
const mockGetWeeklyGlobalLeaderboard = jest.fn();
const mockGetYearlyGlobalLeaderboard = jest.fn();

jest.mock("expo-router", () => {
  const React = jest.requireActual("react") as typeof import("react");
  return {
    useFocusEffect: (effect: () => void | (() => void)) => React.useEffect(effect, [effect]),
    useRouter: () => ({ back: jest.fn(), push: mockPush, replace: jest.fn() }),
  };
});
jest.mock("@/features/dashboard/dashboard.api", () => ({
  getWeeklyGlobalLeaderboard: (...args: unknown[]) => mockGetWeeklyGlobalLeaderboard(...args),
  getYearlyGlobalLeaderboard: (...args: unknown[]) => mockGetYearlyGlobalLeaderboard(...args),
}));
jest.mock("@/features/dashboard/components", () => {
  const { Pressable, Text } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    LeaderboardCard: ({ onRetryWeekly, weeklyError }: { onRetryWeekly: () => void; weeklyError: boolean }) => (
      <>
        <Text>Global Leaderboards</Text>
        {weeklyError ? (
          <Pressable accessibilityLabel="Retry weekly global leaderboard" onPress={onRetryWeekly}>
            <Text>Weekly global leaderboard unavailable</Text>
          </Pressable>
        ) : null}
      </>
    ),
  };
});
jest.mock("@/features/friends/friends.hooks", () => ({
  useFriendProfile: jest.fn(),
  useFriendRequests: jest.fn(),
  useFriendSearch: jest.fn(),
  useFriends: jest.fn(),
  useFriendsComparison: jest.fn(),
  useRosaryLeaderboard: jest.fn(),
  useSendFriendRequest: jest.fn(),
}));

const hooks = jest.requireMock("@/features/friends/friends.hooks") as Record<string, jest.Mock>;

describe("FriendsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFriendsDashboard(hooks);
    mockGetWeeklyGlobalLeaderboard.mockResolvedValue([]);
    mockGetYearlyGlobalLeaderboard.mockResolvedValue([]);
  });

  it("renders friends, points, rank, and requests", async () => {
    await render(<FriendsScreen />);

    expect(screen.getByText("Community")).toBeTruthy();
    expect(screen.getByText("Compete with one another in prayer.")).toBeTruthy();
    expect(screen.getByText("LEADERBOARD")).toBeTruthy();
    expect(screen.getByText("240")).toBeTruthy();
    expect(screen.getByText("Virgin Mary (You)")).toBeTruthy();
    expect(screen.getByText("John Paul")).toBeTruthy();
    expect(screen.getByText("Your friends")).toBeTruthy();
    expect(await screen.findByText("Global Leaderboards")).toBeTruthy();
    expect(mockGetWeeklyGlobalLeaderboard).toHaveBeenCalledTimes(1);
    expect(mockGetYearlyGlobalLeaderboard).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("community-section-global-leaderboard")).toBeTruthy();
  });

  it("renders the loading state", async () => {
    mockFriendsDashboard(hooks, { friends: [], isLoading: true });
    hooks.useRosaryLeaderboard.mockReturnValue({ isLoading: true });
    hooks.useFriendRequests.mockReturnValue({ isLoading: true });
    await render(<FriendsScreen />);
    expect(screen.getAllByText(/Loading/i).length).toBeGreaterThan(0);
  });

  it("renders the empty friends state", async () => {
    mockFriendsDashboard(hooks, { friends: [] });
    await render(<FriendsScreen />);
    expect(screen.getByText("Your fellowship begins here")).toBeTruthy();
  });

  it("opens friend search from the leaderboard CTA", async () => {
    await render(<FriendsScreen />);

    fireEvent.press(screen.getByRole("button", { name: "Add Friends" }));
    expect(mockPush).toHaveBeenCalledWith("/friends/add");
  });

  it("renders a leaderboard error without hiding the screen", async () => {
    mockFriendsDashboard(hooks);
    hooks.useRosaryLeaderboard.mockReturnValue({ error: "Network unavailable", isLoading: false });
    await render(<FriendsScreen />);
    expect(screen.getByText("Couldn't load the leaderboard")).toBeTruthy();
  });

  it("retries a failed weekly global leaderboard without reloading Community", async () => {
    mockGetWeeklyGlobalLeaderboard.mockRejectedValueOnce(new Error("Network unavailable")).mockResolvedValueOnce([]);

    await render(<FriendsScreen />);

    await fireEvent.press(await screen.findByLabelText("Retry weekly global leaderboard"));

    expect(mockGetWeeklyGlobalLeaderboard).toHaveBeenCalledTimes(2);
  });

  it("accepts and declines incoming friend requests", async () => {
    const friendsReload = jest.fn(() => Promise.resolve());
    const leaderboardReload = jest.fn(() => Promise.resolve());
    const resolve = jest.fn(() => Promise.resolve());
    hooks.useFriends.mockReturnValue({
      error: undefined,
      friends: [maria],
      hasMore: false,
      isLoading: false,
      isLoadingMore: false,
      loadMore: jest.fn(),
      reload: friendsReload,
    });
    hooks.useRosaryLeaderboard.mockReturnValue({
      error: undefined,
      isLoading: false,
      isLoadingMore: false,
      leaderboard,
      loadMore: jest.fn(),
      periodType: "weekly",
      reload: leaderboardReload,
      setPeriodType: jest.fn(),
    });
    hooks.useFriendRequests.mockReturnValue({
      error: undefined,
      isLoading: false,
      isMutatingId: undefined,
      reload: jest.fn(),
      requests: [johnRequest],
      resolve,
    });
    await render(<FriendsScreen />);

    await fireEvent.press(screen.getByLabelText("Accept friend request from John Paul"));
    expect(resolve).toHaveBeenCalledWith(johnRequest, "accepted");
    expect(friendsReload).toHaveBeenCalledTimes(1);
    expect(leaderboardReload).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByLabelText("Decline friend request from John Paul"));
    expect(resolve).toHaveBeenCalledWith(johnRequest, "rejected");
  });
});
