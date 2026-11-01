import { render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { CHURCH_GLOBE_ROTATION_DURATION_MS, ChurchDiscoveryGlobe } from "./ChurchDiscoveryGlobe";

const reanimated = jest.requireMock("react-native-reanimated") as {
  useReducedMotion: jest.Mock;
  withTiming: jest.Mock;
};

describe("ChurchDiscoveryGlobe", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    reanimated.useReducedMotion.mockReturnValue(true);
    await i18n.changeLanguage("en");
  });

  it("shows accessible ZIP-search guidance without animating for reduced motion", async () => {
    await render(<ChurchDiscoveryGlobe />);

    expect(screen.getByLabelText("Church discovery globe")).toBeTruthy();
    expect(screen.getByText("Enter a ZIP code and search to explore nearby churches.")).toBeTruthy();
    expect(reanimated.withTiming).not.toHaveBeenCalled();
  });

  it("rotates the Earth once every eight seconds when motion is allowed", async () => {
    reanimated.useReducedMotion.mockReturnValue(false);

    await render(<ChurchDiscoveryGlobe />);

    expect(reanimated.withTiming).toHaveBeenCalledWith(
      360,
      expect.objectContaining({ duration: CHURCH_GLOBE_ROTATION_DURATION_MS }),
    );
    expect(CHURCH_GLOBE_ROTATION_DURATION_MS).toBe(8_000);
  });

  it("renders the globe guidance in Spanish", async () => {
    await i18n.changeLanguage("es");

    await render(<ChurchDiscoveryGlobe />);

    expect(screen.getByLabelText("Globo para buscar iglesias")).toBeTruthy();
    expect(screen.getByText("Ingresa un código postal y busca para explorar iglesias cercanas.")).toBeTruthy();
  });
});
