import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Pressable, Text } from "react-native";

import { NotificationBadgeProvider, useNotificationBadge } from "./NotificationBadgeProvider";

const mockUseAuth = jest.fn();
const mockGetCount = jest.fn();
const mockMarkAll = jest.fn();

jest.mock("@/features/auth", () => ({ useAuth: () => mockUseAuth() }));
jest.mock("./notifications.api", () => ({
  getUnreadNotificationCount: () => mockGetCount(),
  markAllNotificationsRead: () => mockMarkAll(),
}));

/** Shows the badge count and exposes the "seen" action. */
function Probe() {
  const { count, markAllSeen } = useNotificationBadge();
  return (
    <Pressable accessibilityRole="button" onPress={() => void markAllSeen()}>
      <Text>{`count:${count}`}</Text>
    </Pressable>
  );
}

describe("NotificationBadgeProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ session: { user: { id: "u1" } } });
    mockGetCount.mockResolvedValue(4);
    mockMarkAll.mockResolvedValue(undefined);
  });

  it("loads the unread count when signed in", async () => {
    await render(
      <NotificationBadgeProvider>
        <Probe />
      </NotificationBadgeProvider>,
    );

    expect(await screen.findByText("count:4")).toBeTruthy();
  });

  it("resets the count to zero once everything is marked seen", async () => {
    await render(
      <NotificationBadgeProvider>
        <Probe />
      </NotificationBadgeProvider>,
    );
    await screen.findByText("count:4");

    await act(async () => {
      await fireEvent.press(screen.getByRole("button"));
    });

    expect(screen.getByText("count:0")).toBeTruthy();
    expect(mockMarkAll).toHaveBeenCalledTimes(1);
  });

  it("restores the real count when marking as read fails", async () => {
    mockMarkAll.mockRejectedValue(new Error("offline"));
    await render(
      <NotificationBadgeProvider>
        <Probe />
      </NotificationBadgeProvider>,
    );
    await screen.findByText("count:4");

    await fireEvent.press(screen.getByRole("button"));

    await waitFor(() => expect(screen.getByText("count:4")).toBeTruthy());
  });

  it("stays at zero without a session", async () => {
    mockUseAuth.mockReturnValue({ session: null });
    await render(
      <NotificationBadgeProvider>
        <Probe />
      </NotificationBadgeProvider>,
    );

    expect(screen.getByText("count:0")).toBeTruthy();
    expect(mockGetCount).not.toHaveBeenCalled();
  });
});
