import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { PrayingUsersModal } from "./PrayingUsersModal";

const mockGetFriends = jest.fn();

jest.mock("@/features/friends/friends.api", () => ({
  getFriends: (...args: unknown[]) => mockGetFriends(...args),
}));

const makeUser = (id: string, displayName: string) => ({
  avatarUrl: null,
  countryCode: null,
  displayName,
  joinedAt: "2026-09-15T10:00:00.000Z",
  saintAvatarId: null,
  title: null,
  userId: id,
  username: displayName.toLowerCase().replaceAll(" ", "_"),
});

describe("PrayingUsersModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetFriends.mockResolvedValue({
      data: [{ id: "friend-1" }],
      meta: { hasMore: false, nextOffset: null },
    });
  });

  it("orders the current user first, followed by friends and then everyone else", async () => {
    const onSelectUser = jest.fn();
    await render(
      <PrayingUsersModal
        currentUserId="user-me"
        onClose={jest.fn()}
        onSelectUser={onSelectUser}
        users={[makeUser("stranger-1", "Aaron"), makeUser("user-me", "St. Joseph"), makeUser("friend-1", "Zoe")]}
        visible
      />,
    );

    await waitFor(() => expect(screen.getByText("Friend")).toBeTruthy());
    expect(screen.getByLabelText("Zoe's profile image, online and praying")).toBeTruthy();
    const rows = screen.getAllByRole("button").filter((button) => button.props.accessibilityLabel?.includes("profile"));
    expect(rows.map((row) => row.props.accessibilityLabel)).toEqual([
      "View your prayer profile, online and praying",
      "View Zoe's prayer profile, online and praying",
      "View Aaron's prayer profile, online and praying",
    ]);

    fireEvent.press(screen.getByRole("button", { name: "View Zoe's prayer profile, online and praying" }));
    expect(onSelectUser).toHaveBeenCalledWith(expect.objectContaining({ userId: "friend-1" }), true);
  });

  it("reveals live users twenty at a time as the list reaches its end", async () => {
    const manyUsers = [makeUser("user-me", "St. Joseph")].concat(
      Array.from({ length: 20 }, (_, index) => makeUser(`user-${index}`, `Person ${String(index).padStart(2, "0")}`)),
    );
    await render(
      <PrayingUsersModal
        currentUserId="user-me"
        onClose={jest.fn()}
        onSelectUser={jest.fn()}
        users={manyUsers}
        visible
      />,
    );

    await waitFor(() => expect(screen.getByTestId("praying-users-list").props.data).toHaveLength(20));
    fireEvent(screen.getByTestId("praying-users-list"), "onEndReached");
    await waitFor(() => expect(screen.getByTestId("praying-users-list").props.data).toHaveLength(21));
  });

  it("keeps the list usable and offers retry when friends cannot be loaded", async () => {
    mockGetFriends.mockRejectedValueOnce(new Error("offline"));
    await render(
      <PrayingUsersModal
        currentUserId="user-me"
        onClose={jest.fn()}
        onSelectUser={jest.fn()}
        users={[makeUser("user-me", "St. Joseph"), makeUser("stranger-1", "Maria")]}
        visible
      />,
    );

    expect(await screen.findByText(/Friends could not be identified/)).toBeTruthy();
    expect(screen.getByText("Maria")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Retry friend ordering" })).toBeTruthy();
  });
});
