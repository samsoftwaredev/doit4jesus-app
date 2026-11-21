import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { UserProfileScreen } from "./UserProfileScreen";

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: jest.fn(), push: mockPush, replace: mockReplace }),
}));
jest.mock("@/features/friends/friends.api", () => ({
  acceptFriendRequest: jest.fn(),
  cancelFriendRequest: jest.fn(),
  rejectFriendRequest: jest.fn(),
  sendFriendRequest: jest.fn(),
}));
jest.mock("@/features/friends/friends.hooks", () => ({ useUserProfile: jest.fn() }));

const api = jest.requireMock("@/features/friends/friends.api") as Record<string, jest.Mock>;
const { useUserProfile } = jest.requireMock("@/features/friends/friends.hooks") as { useUserProfile: jest.Mock };

/** Builds the hook result for a profile in the given relationship state. */
function mockProfile(relationshipState: string, requestId: string | null = null) {
  const reload = jest.fn();
  const setProfile = jest.fn();
  useUserProfile.mockReturnValue({
    error: undefined,
    isLoading: false,
    profile: {
      badges: [],
      progress: { currentLevel: { code: null, levelNumber: 2, name: "Seeker" }, totalXp: 120 },
      relationshipState,
      requestId,
      rosaryTotal: 14,
      user: {
        avatarUrl: null,
        countryCode: "US",
        displayName: "Maria Santos",
        id: "user-maria",
        title: "Prayer Champion",
        username: "maria",
      },
    },
    reload,
    setProfile,
  });
  return { reload, setProfile };
}

describe("UserProfileScreen", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage("en");
  });

  it("shows profile details and sends a friend request for a non-friend", async () => {
    const { reload } = mockProfile("none");
    api.sendFriendRequest.mockResolvedValue(undefined);

    await render(<UserProfileScreen username="maria" />);

    expect(screen.getByText("Maria Santos")).toBeTruthy();
    expect(screen.getByText("@maria")).toBeTruthy();
    expect(screen.getByText("14")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Send friend request" }));

    await waitFor(() => expect(api.sendFriendRequest).toHaveBeenCalledWith("maria"));
    await waitFor(() => expect(reload).toHaveBeenCalled());
  });

  it("does not send a friend request until the button is pressed", async () => {
    mockProfile("none");
    await render(<UserProfileScreen username="maria" />);

    expect(screen.getByRole("button", { name: "Send friend request" })).toBeTruthy();
    expect(api.sendFriendRequest).not.toHaveBeenCalled();
  });

  it("only offers to send a request when there is no existing relationship", async () => {
    mockProfile("friends");
    await render(<UserProfileScreen username="maria" />);

    expect(screen.queryByRole("button", { name: "Send friend request" })).toBeNull();
  });

  it("lets the user accept an incoming request from the profile", async () => {
    const { setProfile } = mockProfile("incomingPending", "request-9");
    api.acceptFriendRequest.mockResolvedValue(undefined);

    await render(<UserProfileScreen username="maria" />);
    await fireEvent.press(screen.getByRole("button", { name: "Accept" }));

    await waitFor(() => expect(api.acceptFriendRequest).toHaveBeenCalledWith("request-9"));
    expect(setProfile).toHaveBeenCalledWith(expect.objectContaining({ relationshipState: "friends" }));
  });

  it("cancels an outgoing request", async () => {
    const { setProfile } = mockProfile("outgoingPending", "request-3");
    api.cancelFriendRequest.mockResolvedValue(undefined);

    await render(<UserProfileScreen username="maria" />);
    expect(screen.getByText("Requested")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Cancel request" }));

    await waitFor(() => expect(api.cancelFriendRequest).toHaveBeenCalledWith("request-3"));
    expect(setProfile).toHaveBeenCalledWith(expect.objectContaining({ relationshipState: "none", requestId: null }));
  });

  it("links existing friends to the full friend profile", async () => {
    mockProfile("friends");

    await render(<UserProfileScreen username="maria" />);
    await fireEvent.press(screen.getByRole("button", { name: "View friend profile" }));

    expect(mockReplace).toHaveBeenCalledWith({
      pathname: "/friends/[friendId]",
      params: { friendId: "user-maria" },
    });
  });

  it("shows an error when the friend request fails", async () => {
    mockProfile("none");
    api.sendFriendRequest.mockRejectedValue(new Error("boom"));

    await render(<UserProfileScreen username="maria" />);
    await fireEvent.press(screen.getByRole("button", { name: "Send friend request" }));

    expect(await screen.findByRole("alert")).toBeTruthy();
  });
});
