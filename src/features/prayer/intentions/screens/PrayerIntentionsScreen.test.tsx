/* eslint-disable @typescript-eslint/no-require-imports -- Jest mock factories load modules lazily. */
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { PrayerIntentionsScreen } from "./PrayerIntentionsScreen";

jest.mock("@/features/prayer/intentions", () => ({
  cacheApprovedPrayerIntentions: jest.fn(),
  fetchApprovedPrayerIntentions: jest.fn(),
  getPrayerIntentionTheme: jest.fn(() => ({ icon: "heart", surface: "#15364F", surfaceLight: "#4C7895" })),
}));

jest.mock("@/components/navigation", () => ({
  BackHeader: ({
    description,
    title,
    rightAction,
  }: {
    description: string;
    title: string;
    rightAction?: React.ReactNode;
  }) => {
    const { Text, View } = require("react-native");
    return (
      <View>
        <Text>{title}</Text>
        <Text>{description}</Text>
        {rightAction}
      </View>
    );
  },
}));

const { fetchApprovedPrayerIntentions } = jest.requireMock("@/features/prayer/intentions") as {
  fetchApprovedPrayerIntentions: jest.Mock;
};

const mockIntention = {
  approvedAt: "2026-08-01T00:00:00.000Z",
  createdAt: "2026-07-28T00:00:00.000Z",
  creator: { avatarUrl: null, countryCode: "US", displayName: "John Paul" },
  description: "Pray for healing.",
  expiresAt: "2026-09-01T00:00:00.000Z",
  id: "intention-1",
  symbol: "candle",
  title: "Praying for Recovery",
};

const emptyPage = { data: [], meta: { hasMore: false, limit: 20, nextOffset: null, offset: 0 } };
const singlePage = {
  data: [mockIntention],
  meta: { hasMore: false, limit: 20, nextOffset: null, offset: 0 },
};

describe("PrayerIntentionsScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows a loading indicator while fetching", async () => {
    fetchApprovedPrayerIntentions.mockImplementation(() => new Promise(() => undefined));
    await render(<PrayerIntentionsScreen />);
    expect(screen.getByText("Loading prayer intentions…")).toBeTruthy();
  });

  it("renders the screen title", async () => {
    fetchApprovedPrayerIntentions.mockResolvedValue(emptyPage);
    await render(<PrayerIntentionsScreen />);
    await waitFor(() => expect(screen.getByText("Prayer Intentions")).toBeTruthy());
    expect(screen.getByText("Pray with the community or share an intention.")).toBeTruthy();
  });

  it("shows an error message when the fetch fails", async () => {
    fetchApprovedPrayerIntentions.mockRejectedValue(new Error("Server error"));
    await render(<PrayerIntentionsScreen />);
    await waitFor(() => expect(screen.getByText("Couldn't load prayer intentions.")).toBeTruthy());
    expect(screen.getByText("Try again")).toBeTruthy();
  });

  it("renders intentions after loading", async () => {
    fetchApprovedPrayerIntentions.mockResolvedValue(singlePage);
    await render(<PrayerIntentionsScreen />);
    await waitFor(() => expect(screen.getByText("Praying for Recovery")).toBeTruthy());
  });

  it("navigates to create-prayer-intention when the add button is pressed", async () => {
    const push = jest.fn();
    jest.spyOn(require("expo-router"), "useRouter").mockReturnValue({ back: jest.fn(), push });
    fetchApprovedPrayerIntentions.mockResolvedValue(emptyPage);
    await render(<PrayerIntentionsScreen />);
    await waitFor(() => expect(screen.getByLabelText("Share a prayer intention")).toBeTruthy());
    await fireEvent.press(screen.getByLabelText("Share a prayer intention"));
    expect(push).toHaveBeenCalledWith("/create-prayer-intention");
  });
});
