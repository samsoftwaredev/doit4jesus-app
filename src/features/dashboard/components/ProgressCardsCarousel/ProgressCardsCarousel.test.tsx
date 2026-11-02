import { fireEvent, render, screen, within } from "@testing-library/react-native";
import { StyleSheet, Text } from "react-native";

import { i18n } from "@/localization";
import { theme } from "@/theme/tokens";

import { ProgressCardsCarousel } from "./ProgressCardsCarousel";

describe("ProgressCardsCarousel", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("shows Level Progress first and exposes two selected-state indicators", async () => {
    await render(
      <ProgressCardsCarousel holyProgressCard={<Text>Holy card</Text>} levelProgressCard={<Text>Level card</Text>} />,
    );

    const carousel = screen.getByTestId("progress-cards-carousel");
    const levelPage = screen.getByTestId("level-progress-card-container");
    const holyPage = screen.getByTestId("holy-progress-card-container", { includeHiddenElements: true });
    expect(levelPage.parent?.children.indexOf(levelPage)).toBe(0);
    expect(levelPage.parent?.children.indexOf(holyPage)).toBe(1);
    expect(carousel.props.horizontal).toBe(true);
    expect(carousel.props.pagingEnabled).toBe(true);

    const indicators = within(screen.getByTestId("progress-cards-carousel-indicators")).getAllByRole("button");
    expect(indicators).toHaveLength(2);
    expect(StyleSheet.flatten(indicators[0].props.style)).toMatchObject({
      height: theme.sizes.touchTarget,
      width: theme.sizes.touchTarget,
    });
    expect(screen.getByLabelText("Show Level Progress").props.accessibilityState).toEqual({ selected: true });
    expect(screen.getByLabelText("Show Holy Progress").props.accessibilityState).toEqual({ selected: false });
  });

  it("selects Holy Progress after a horizontal swipe and returns through the Level indicator", async () => {
    await render(
      <ProgressCardsCarousel holyProgressCard={<Text>Holy card</Text>} levelProgressCard={<Text>Level card</Text>} />,
    );

    await fireEvent(screen.getByTestId("progress-cards-carousel-container"), "layout", {
      nativeEvent: { layout: { height: 600, width: 320, x: 0, y: 0 } },
    });
    await fireEvent(screen.getByTestId("progress-cards-carousel"), "momentumScrollEnd", {
      nativeEvent: { contentOffset: { x: 320, y: 0 } },
    });

    expect(screen.getByLabelText("Show Holy Progress").props.accessibilityState).toEqual({ selected: true });
    expect(screen.getByLabelText("Show Level Progress").props.accessibilityState).toEqual({ selected: false });

    await fireEvent.press(screen.getByLabelText("Show Level Progress"));
    expect(screen.getByLabelText("Show Level Progress").props.accessibilityState).toEqual({ selected: true });
  });

  it.each([320, 390, 768, 1024])("keeps both cards full-width in a %ipx carousel", async (width) => {
    await render(
      <ProgressCardsCarousel holyProgressCard={<Text>Holy card</Text>} levelProgressCard={<Text>Level card</Text>} />,
    );

    await fireEvent(screen.getByTestId("progress-cards-carousel-container"), "layout", {
      nativeEvent: { layout: { height: 600, width, x: 0, y: 0 } },
    });

    const levelPage = screen.getByTestId("level-progress-card-container");
    const holyPage = screen.getByTestId("holy-progress-card-container", { includeHiddenElements: true });
    expect(StyleSheet.flatten(levelPage.props.style)).toMatchObject({ width });
    expect(StyleSheet.flatten(holyPage.props.style)).toMatchObject({ width });
  });

  it("localizes the carousel controls in Spanish", async () => {
    await i18n.changeLanguage("es");
    await render(
      <ProgressCardsCarousel
        holyProgressCard={<Text>Tarjeta espiritual</Text>}
        levelProgressCard={<Text>Tarjeta de nivel</Text>}
      />,
    );

    expect(screen.getByLabelText("Tarjetas de progreso de nivel y progreso espiritual")).toBeTruthy();
    expect(screen.getByLabelText("Mostrar Progreso de nivel")).toBeTruthy();
    expect(screen.getByLabelText("Mostrar Progreso espiritual")).toBeTruthy();
  });
});
