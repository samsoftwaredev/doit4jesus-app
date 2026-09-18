import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Pressable, Text, View } from "react-native";

import { i18n } from "@/localization";

import { PrayerScreen } from "./PrayerHomeScreen";

const mockPush = jest.fn();

function MockPrayersByOthers({
  intentions,
  isLoadingMore,
  onLoadMore,
}: {
  intentions: { id: string; title: string }[];
  isLoadingMore: boolean;
  onLoadMore: () => void;
}) {
  return (
    <View>
      {intentions.map((intention) => (
        <Text key={intention.id}>{intention.title}</Text>
      ))}
      <Text>{isLoadingMore ? "Loading another page" : "More intentions ready"}</Text>
      <Pressable accessibilityLabel="Load the next home intention page" onPress={onLoadMore}>
        <Text>Load more</Text>
      </Pressable>
    </View>
  );
}

jest.mock("@/features/prayer/intentions", () => ({
  cacheApprovedPrayerIntentions: jest.fn(),
  fetchApprovedPrayerIntentions: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/features/prayer/components", () => {
  const { Text: MockText } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    AllMysteries: () => <MockText>All Mysteries Section</MockText>,
    MomentForPrayer: () => <MockText>Today&apos;s Rosary Section</MockText>,
    PrayersByOthers: MockPrayersByOthers,
  };
});

jest.mock("@/features/prayer/rosary/garden/components", () => {
  const { Pressable: MockPressable, Text: MockText } =
    jest.requireActual<typeof import("react-native")>("react-native");
  return {
    RosaryGardenSection: ({ onPrayToday }: { onPrayToday: () => void }) => (
      <MockPressable accessibilityLabel="Pray from the embedded garden" onPress={onPrayToday}>
        <MockText>Rosary Garden Section</MockText>
      </MockPressable>
    ),
  };
});

const { fetchApprovedPrayerIntentions } = jest.requireMock("@/features/prayer/intentions") as {
  fetchApprovedPrayerIntentions: jest.Mock;
};

const firstIntention = {
  approvedAt: "2026-08-01T00:00:00.000Z",
  createdAt: "2026-07-28T00:00:00.000Z",
  creator: { avatarUrl: null, countryCode: "US", displayName: "John Paul" },
  description: "Please pray for healing and strength.",
  expiresAt: "2026-09-01T00:00:00.000Z",
  id: "intention-1",
  symbol: "candle",
  title: "Praying for Recovery",
};

const secondIntention = {
  ...firstIntention,
  id: "intention-2",
  title: "Praying for Peace",
};

describe("PrayerScreen", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage("en");
  });

  it("renders Prayer and Rosary Garden content in one ordered page", async () => {
    fetchApprovedPrayerIntentions.mockResolvedValue({
      data: [],
      meta: { hasMore: false, limit: 10, nextOffset: null, offset: 0 },
    });

    await render(<PrayerScreen />);

    expect(screen.getByRole("header", { name: "Prayer" })).toBeTruthy();
    expect(screen.getByText("Pray the Rosary and lift up the intentions of others.")).toBeTruthy();
    expect(screen.queryByLabelText("Open Rosary Garden")).toBeNull();

    const sections = screen.getAllByTestId(/^prayer-section-/);
    expect(sections.map((section) => section.props.testID)).toEqual([
      "prayer-section-today",
      "prayer-section-garden",
      "prayer-section-mysteries",
      "prayer-section-intentions",
    ]);

    await fireEvent.press(screen.getByLabelText("Pray from the embedded garden"));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/rosary",
      params: { isDecade: "false", mysteryType: expect.any(String), source: "today" },
    });
  });

  it("loads successive intention pages for the horizontal home carousel", async () => {
    fetchApprovedPrayerIntentions
      .mockResolvedValueOnce({
        data: [firstIntention],
        meta: { hasMore: true, limit: 10, nextOffset: 10, offset: 0 },
      })
      .mockResolvedValueOnce({
        data: [secondIntention],
        meta: { hasMore: false, limit: 10, nextOffset: null, offset: 10 },
      });

    await render(<PrayerScreen />);
    await waitFor(() => expect(screen.getByText(firstIntention.title)).toBeTruthy());

    await fireEvent.press(screen.getByLabelText("Load the next home intention page"));

    await waitFor(() => {
      expect(fetchApprovedPrayerIntentions).toHaveBeenNthCalledWith(2, { limit: 10, offset: 10 });
      expect(screen.getByText(secondIntention.title)).toBeTruthy();
    });
  });

  it("localizes the consolidated Prayer page", async () => {
    await i18n.changeLanguage("es");
    fetchApprovedPrayerIntentions.mockResolvedValue({
      data: [],
      meta: { hasMore: false, limit: 10, nextOffset: null, offset: 0 },
    });

    await render(<PrayerScreen />);

    expect(screen.getByRole("header", { name: "Oración" })).toBeTruthy();
    expect(screen.getByText("Reza el Rosario y eleva las intenciones de los demás.")).toBeTruthy();
    expect(screen.getByText("Rosary Garden Section")).toBeTruthy();
  });
});
