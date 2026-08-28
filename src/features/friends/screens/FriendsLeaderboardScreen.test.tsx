import { fireEvent, render, screen } from "@testing-library/react-native";

import { FriendsLeaderboardScreen } from "./FriendsLeaderboardScreen";
import { leaderboard } from "./friends.test-utils";

jest.mock("expo-router", () => ({ useRouter: () => ({ back: jest.fn(), push: jest.fn(), replace: jest.fn() }) }));
jest.mock("@/features/friends/friends.hooks", () => ({ useRosaryLeaderboard: jest.fn() }));

const { useRosaryLeaderboard } = jest.requireMock("@/features/friends/friends.hooks") as {
  useRosaryLeaderboard: jest.Mock;
};

describe("FriendsLeaderboardScreen", () => {
  it("switches leaderboard periods and highlights the current user", async () => {
    const setPeriodType = jest.fn();
    useRosaryLeaderboard.mockReturnValue({
      error: undefined,
      isLoading: false,
      isLoadingMore: false,
      leaderboard,
      loadMore: jest.fn(),
      periodType: "weekly",
      reload: jest.fn(),
      setPeriodType,
    });
    await render(<FriendsLeaderboardScreen />);

    await fireEvent.press(screen.getByText("This Month"));
    expect(setPeriodType).toHaveBeenCalledWith("monthly");
    expect(screen.getByLabelText(/Samuel Ruiz.*You/i)).toBeTruthy();
    expect(screen.getByText("120 more points to reach #1")).toBeTruthy();
  });
});
