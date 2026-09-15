import { fireEvent, render, screen } from "@testing-library/react-native";

import { RosaryPresence } from "./RosaryPresence";

const mockUseRosaryPresence = jest.fn();
const mockPrayingUsersModal = jest.fn((_props: unknown) => null);
const mockPrayingUserProfileModal = jest.fn((_props: unknown) => null);

jest.mock("@/features/prayer/rosary/hooks/useRosaryPresence", () => ({
  useRosaryPresence: () => mockUseRosaryPresence(),
}));
jest.mock("../PrayingUsersModal", () => ({
  PrayingUsersModal: (props: unknown) => mockPrayingUsersModal(props),
}));
jest.mock("../PrayingUserProfileModal", () => ({
  PrayingUserProfileModal: (props: unknown) => mockPrayingUserProfileModal(props),
}));

const users = [
  {
    avatarUrl: null,
    countryCode: "US",
    displayName: "Samuel",
    joinedAt: "2026-09-15T10:00:00.000Z",
    saintAvatarId: null,
    title: null,
    userId: "user-me",
    username: "samuel",
  },
  ...Array.from({ length: 4 }, (_, index) => ({
    avatarUrl: null,
    countryCode: null,
    displayName: `Person ${index + 1}`,
    joinedAt: `2026-09-15T10:0${index + 1}:00.000Z`,
    saintAvatarId: null,
    title: null,
    userId: `user-${index + 1}`,
    username: `person${index + 1}`,
  })),
];

describe("RosaryPresence", () => {
  beforeEach(() => {
    mockUseRosaryPresence.mockReturnValue({ connectionState: "connected", currentUserId: "user-me", users });
  });

  it("shows at most three other avatars and opens the complete list from the count", async () => {
    await render(<RosaryPresence />);

    expect(screen.getByRole("button", { name: "View Person 1's prayer profile, online and praying" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "View Person 3's prayer profile, online and praying" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "View Person 4's prayer profile, online and praying" })).toBeNull();
    expect(screen.getByText("5 praying")).toBeTruthy();
    expect(screen.getByLabelText("5 people praying now")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "View all 5 people praying now" }));
    expect(mockPrayingUsersModal).toHaveBeenLastCalledWith(expect.objectContaining({ visible: true }));
  });

  it("opens a quick profile from an avatar and uses singular copy when alone", async () => {
    const rendered = await render(<RosaryPresence />);
    await fireEvent.press(screen.getByRole("button", { name: "View Person 1's prayer profile, online and praying" }));
    expect(mockPrayingUserProfileModal).toHaveBeenLastCalledWith(
      expect.objectContaining({ user: expect.objectContaining({ displayName: "Person 1" }), visible: true }),
    );

    mockUseRosaryPresence.mockReturnValue({
      connectionState: "connected",
      currentUserId: "user-me",
      users: [users[0]],
    });
    await rendered.rerender(<RosaryPresence />);
    expect(screen.getByText("You’re praying now")).toBeTruthy();
  });
});
