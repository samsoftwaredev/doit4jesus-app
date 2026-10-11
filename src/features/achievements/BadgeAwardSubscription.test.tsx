import { act, render, screen, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";

import { AchievementProvider, useAchievement } from "./AchievementProvider";
import { BadgeAwardSubscription } from "./BadgeAwardSubscription";

const mockChannel = { on: jest.fn(), subscribe: jest.fn() };
const mockRemoveChannel = jest.fn();
const mockCreateChannel = jest.fn((_topic: string) => mockChannel);
const mockFetchBadgeCatalog = jest.fn();
let badgeAwardCallback: ((payload: { new: unknown }) => void) | undefined;
let mockSession: { user: { id: string } } | null = { user: { id: "user-me" } };

jest.mock("@/features/auth", () => ({ useAuth: () => ({ session: mockSession }) }));
jest.mock("@/features/progress/progress.api", () => ({ fetchBadgeCatalog: () => mockFetchBadgeCatalog() }));
jest.mock("@/lib/supabase", () => ({
  supabase: {
    channel: (topic: string) => mockCreateChannel(topic),
    removeChannel: (channel: unknown) => mockRemoveChannel(channel),
  },
}));

/** Exposes the current queued achievement to the subscription test. */
function AchievementProbe() {
  const { achievement } = useAchievement();
  return <Text>{achievement?.type === "badge-award" ? achievement.badge.name : "No award"}</Text>;
}

/** Renders the authenticated subscription with the global achievement provider. */
function renderSubscription() {
  return render(
    <AchievementProvider>
      <BadgeAwardSubscription />
      <AchievementProbe />
    </AchievementProvider>,
  );
}

describe("BadgeAwardSubscription", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    badgeAwardCallback = undefined;
    mockSession = { user: { id: "user-me" } };
    mockChannel.on.mockImplementation((_type, _filter, callback) => {
      badgeAwardCallback = callback;
      return mockChannel;
    });
    mockChannel.subscribe.mockReturnValue(mockChannel);
    mockRemoveChannel.mockResolvedValue("ok");
    mockFetchBadgeCatalog.mockResolvedValue([
      {
        code: "FIRST_ROSARY",
        iconUrl: "https://example.com/first-rosary.png",
        id: "badge-1",
        name: "First Rosary",
      },
    ]);
  });

  it("subscribes to the signed-in user's badge inserts and queues the matching badge", async () => {
    await renderSubscription();

    expect(mockCreateChannel).toHaveBeenCalledWith("badge-awards:user-me");
    expect(mockChannel.on).toHaveBeenCalledWith(
      "postgres_changes",
      { event: "INSERT", filter: "user_id=eq.user-me", schema: "competition", table: "user_badges" },
      expect.any(Function),
    );

    await act(async () => {
      badgeAwardCallback?.({
        new: {
          badge_id: "badge-1",
          earned_at: "2026-10-10T12:00:00.000Z",
          id: "award-1",
          is_featured: false,
          metadata: {},
          sequence_number: 1,
          source_id: null,
          source_type: null,
          user_id: "user-me",
        },
      });
    });

    await waitFor(() => expect(mockFetchBadgeCatalog).toHaveBeenCalledTimes(1));
    expect(await screen.findByText("First Rosary")).toBeTruthy();
  });

  it("does not queue a toast when the inserted row is malformed or cannot be resolved", async () => {
    await renderSubscription();

    await act(async () => {
      badgeAwardCallback?.({ new: { badge_id: "badge-1" } });
    });
    expect(screen.getByText("No award")).toBeTruthy();

    mockFetchBadgeCatalog.mockResolvedValueOnce([]);
    await act(async () => {
      badgeAwardCallback?.({
        new: {
          badge_id: "missing-badge",
          earned_at: "2026-10-10T12:00:00.000Z",
          id: "award-2",
          is_featured: false,
          metadata: {},
          sequence_number: 2,
          source_id: null,
          source_type: null,
          user_id: "user-me",
        },
      });
    });

    await waitFor(() => expect(mockFetchBadgeCatalog).toHaveBeenCalledTimes(1));
    expect(screen.getByText("No award")).toBeTruthy();
  });

  it("removes its channel when the authenticated subscription unmounts", async () => {
    const view = await renderSubscription();

    await act(async () => {
      view.unmount();
    });

    expect(mockRemoveChannel).toHaveBeenCalledWith(mockChannel);
  });
});
