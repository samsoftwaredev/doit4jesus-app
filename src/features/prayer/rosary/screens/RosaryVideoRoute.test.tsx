import { render } from "@testing-library/react-native";

import RosaryVideoRoute from "@/app/rosary-video";

const mockSearchParams: { mysteryType?: string } = { mysteryType: "sorrowful" };
const mockRosaryVideoScreen = jest.fn<null, [unknown]>(() => null);
let mockLanguage: "en" | "es" = "en";

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => mockSearchParams,
}));
jest.mock("@/localization", () => ({
  useAppLanguage: () => ({ language: mockLanguage }),
}));
jest.mock("@/features/prayer/rosary/screens/RosaryVideoScreen", () => ({
  RosaryVideoScreen: (props: unknown) => mockRosaryVideoScreen(props),
}));

describe("RosaryVideoRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLanguage = "en";
    mockSearchParams.mysteryType = "sorrowful";
  });

  it("passes the selected mystery and localized video to the screen", async () => {
    await render(<RosaryVideoRoute />);

    expect(mockRosaryVideoScreen).toHaveBeenLastCalledWith({
      language: "en",
      mysteryType: "sorrowful",
      videoId: "EBQPDYRkGOw",
    });
  });

  it("uses today's mystery for an unsupported route parameter", async () => {
    mockLanguage = "es";
    mockSearchParams.mysteryType = "unsupported";

    await render(<RosaryVideoRoute />);

    expect(mockRosaryVideoScreen).toHaveBeenLastCalledWith({
      language: "es",
      mysteryType: expect.stringMatching(/^(joyful|sorrowful|glorious|luminous)$/),
      videoId: expect.any(String),
    });
  });
});
