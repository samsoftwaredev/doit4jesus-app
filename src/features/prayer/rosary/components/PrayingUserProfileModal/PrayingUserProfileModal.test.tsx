import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { PrayingUserProfileModal } from "./PrayingUserProfileModal";

const mockPush = jest.fn();
const mockSearchUsers = jest.fn();
const mockSendFriendRequest = jest.fn();

jest.mock("expo-router", () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock("@/features/friends/friends.api", () => ({
  searchUsers: (...args: unknown[]) => mockSearchUsers(...args),
  sendFriendRequest: (...args: unknown[]) => mockSendFriendRequest(...args),
}));

const user = {
  avatarUrl: null,
  countryCode: "MX",
  displayName: "Maria",
  joinedAt: "2026-09-15T10:00:00.000Z",
  saintAvatarId: null,
  title: "Faithful Friend",
  userId: "user-maria",
  username: "maria",
};

describe("PrayingUserProfileModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchUsers.mockResolvedValue({ data: [{ relationshipState: "none", username: "maria" }] });
    mockSendFriendRequest.mockResolvedValue(undefined);
  });

  it("sends a friend request and replaces the action with its pending state", async () => {
    await render(<PrayingUserProfileModal currentUserId="user-me" onClose={jest.fn()} user={user} visible />);

    expect(screen.getByLabelText("Maria's profile image, online and praying")).toBeTruthy();
    await fireEvent.press(await screen.findByRole("button", { name: "Add Maria as a friend" }));
    await waitFor(() => expect(mockSendFriendRequest).toHaveBeenCalledWith("maria"));
    expect(screen.getByRole("button", { name: "Friend request sent to Maria" })).toBeDisabled();
  });

  it("opens the existing profile route when the praying user is already a friend", async () => {
    mockSearchUsers.mockResolvedValue({ data: [{ relationshipState: "friends", username: "maria" }] });
    const onClose = jest.fn();
    await render(<PrayingUserProfileModal currentUserId="user-me" onClose={onClose} user={user} visible />);

    fireEvent.press(await screen.findByRole("button", { name: "View Maria's friend profile" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/friends/user-maria");
  });

  it("does not offer a friendship action on the current user's profile", async () => {
    await render(<PrayingUserProfileModal currentUserId="user-maria" onClose={jest.fn()} user={user} visible />);

    expect(screen.getByText("This is you")).toBeTruthy();
    expect(screen.queryByText("Add Friend")).toBeNull();
    expect(mockSearchUsers).not.toHaveBeenCalled();
  });
});
