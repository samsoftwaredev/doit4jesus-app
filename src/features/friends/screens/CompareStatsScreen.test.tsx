import { render, screen } from "@testing-library/react-native";

import { CompareStatsScreen } from "./CompareStatsScreen";
import { comparison } from "./friends.test-utils";

jest.mock("expo-router", () => ({ useRouter: () => ({ back: jest.fn(), push: jest.fn(), replace: jest.fn() }) }));
jest.mock("@/features/friends/friends.hooks", () => ({ useFriendsComparison: jest.fn() }));

const { useFriendsComparison } = jest.requireMock("@/features/friends/friends.hooks") as {
  useFriendsComparison: jest.Mock;
};

describe("CompareStatsScreen", () => {
  it("compares only backend-supported friend statistics", async () => {
    useFriendsComparison.mockReturnValue({
      comparison,
      currentUser: comparison.entries[0],
      error: undefined,
      friend: comparison.entries[1],
      isLoading: false,
      reload: jest.fn(),
    });
    await render(<CompareStatsScreen friendId="friend-maria" />);

    expect(screen.getByText("Total Rosaries")).toBeTruthy();
    expect(screen.getByText("120 points to catch up. Every prayer moves you forward.")).toBeTruthy();
  });
});
