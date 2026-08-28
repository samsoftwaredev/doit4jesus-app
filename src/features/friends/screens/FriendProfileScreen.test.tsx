import { fireEvent, render, screen } from "@testing-library/react-native";
import { Alert } from "react-native";

import { FriendProfileScreen } from "./FriendProfileScreen";
import { maria } from "./friends.test-utils";

jest.mock("expo-router", () => ({ useRouter: () => ({ back: jest.fn(), push: jest.fn(), replace: jest.fn() }) }));
jest.mock("@/features/friends/friends.api", () => ({ removeFriend: jest.fn() }));
jest.mock("@/features/friends/friends.hooks", () => ({ useFriendProfile: jest.fn() }));

const { useFriendProfile } = jest.requireMock("@/features/friends/friends.hooks") as { useFriendProfile: jest.Mock };

describe("FriendProfileScreen", () => {
  it("renders a friend profile and confirms removal", async () => {
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
    const alertSpy = jest.spyOn(Alert, "alert");
    await render(<FriendProfileScreen friendId="friend-maria" />);

    expect(screen.getByText("TOTAL ROSARIES")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Friend options"));
    await fireEvent.press(screen.getByText("Remove Friend"));
    expect(alertSpy).toHaveBeenCalledWith("Remove friend?", expect.any(String), expect.any(Array));
    alertSpy.mockRestore();
  });
});
