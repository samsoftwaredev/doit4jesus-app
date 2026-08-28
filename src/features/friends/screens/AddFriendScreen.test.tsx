import { fireEvent, render, screen } from "@testing-library/react-native";

import { AddFriendScreen } from "./AddFriendScreen";

jest.mock("expo-router", () => ({ useRouter: () => ({ back: jest.fn(), push: jest.fn(), replace: jest.fn() }) }));
jest.mock("@/features/friends/friends.hooks", () => ({ useFriendSearch: jest.fn(), useSendFriendRequest: jest.fn() }));

const { useFriendSearch, useSendFriendRequest } = jest.requireMock("@/features/friends/friends.hooks") as {
  useFriendSearch: jest.Mock;
  useSendFriendRequest: jest.Mock;
};

describe("AddFriendScreen", () => {
  it("shows username search results and sends a friend request", async () => {
    const send = jest.fn(() => Promise.resolve());
    useFriendSearch.mockReturnValue({
      error: undefined,
      isLoading: false,
      results: [{ avatarUrl: null, relationshipState: "none", title: "Scripture Seeker", username: "johnpaul" }],
    });
    useSendFriendRequest.mockReturnValue({
      error: undefined,
      pendingUsername: undefined,
      requestedUsernames: [],
      send,
    });
    await render(<AddFriendScreen />);

    await fireEvent.press(screen.getByLabelText("Add @johnpaul as a friend"));
    expect(send).toHaveBeenCalledWith("johnpaul");
  });
});
