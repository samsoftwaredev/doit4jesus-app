import { fireEvent, render, screen } from "@testing-library/react-native";

import { PrayerIntentionPrayerHistoryScreen } from "./PrayerIntentionPrayerHistoryScreen";

const mockBack = jest.fn();
const mockFetchPrayerIntentionPrayerSummary = jest.fn();
const mockParams: { intentionId?: string | string[] } = {};

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => mockParams,
  useRouter: () => ({ back: mockBack }),
}));
jest.mock("@/components/navigation", () => ({
  BackHeader: ({ title, onBack }: { title: string; onBack: () => void }) => {
    // The mocked module must load React Native within Jest's module factory.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pressable, Text, View } = require("react-native");
    return (
      <View>
        <Text>{title}</Text>
        <Pressable accessibilityRole="button" onPress={onBack}>
          <Text>Go back</Text>
        </Pressable>
      </View>
    );
  },
}));
jest.mock("@/features/prayer/intentions", () => ({
  fetchPrayerIntentionPrayerSummary: (...args: unknown[]) => mockFetchPrayerIntentionPrayerSummary(...args),
  getPrayerIntentionTheme: () => ({ icon: "heart", surface: "#15364F", surfaceLight: "#4C7895" }),
}));
jest.mock("@/features/prayer/intentions/components", () => ({
  PrayerIntentionAvatar: ({ displayName }: { displayName: string }) => {
    // The mocked module must load React Native within Jest's module factory.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text } = require("react-native");
    return <Text>{`Avatar for ${displayName}`}</Text>;
  },
}));

const summary = {
  approvedAt: "2026-08-02T00:00:00.000Z",
  createdAt: "2026-08-01T00:00:00.000Z",
  creator: { avatarUrl: null, countryCode: "US", displayName: "John Paul" },
  description: "Please pray for a quick recovery.",
  expiresAt: "2026-09-01T00:00:00.000Z",
  id: "intention-1",
  prayerCount: 1,
  symbol: "candle",
  title: "Recovery",
};

describe("PrayerIntentionPrayerHistoryScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams.intentionId = "intention-1";
    mockFetchPrayerIntentionPrayerSummary.mockResolvedValue(summary);
  });

  it("shows the prayer summary and singular count for an array route parameter", async () => {
    mockParams.intentionId = ["intention-1", "ignored"];
    await render(<PrayerIntentionPrayerHistoryScreen />);

    expect(await screen.findByText("Recovery")).toBeTruthy();
    expect(screen.getByText("1 prayer offered")).toBeTruthy();
    expect(mockFetchPrayerIntentionPrayerSummary).toHaveBeenCalledWith("intention-1");
    await fireEvent.press(screen.getByText("Go back"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("uses plural copy and lets the user retry a failed request", async () => {
    mockFetchPrayerIntentionPrayerSummary
      .mockRejectedValueOnce(new Error("Offline"))
      .mockResolvedValueOnce({ ...summary, prayerCount: 2 });
    await render(<PrayerIntentionPrayerHistoryScreen />);

    expect(await screen.findByText("Offline")).toBeTruthy();
    await fireEvent.press(screen.getByText("Try Again"));
    expect(await screen.findByText("2 prayers offered")).toBeTruthy();
  });

  it("handles a missing route parameter without requesting prayer activity", async () => {
    mockParams.intentionId = undefined;
    await render(<PrayerIntentionPrayerHistoryScreen />);

    expect(await screen.findByText("A prayer intention could not be found.")).toBeTruthy();
    expect(mockFetchPrayerIntentionPrayerSummary).not.toHaveBeenCalled();
  });
});
