import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { FriendProfileScreen } from "./FriendProfileScreen";
import { maria } from "./friends.test-utils";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({ useRouter: () => ({ back: jest.fn(), push: jest.fn(), replace: mockReplace }) }));
jest.mock("@/features/friends/friends.api", () => ({ removeFriend: jest.fn() }));
jest.mock("@/features/friends/friends.hooks", () => ({
  useFriendProfile: jest.fn(),
  useFriendsComparison: jest.fn(),
}));

const { removeFriend } = jest.requireMock("@/features/friends/friends.api") as { removeFriend: jest.Mock };
const { useFriendProfile, useFriendsComparison } = jest.requireMock("@/features/friends/friends.hooks") as {
  useFriendProfile: jest.Mock;
  useFriendsComparison: jest.Mock;
};

describe("FriendProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFriendProfile.mockReturnValue({
      error: undefined,
      friend: {
        badges: [],
        friend: maria,
        progress: { currentLevel: maria.currentLevel, totalXp: maria.totalXp },
        rosaryStreak: maria.rosaryStreak,
        rosaryTotal: maria.rosaryTotal,
      },
      isLoading: false,
      reload: jest.fn(),
    });
    useFriendsComparison.mockReturnValue({
      comparison: { entries: [], period: { periodType: "weekly" } },
      currentUser: {
        badgeCount: 1,
        currentLevel: { levelNumber: 1 },
        periodPoints: 120,
        rosaryStreak: { currentStreak: 3 },
        rosaryTotal: 10,
      },
      error: undefined,
      friend: {
        badgeCount: 2,
        currentLevel: { levelNumber: 2 },
        periodPoints: 240,
        profile: maria,
        rosaryStreak: { currentStreak: 4 },
        rosaryTotal: 12,
      },
      isLoading: false,
      periodType: "weekly",
      reload: jest.fn(),
      setPeriodType: jest.fn(),
    });
    removeFriend.mockResolvedValue(undefined);
  });

  it("renders profile, comparison, and removal in order without obsolete actions", async () => {
    await render(<FriendProfileScreen friendId="friend-maria" />);

    expect(screen.getByText("TOTAL ROSARIES")).toBeTruthy();
    expect(screen.getByRole("header", { name: "Compare Stats" })).toBeTruthy();
    expect(screen.queryByLabelText("Friend options")).toBeNull();
    expect(screen.queryByText("View Profile")).toBeNull();

    const sections = screen.getAllByTestId(/^friend-profile-section-/);
    expect(sections.map((section) => section.props.testID)).toEqual([
      "friend-profile-section-identity",
      "friend-profile-section-stats",
      "friend-profile-section-progress",
      "friend-profile-section-comparison",
      "friend-profile-section-remove",
    ]);
  });

  it("confirms removal in-app and returns to Community after success", async () => {
    await render(<FriendProfileScreen friendId="friend-maria" />);

    await fireEvent.press(screen.getByRole("button", { name: "Remove Friend" }));
    expect(screen.getByRole("header", { name: "Remove friend?" })).toBeTruthy();
    const removeButtons = screen.getAllByRole("button", { name: "Remove Friend" });
    await fireEvent.press(removeButtons[removeButtons.length - 1]);

    await waitFor(() => expect(removeFriend).toHaveBeenCalledWith("friend-maria"));
    expect(mockReplace).toHaveBeenCalledWith("/community");
  });

  it("prevents duplicate removal and keeps failures in the confirmation modal", async () => {
    let rejectRemoval: (error: Error) => void = () => undefined;
    const pendingRemoval = new Promise<void>((_resolve, reject) => {
      rejectRemoval = reject;
    });
    removeFriend.mockReturnValue(pendingRemoval);
    await render(<FriendProfileScreen friendId="friend-maria" />);
    await fireEvent.press(screen.getByRole("button", { name: "Remove Friend" }));
    const removeButtons = screen.getAllByRole("button", { name: "Remove Friend" });

    await fireEvent.press(removeButtons[removeButtons.length - 1]);
    const pendingButtons = screen.getAllByRole("button", { name: "Remove Friend" });
    await fireEvent.press(pendingButtons[pendingButtons.length - 1]);
    expect(removeFriend).toHaveBeenCalledTimes(1);

    await act(async () => {
      rejectRemoval(new Error("Network unavailable"));
      await pendingRemoval.catch(() => undefined);
    });
    expect(screen.getByRole("alert")).toHaveTextContent("Couldn't remove friend");
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
