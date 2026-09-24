import { act, renderHook, waitFor } from "@testing-library/react-native";
import { AppState } from "react-native";

import { useRosaryPresence } from "./useRosaryPresence";

const mockChannel = {
  on: jest.fn(),
  presenceState: jest.fn(),
  subscribe: jest.fn(),
  track: jest.fn(),
  untrack: jest.fn(),
};
const mockRemoveChannel = jest.fn();
const mockCreateChannel = jest.fn((_topic: string, _options: unknown) => mockChannel);
let presenceSync: (() => void) | undefined;
let appStateCallback: ((state: string) => void) | undefined;

jest.mock("@/features/auth", () => ({
  useAuth: () => ({ session: { user: { id: "user-me" } } }),
}));
jest.mock("@/features/profile/profile-provider", () => ({
  useCurrentProfile: () => ({
    profile: {
      avatarUrl: "https://example.com/me.png",
      countryCode: "US",
      displayName: "St. Joseph",
      profileSetup: { complete: true },
      saintAvatarId: null,
      title: "Prayer Warrior",
      userId: "user-me",
      username: "st_joseph",
    },
  }),
}));
jest.mock("@/lib/supabase", () => ({
  supabase: {
    channel: (topic: string, options: unknown) => mockCreateChannel(topic, options),
    removeChannel: (...args: unknown[]) => mockRemoveChannel(...args),
  },
}));

describe("useRosaryPresence", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    presenceSync = undefined;
    appStateCallback = undefined;
    mockChannel.on.mockImplementation((_type, _filter, callback) => {
      presenceSync = callback;
      return mockChannel;
    });
    mockChannel.subscribe.mockImplementation((callback) => {
      callback("SUBSCRIBED");
      return mockChannel;
    });
    mockChannel.track.mockResolvedValue("ok");
    mockChannel.untrack.mockResolvedValue("ok");
    mockChannel.presenceState.mockReturnValue({});
    mockRemoveChannel.mockResolvedValue("ok");
    jest.spyOn(AppState, "addEventListener").mockImplementation((_type, callback) => {
      appStateCallback = callback as (state: string) => void;
      return { remove: jest.fn() };
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("tracks the current profile and syncs one user per account", async () => {
    mockChannel.presenceState.mockReturnValue({
      "user-friend": [
        {
          avatarUrl: null,
          countryCode: "MX",
          displayName: "Maria",
          joinedAt: "2026-09-15T10:00:00.000Z",
          title: null,
          userId: "user-friend",
          username: "maria",
        },
        {
          avatarUrl: "https://example.com/maria.png",
          countryCode: "MX",
          displayName: "Maria",
          joinedAt: "2026-09-15T10:05:00.000Z",
          title: "Faithful Friend",
          userId: "user-friend",
          username: "maria",
        },
      ],
      "user-invalid": [{ displayName: "Missing fields" }],
      "user-me": [
        {
          avatarUrl: "https://example.com/me.png",
          countryCode: "US",
          displayName: "St. Joseph",
          joinedAt: "2026-09-15T10:01:00.000Z",
          title: "Prayer Warrior",
          userId: "user-me",
          username: "st_joseph",
        },
      ],
    });

    const presence = await renderHook(() => useRosaryPresence());

    await waitFor(() => expect(mockChannel.track).toHaveBeenCalledWith(expect.objectContaining({ userId: "user-me" })));
    expect(mockCreateChannel).toHaveBeenCalledWith("rosary-prayer", {
      config: { presence: { enabled: true, key: "user-me" } },
    });
    await act(async () => {
      presenceSync?.();
    });

    await waitFor(() => expect(presence.result.current.connectionState).toBe("connected"));
    expect(presence.result.current.currentUserId).toBe("user-me");
    expect(presence.result.current.users).toEqual([
      expect.objectContaining({ avatarUrl: "https://example.com/maria.png", userId: "user-friend" }),
      expect.objectContaining({ userId: "user-me" }),
    ]);
  });

  it("untracks in the background, retracks when active, and removes the channel on unmount", async () => {
    const presence = await renderHook(() => useRosaryPresence());
    await waitFor(() => expect(mockChannel.track).toHaveBeenCalledTimes(1));

    await act(async () => {
      appStateCallback?.("background");
    });
    expect(mockChannel.untrack).toHaveBeenCalledTimes(1);

    await act(async () => {
      appStateCallback?.("active");
    });
    expect(mockChannel.track).toHaveBeenCalledTimes(2);

    await act(async () => presence.unmount());
    await waitFor(() => expect(mockRemoveChannel).toHaveBeenCalledWith(mockChannel));
  });
});
