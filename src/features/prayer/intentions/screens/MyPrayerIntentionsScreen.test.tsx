import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { MyPrayerIntentionsScreen } from "./MyPrayerIntentionsScreen";

const mockBack = jest.fn();
const mockFetchMyPrayerIntentions = jest.fn();
const mockPush = jest.fn();
const mockSubscribeToMyPrayerIntentionsInvalidation = jest.fn();

jest.mock("expo-router", () => ({ useRouter: () => ({ back: mockBack, push: mockPush }) }));
jest.mock("@/components/navigation", () => ({
  BackHeader: ({ title, rightAction }: { title: string; rightAction?: React.ReactNode }) => {
    // The mocked module must load React Native within Jest's module factory.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text, View } = require("react-native");
    return (
      <View>
        <Text>{title}</Text>
        {rightAction}
      </View>
    );
  },
}));
jest.mock("@/features/prayer/intentions", () => ({
  fetchMyPrayerIntentions: (...args: unknown[]) => mockFetchMyPrayerIntentions(...args),
  getPrayerIntentionTheme: () => ({ icon: "heart", surface: "#15364F", surfaceLight: "#4C7895" }),
  subscribeToMyPrayerIntentionsInvalidation: (...args: unknown[]) =>
    mockSubscribeToMyPrayerIntentionsInvalidation(...args),
}));

const visibleIntention = {
  createdAt: "2026-08-01T00:00:00.000Z",
  description: "Please pray for their healing.",
  expiresAt: null,
  id: "intention-visible",
  reviewedAt: "2026-08-02T00:00:00.000Z",
  status: "visible" as const,
  symbol: "candle",
  title: "Healing for Maria",
};
const pendingIntention = {
  ...visibleIntention,
  id: "intention-pending",
  status: "pending" as const,
  title: "A new job",
};
const emptyPage = { data: [], meta: { hasMore: false, limit: 20, nextOffset: null, offset: 0 } };

describe("MyPrayerIntentionsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchMyPrayerIntentions.mockResolvedValue(emptyPage);
    mockSubscribeToMyPrayerIntentionsInvalidation.mockReturnValue(jest.fn());
  });

  it("renders submitted intentions, loads more, filters them, and opens visible activity", async () => {
    mockFetchMyPrayerIntentions
      .mockResolvedValueOnce({
        data: [visibleIntention, pendingIntention],
        meta: { hasMore: true, limit: 20, nextOffset: 20, offset: 0 },
      })
      .mockResolvedValueOnce({
        data: [{ ...pendingIntention, id: "intention-second", title: "A parish intention" }],
        meta: { hasMore: false, limit: 20, nextOffset: null, offset: 20 },
      })
      .mockResolvedValueOnce(emptyPage);

    const rendered = await render(<MyPrayerIntentionsScreen />);

    expect(await rendered.findByText("Healing for Maria")).toBeTruthy();
    expect(rendered.getByText("Approved / Visible")).toBeTruthy();
    expect(rendered.getAllByText("Pending review")).toHaveLength(2);

    await fireEvent.press(rendered.getByRole("button", { name: "View prayer activity for Healing for Maria" }));
    expect(mockPush).toHaveBeenCalledWith({
      params: { intentionId: "intention-visible" },
      pathname: "/prayer-intention-prayers",
    });

    await fireEvent.press(rendered.getByText("Load more"));
    await waitFor(() =>
      expect(mockFetchMyPrayerIntentions).toHaveBeenLastCalledWith({ limit: 20, offset: 20, status: "all" }),
    );

    await fireEvent.press(rendered.getByText("Not approved"));
    expect(await rendered.findByText("No Not approved intentions.")).toBeTruthy();
    expect(mockFetchMyPrayerIntentions).toHaveBeenLastCalledWith({ limit: 20, offset: 0, status: "rejected" });
    rendered.unmount();
  });

  it("shows an error, retries, and supports creating a prayer intention", async () => {
    mockFetchMyPrayerIntentions.mockRejectedValueOnce(new Error("Offline")).mockResolvedValueOnce(emptyPage);

    const rendered = await render(<MyPrayerIntentionsScreen />);

    expect(await rendered.findByText("Couldn't load your prayer intentions.")).toBeTruthy();
    await fireEvent.press(rendered.getByText("Try Again"));
    expect(await rendered.findByText("You haven&apos;t submitted any prayer intentions.")).toBeTruthy();

    await fireEvent.press(rendered.getByRole("button", { name: "Share a prayer intention" }));
    expect(mockPush).toHaveBeenCalledWith("/create-prayer-intention");
  });
});
