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
  it("passes the selected mystery set from the English Rosary JSON to the existing screen", async () => {
    await render(<RosaryRoute />);

    const props = mockRosaryPrayerScreen.mock.lastCall?.[0] as
      | {
          content: { language: string };
          mysteries: { id: string; scriptureReference: string; title: string }[];
          mysteryType: string;
        }
      | undefined;

    expect(props?.mysteryType).toBe("sorrowful");
    expect(props?.content.language).toBe("en");
    expect(props?.mysteries).toHaveLength(5);
    expect(props?.mysteries[0]).toEqual(
      expect.objectContaining({
        id: "agony_in_the_garden",
        scriptureReference: "Matthew 26:36-46",
        title: "The Agony in the Garden",
      }),
    );
  });
});
