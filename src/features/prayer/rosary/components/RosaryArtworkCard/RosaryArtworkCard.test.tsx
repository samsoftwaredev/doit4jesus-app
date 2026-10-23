import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Dimensions, StyleSheet } from "react-native";

import { rosaryMysteries } from "@/features/prayer/rosary/data/rosaryMysteries";
import { i18n } from "@/localization";

import { RosaryArtworkCard } from "./RosaryArtworkCard";

const { useReducedMotion } = jest.requireMock("react-native-reanimated") as {
  useReducedMotion: jest.Mock;
};
const firstArtwork = rosaryMysteries[0].imageSource;
const secondArtwork = rosaryMysteries[1].imageSource;

function setWindowDimensions({ fontScale = 1, height, width }: { fontScale?: number; height: number; width: number }) {
  const dimensions = { fontScale, height, scale: 3, width };
  Dimensions.set({ screen: dimensions, window: dimensions });
}

describe("RosaryArtworkCard", () => {
  beforeEach(async () => {
    await act(async () => i18n.changeLanguage("en"));
    jest.clearAllMocks();
    useReducedMotion.mockReturnValue(true);
    setWindowDimensions({ height: 844, width: 390 });
  });

  it("shows the full uncropped artwork without a visible title or overlay", async () => {
    await render(<RosaryArtworkCard imageSource={firstArtwork} />);

    const artwork = screen.getByTestId("rosary-artwork-image");
    const frameStyle = StyleSheet.flatten(screen.getByTestId("rosary-artwork-card").props.style);
    expect(artwork.props.source).toEqual([firstArtwork]);
    expect(artwork.props.contentFit).toBe("contain");
    expect(artwork.props.accessible).toBe(true);
    expect(artwork.props.accessibilityLabel).toBe("Current Rosary background artwork");
    expect(artwork.props.transition).toEqual({ duration: 0 });
    expect(frameStyle).toMatchObject({ backgroundColor: "transparent", borderWidth: 0 });
    expect(screen.queryByText("ARTWORK")).toBeNull();
    expect(screen.queryByTestId("rosary-artwork-overlay")).toBeNull();
  });

  it("shows a localized fallback when no source is available or loading fails", async () => {
    const rendered = await render(<RosaryArtworkCard />);
    expect(screen.getByText("Devotional image unavailable")).toBeTruthy();

    await rendered.rerender(<RosaryArtworkCard imageSource={firstArtwork} />);
    await fireEvent(screen.getByTestId("rosary-artwork-image"), "error", { nativeEvent: {} });
    expect(screen.getByText("Devotional image unavailable")).toBeTruthy();
    expect(screen.queryByTestId("rosary-artwork-image")).toBeNull();

    await rendered.rerender(<RosaryArtworkCard imageSource={secondArtwork} />);
    expect(screen.getByTestId("rosary-artwork-image").props.source).toEqual([secondArtwork]);
  });

  it("localizes the artwork description and fallback in Spanish", async () => {
    await act(async () => i18n.changeLanguage("es"));
    const rendered = await render(<RosaryArtworkCard imageSource={firstArtwork} />);

    expect(screen.getByLabelText("Ilustración de fondo actual del Rosario")).toBeTruthy();
    await rendered.rerender(<RosaryArtworkCard />);
    expect(screen.getByText("Imagen devocional no disponible")).toBeTruthy();
  });

  it.each([
    { expectedHeight: 220, fontScale: 1, height: 568, label: "narrow phone", width: 320 },
    { expectedHeight: 303.84, fontScale: 1, height: 844, label: "typical phone", width: 390 },
    { expectedHeight: 368.64, fontScale: 1, height: 1024, label: "tablet", width: 768 },
    { expectedHeight: 480, fontScale: 1, height: 1366, label: "desktop", width: 1024 },
    { expectedHeight: 180, fontScale: 1, height: 390, label: "landscape phone", width: 844 },
    { expectedHeight: 303.84, fontScale: 1.4, height: 844, label: "large text", width: 390 },
  ])(
    "uses the responsive contained-artwork frame on a $label",
    async ({ expectedHeight, fontScale, height, width }) => {
      setWindowDimensions({ fontScale, height, width });
      await render(<RosaryArtworkCard imageSource={firstArtwork} />);

      expect(StyleSheet.flatten(screen.getByTestId("rosary-artwork-card").props.style)).toMatchObject({
        height: expectedHeight,
        width: "100%",
      });
    },
  );
});
