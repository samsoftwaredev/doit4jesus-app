import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo, Dimensions, StyleSheet } from "react-native";
import { fireGestureHandler, getByGestureTestId } from "react-native-gesture-handler/jest-utils";

import { rosaryMysteries } from "@/features/prayer/rosary/data/rosaryMysteries";
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

const mystery = rosaryMysteries[0];
const defaultProps: RosaryDetailCarouselProps = {
  artworkSource: mystery.imageSource,
  mystery,
  prayer: mystery.prayers[1],
  scriptureQuotation: mystery.scriptureText,
  scriptureReference: mystery.scriptureReference,
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

  it("shows only the Mystery page initially with five accessible pagination controls", async () => {
    await render(<RosaryDetailCarousel {...defaultProps} />);

    expect(screen.getByText("CURRENT MYSTERY")).toBeTruthy();
    expect(screen.queryByText("FRUIT OF THE MYSTERY")).toBeNull();
    expect(screen.queryByText("HAIL MARY")).toBeNull();
    expect(screen.queryByText("SCRIPTURE")).toBeNull();
    expect(screen.getByRole("button", { name: "Show Mystery, page 1 of 5" }).props.accessibilityState).toEqual({
      selected: true,
    });
    expect(screen.getAllByRole("button", { name: /Show .+, page \d of 5/ })).toHaveLength(5);
  });

  it("places the pagination controls above the active detail card", async () => {
    await render(<RosaryDetailCarousel {...defaultProps} />);
    const container = screen.getByTestId("rosary-detail-carousel");
    const activePageContainer = screen.getByTestId("rosary-detail-page-mystery").parent;
    const paginationContainer = screen.getByRole("button", { name: "Show Mystery, page 1 of 5" }).parent;

    expect(container.children.indexOf(paginationContainer!)).toBeLessThan(
      container.children.indexOf(activePageContainer!),
    );
  });

  it("cycles through details in both directions and wraps at each end", async () => {
    await render(<RosaryDetailCarousel {...defaultProps} />);

    await swipeDetails(-60);
    expect(screen.getByTestId("rosary-artwork-image").props.source).toEqual([mystery.imageSource]);

    await swipeDetails(-60);
    expect(screen.getByText("FRUIT OF THE MYSTERY")).toBeTruthy();

    await swipeDetails(-60);
    expect(screen.getByText("HAIL MARY")).toBeTruthy();

    await swipeDetails(-60);
    expect(screen.getByText("SCRIPTURE")).toBeTruthy();

    await swipeDetails(-60);
    expect(screen.getByText("CURRENT MYSTERY")).toBeTruthy();

    await swipeDetails(60);
    expect(screen.getByText("SCRIPTURE")).toBeTruthy();
  });

  it("ignores short and vertical gestures so prayer scrolling remains available", async () => {
    await render(<RosaryDetailCarousel {...defaultProps} />);

    await swipeDetails(-30);
    await swipeDetails(-60, 30);

    expect(screen.getByText("CURRENT MYSTERY")).toBeTruthy();
  });

  it("supports direct dot selection, announces the page, and preserves 44-point targets", async () => {
    await render(<RosaryDetailCarousel {...defaultProps} />);
    const scriptureDot = screen.getByRole("button", { name: "Show Scripture, page 5 of 5" });

    await fireEvent.press(scriptureDot);

    expect(screen.getByText("SCRIPTURE")).toBeTruthy();
    expect(scriptureDot.props.accessibilityState).toEqual({ selected: true });
    expect(StyleSheet.flatten(scriptureDot.props.style)).toMatchObject({ height: 44, width: 44 });
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith("Scripture, page 5 of 5");
  });

  it("retains Artwork while its source, mystery, and prayer content change", async () => {
    const rendered = await render(<RosaryDetailCarousel {...defaultProps} />);
    await fireEvent.press(screen.getByRole("button", { name: "Show Artwork, page 2 of 5" }));

    await rendered.rerender(
      <RosaryDetailCarousel
        {...defaultProps}
        artworkSource={rosaryMysteries[1].imageSource}
        mystery={rosaryMysteries[1]}
        prayer={{ ...mystery.prayers[1], id: "updated-prayer", name: "Updated Prayer", text: "Updated prayer text." }}
      />,
    );

    expect(screen.getByTestId("rosary-artwork-image").props.source).toEqual([rosaryMysteries[1].imageSource]);
    expect(screen.queryByText("CURRENT MYSTERY")).toBeNull();
    expect(screen.getByRole("button", { name: "Show Artwork, page 2 of 5" }).props.accessibilityState).toEqual({
      selected: true,
    });
  });

  it("localizes carousel controls and Fruit accessibility content in Spanish", async () => {
    await act(async () => i18n.changeLanguage("es"));
    await render(<RosaryDetailCarousel {...defaultProps} />);

    const guidance = screen.getByLabelText("Carrusel de detalles del Rosario");
    expect(guidance.props.accessible).toBe(true);
    expect(guidance.props.accessibilityHint).toContain("Desliza a la izquierda o a la derecha");
    expect(screen.getByRole("button", { name: "Mostrar Arte sacro, página 2 de 5" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Mostrar Fruto del Misterio, página 3 de 5" }));
    expect(screen.getByLabelText(new RegExp(`^Fruto del misterio\\. ${mystery.fruit}\\.`))).toBeTruthy();
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
