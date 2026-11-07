import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo, Dimensions, StyleSheet } from "react-native";
import { fireGestureHandler, getByGestureTestId } from "react-native-gesture-handler/jest-utils";

import type { RosaryMystery, RosaryPrayer } from "@/features/prayer/rosary/types";
import { i18n } from "@/localization";

import { RosaryDetailCarousel, type RosaryDetailCarouselProps } from "./RosaryDetailCarousel";

const { FadeIn, useReducedMotion } = jest.requireMock("react-native-reanimated") as {
  FadeIn: { duration: (duration: number) => unknown };
  useReducedMotion: jest.Mock;
};

function setWindowDimensions({ fontScale = 1, height, width }: { fontScale?: number; height: number; width: number }) {
  const dimensions = { fontScale, height, scale: 3, width };
  Dimensions.set({ screen: dimensions, window: dimensions });
}

const prayer: RosaryPrayer = {
  beadType: "hailMary",
  id: "hail-mary",
  name: "Hail Mary",
  text: "Hail Mary, full of grace.",
};
const mystery: RosaryMystery = {
  backgroundImageSources: [{ uri: "mystery-art" }],
  category: "Joyful Mysteries",
  fruit: "Humility",
  fruitDescription: "Ask for the grace of humility.",
  id: "annunciation",
  imageAlt: "The Annunciation",
  imageSource: { uri: "mystery-art" },
  prayers: [prayer],
  scriptureReference: "Luke 1:26-38",
  scriptureText: "The angel Gabriel was sent from God.",
  title: "The Annunciation",
};
const defaultProps: RosaryDetailCarouselProps = {
  artworkSource: mystery.imageSource,
  mystery,
  prayer,
  scriptureQuotation: mystery.scriptureText,
  scriptureReference: mystery.scriptureReference,
  showFruitOfMystery: false,
};

async function swipeDetails(translationX: number, translationY = 2) {
  await act(async () => {
    fireGestureHandler(getByGestureTestId("rosary-detail-carousel-swipe"), [{ translationX, translationY }]);
  });
}

describe("RosaryDetailCarousel", () => {
  beforeEach(async () => {
    await act(async () => i18n.changeLanguage("en"));
    jest.clearAllMocks();
    useReducedMotion.mockReturnValue(true);
    setWindowDimensions({ height: 844, width: 390 });
    jest.spyOn(AccessibilityInfo, "announceForAccessibility").mockImplementation(jest.fn());
  });

  afterEach(() => jest.restoreAllMocks());

  it("shows Mystery and Scripture first with three accessible pagination controls", async () => {
    await render(<RosaryDetailCarousel {...defaultProps} />);

    expect(screen.getByText("CURRENT MYSTERY")).toBeTruthy();
    expect(screen.getByText("SCRIPTURE")).toBeTruthy();
    expect(screen.getByText("Luke 1:26-38")).toBeTruthy();
    expect(screen.queryByText("FRUIT OF THE MYSTERY")).toBeNull();
    expect(screen.queryByText("HAIL MARY")).toBeNull();
    expect(
      screen.getByRole("button", { name: "Show Mystery and Scripture, page 1 of 3" }).props.accessibilityState,
    ).toEqual({ selected: true });
    expect(screen.getAllByRole("button", { name: /Show .+, page \d of 3/ })).toHaveLength(3);
  });

  it("places pagination above the active combined card", async () => {
    await render(<RosaryDetailCarousel {...defaultProps} />);
    const container = screen.getByTestId("rosary-detail-carousel");
    const activePageContainer = screen.getByTestId("rosary-detail-page-mysteryScripture").parent;
    const paginationContainer = screen.getByRole("button", {
      name: "Show Mystery and Scripture, page 1 of 3",
    }).parent;

    expect(container.children.indexOf(paginationContainer!)).toBeLessThan(
      container.children.indexOf(activePageContainer!),
    );
  });

  it("cycles through the three details in both directions and wraps at each end", async () => {
    await render(<RosaryDetailCarousel {...defaultProps} />);

    await swipeDetails(-60);
    expect(screen.getByTestId("rosary-artwork-image").props.source).toEqual([mystery.imageSource]);

    await swipeDetails(-60);
    expect(screen.getByText("HAIL MARY")).toBeTruthy();
    expect(screen.queryByText("FRUIT OF THE MYSTERY")).toBeNull();

    await swipeDetails(-60);
    expect(screen.getByText("CURRENT MYSTERY")).toBeTruthy();
    expect(screen.getByText("SCRIPTURE")).toBeTruthy();

    await swipeDetails(60);
    expect(screen.getByText("HAIL MARY")).toBeTruthy();
  });

  it("ignores short and vertical gestures so prayer scrolling remains available", async () => {
    await render(<RosaryDetailCarousel {...defaultProps} />);

    await swipeDetails(-30);
    await swipeDetails(-60, 30);

    expect(screen.getByText("CURRENT MYSTERY")).toBeTruthy();
    expect(screen.getByText("SCRIPTURE")).toBeTruthy();
  });

  it("supports direct selection, announces the page, and preserves 44-point targets", async () => {
    await render(<RosaryDetailCarousel {...defaultProps} />);
    const fruitPrayerDot = screen.getByRole("button", { name: "Show Fruit and Prayer, page 3 of 3" });

    await fireEvent.press(fruitPrayerDot);

    expect(screen.getByText("HAIL MARY")).toBeTruthy();
    expect(fruitPrayerDot.props.accessibilityState).toEqual({ selected: true });
    expect(StyleSheet.flatten(fruitPrayerDot.props.style)).toMatchObject({ height: 44, width: 44 });
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith("Fruit and Prayer, page 3 of 3");
  });

  it("retains Artwork while its source, mystery, and prayer content change", async () => {
    const rendered = await render(<RosaryDetailCarousel {...defaultProps} />);
    await fireEvent.press(screen.getByRole("button", { name: "Show Artwork, page 2 of 3" }));

    await rendered.rerender(<RosaryDetailCarousel {...defaultProps} artworkSource={{ uri: "updated-art" }} />);

    expect(screen.getByTestId("rosary-artwork-image").props.source).toEqual([{ uri: "updated-art" }]);
    expect(screen.queryByText("CURRENT MYSTERY")).toBeNull();
    expect(screen.getByRole("button", { name: "Show Artwork, page 2 of 3" }).props.accessibilityState).toEqual({
      selected: true,
    });
  });

  it("shows Fruit during its narration step even while playback is paused", async () => {
    const narration = { ...prayer, beadType: "narration" as const, name: "Mystery Reflection", text: "" };
    const rendered = await render(
      <RosaryDetailCarousel {...defaultProps} isNarrationOnly prayer={narration} showFruitOfMystery />,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Show Fruit and Prayer, page 3 of 3" }));

    expect(screen.getByText("FRUIT OF THE MYSTERY")).toBeTruthy();
    expect(screen.getByRole("header", { name: "Humility" })).toBeTruthy();
    expect(screen.queryByText("MYSTERY REFLECTION")).toBeNull();

    await rendered.rerender(
      <RosaryDetailCarousel {...defaultProps} isNarrationOnly prayer={narration} showFruitOfMystery={false} />,
    );
    expect(screen.queryByText("FRUIT OF THE MYSTERY")).toBeNull();
    expect(screen.queryByTestId("fruit-prayer-card")).toBeNull();
  });

  it("localizes the three carousel controls in Spanish", async () => {
    await act(async () => i18n.changeLanguage("es"));
    await render(<RosaryDetailCarousel {...defaultProps} />);

    const guidance = screen.getByLabelText("Carrusel de detalles del Rosario");
    expect(guidance.props.accessible).toBe(true);
    expect(guidance.props.accessibilityHint).toContain("Desliza a la izquierda o a la derecha");
    expect(screen.getByRole("button", { name: "Mostrar Misterio y Sagrada Escritura, página 1 de 3" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Mostrar Fruto del Misterio y Oración, página 3 de 3" })).toBeTruthy();
  });

  it("removes the page transition when reduced motion is enabled", async () => {
    const durationSpy = jest.spyOn(FadeIn, "duration").mockReturnValue({});
    const rendered = await render(<RosaryDetailCarousel {...defaultProps} />);
    expect(durationSpy).not.toHaveBeenCalled();

    useReducedMotion.mockReturnValue(false);
    await rendered.rerender(<RosaryDetailCarousel {...defaultProps} />);
    expect(durationSpy).toHaveBeenCalledWith(180);
  });

  it.each([
    { fontScale: 1, height: 568, label: "narrow phone", width: 320 },
    { fontScale: 1, height: 844, label: "typical phone", width: 390 },
    { fontScale: 1, height: 1024, label: "tablet", width: 768 },
    { fontScale: 1, height: 1366, label: "desktop", width: 1024 },
    { fontScale: 1, height: 390, label: "landscape phone", width: 844 },
    { fontScale: 1.4, height: 844, label: "large text", width: 390 },
  ])("uses a fluid single-column layout on a $label", async ({ fontScale, height, width }) => {
    setWindowDimensions({ fontScale, height, width });
    await render(<RosaryDetailCarousel {...defaultProps} />);

    expect(StyleSheet.flatten(screen.getByTestId("rosary-detail-carousel").props.style)).toMatchObject({
      minWidth: 0,
      width: "100%",
    });
  });
});
