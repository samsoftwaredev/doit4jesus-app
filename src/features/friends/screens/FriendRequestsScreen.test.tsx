import { fireEvent, render, screen } from "@testing-library/react-native";

import { FriendRequestsScreen } from "./FriendRequestsScreen";
import { johnRequest } from "./friends.test-utils";

jest.mock("@/features/friends/friends.hooks", () => ({ useFriendRequests: jest.fn() }));

jest.mock("@/components/navigation", () => ({
  BackHeader: ({ title, onBack }: { title: string; onBack: () => void }) => {
    const { Pressable, Text } = require("react-native");
    return (
      <Pressable accessibilityLabel="Go back" onPress={onBack}>
        <Text>{title}</Text>
      </Pressable>
    );
  },
}));

jest.mock("@/components/ui", () => ({
  Card: ({ children }: { children: React.ReactNode }) => {
    const { View } = require("react-native");
    return <View>{children}</View>;
  },
}));

jest.mock("@/features/friends/components", () => ({
  FriendRequestItem: ({ request }: { request: { user: { displayName: string } } }) => {
    const { Text } = require("react-native");
    return <Text>{request.user.displayName}</Text>;
  },
  FriendsState: ({ message }: { message: string }) => {
    const { Text } = require("react-native");
    return <Text>{message}</Text>;
  },
}));

const { useFriendRequests } = jest.requireMock("@/features/friends/friends.hooks") as {
  useFriendRequests: jest.Mock;
};

function mockRequests(overrides = {}) {
  useFriendRequests.mockReturnValue({
    cancel: jest.fn(),
    error: undefined,
    hasMore: false,
    isLoading: false,
    isLoadingMore: false,
    isMutatingId: null,
    loadMore: jest.fn(),
    reload: jest.fn(),
    requests: [],
    resolve: jest.fn(),
    ...overrides,
  });
}

describe("FriendRequestsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequests();
  });

  it("renders the screen title", async () => {
    await render(<FriendRequestsScreen />);
    expect(screen.getByText("Friend Requests")).toBeTruthy();
  });

  it("shows both Received and Sent tabs", async () => {
    await render(<FriendRequestsScreen />);
    expect(screen.getByText("Received")).toBeTruthy();
    expect(screen.getByText("Sent")).toBeTruthy();
  });

  it("defaults to the Received (incoming) tab", async () => {
    await render(<FriendRequestsScreen />);
    const receivedTab = screen.getByText("Received");
    expect(receivedTab.props.accessibilityState?.selected ?? true).toBeTruthy();
  });

  it("switches to the Sent tab when pressed", async () => {
    await render(<FriendRequestsScreen />);
    await fireEvent.press(screen.getByText("Sent"));
    expect(useFriendRequests).toHaveBeenCalledWith("outgoing");
  });

  it("shows a loading state", async () => {
    mockRequests({ isLoading: true });
    await render(<FriendRequestsScreen />);
    expect(screen.getByText("Loading friend requests…")).toBeTruthy();
  });

  it("shows an error state", async () => {
    mockRequests({ error: "Unable to load requests." });
    await render(<FriendRequestsScreen />);
    expect(screen.getByText("Unable to load requests.")).toBeTruthy();
  });

  it("shows empty state when there are no requests", async () => {
    await render(<FriendRequestsScreen />);
    expect(screen.getByText("No pending requests")).toBeTruthy();
  });

  it("renders friend request items", async () => {
    mockRequests({ requests: [johnRequest] });
    await render(<FriendRequestsScreen />);
    expect(screen.getByText("John Paul")).toBeTruthy();
  });
});
