import { fireEvent, render, screen } from "@testing-library/react-native";
import { Share } from "react-native";

import { i18n } from "@/localization";

import { AddFriendScreen } from "./AddFriendScreen";

jest.mock("expo-router", () => ({ useRouter: () => ({ back: jest.fn(), push: jest.fn(), replace: jest.fn() }) }));
jest.mock("@/features/friends/friends.hooks", () => ({ useFriendSearch: jest.fn(), useSendFriendRequest: jest.fn() }));

const { useFriendSearch, useSendFriendRequest } = jest.requireMock("@/features/friends/friends.hooks") as {
  useFriendSearch: jest.Mock;
  useSendFriendRequest: jest.Mock;
};

describe("AddFriendScreen", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("opens the native share sheet with the public invite link", async () => {
    const share = jest.spyOn(Share, "share").mockResolvedValue({ action: Share.sharedAction });
    useFriendSearch.mockReturnValue({ error: undefined, isLoading: false, results: [] });
    useSendFriendRequest.mockReturnValue({
      error: undefined,
      pendingUsername: undefined,
      requestedUsernames: [],
      send: jest.fn(),
    });

    await render(<AddFriendScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Invite a friend" }));

    expect(share).toHaveBeenCalledWith({
      message:
        "Join me on Do It 4 Jesus! Grow in faith, pray together, and encourage one another.\nhttps://www.doitforjesus.com",
    });
  });

  it("localizes the invite action and shared message in Spanish", async () => {
    const share = jest.spyOn(Share, "share").mockResolvedValue({ action: Share.sharedAction });
    await i18n.changeLanguage("es");
    useFriendSearch.mockReturnValue({ error: undefined, isLoading: false, results: [] });
    useSendFriendRequest.mockReturnValue({
      error: undefined,
      pendingUsername: undefined,
      requestedUsernames: [],
      send: jest.fn(),
    });

    await render(<AddFriendScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Invitar a un amigo" }));

    expect(share).toHaveBeenCalledWith({
      message:
        "¡Únete conmigo en Do It 4 Jesus! Crezcamos en la fe, oremos juntos y animémonos mutuamente.\nhttps://www.doitforjesus.com",
    });
  });

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
