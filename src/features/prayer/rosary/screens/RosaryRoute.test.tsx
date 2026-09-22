import { render } from "@testing-library/react-native";

import RosaryRoute from "@/app/rosary";

const mockSearchParams = {
  isDecade: "false",
  mysteryType: "sorrowful",
  source: "manual",
};
const mockRosaryPrayerScreen = jest.fn<null, [unknown]>(() => null);

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => mockSearchParams,
}));
jest.mock("@/features/prayer/rosary/screens/RosaryPrayerScreen", () => ({
  RosaryPrayerScreen: (props: unknown) => mockRosaryPrayerScreen(props),
}));

describe("RosaryRoute", () => {
  it("passes the selected content and mystery type without overriding the screen's art-style-aware mysteries", async () => {
    await render(<RosaryRoute />);

    const props = mockRosaryPrayerScreen.mock.lastCall?.[0] as
      | {
          content: { language: string };
          mysteryType: string;
        }
      | undefined;

    expect(props?.mysteryType).toBe("sorrowful");
    expect(props?.content.language).toBe("en");
    expect(props).not.toHaveProperty("mysteries");
  });
});
