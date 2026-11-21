import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet, Text } from "react-native";

import { i18n } from "@/localization";

import { HomeSectionsCarousel } from "./HomeSectionsCarousel";

function renderCarousel() {
  return render(
    <HomeSectionsCarousel mysteriesPage={<Text>Mysteries page</Text>} todayPage={<Text>Today page</Text>} />,
  );
}

describe("HomeSectionsCarousel pills", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("labels only the unselected pill and keeps both pills the same height", async () => {
    await renderCarousel();

    expect(screen.getAllByTestId("home-carousel-pill-caption", { includeHiddenElements: true })).toHaveLength(1);
    expect(screen.getByText("Mysteries", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.queryByText("Today", { includeHiddenElements: true })).toBeNull();

    await fireEvent.press(screen.getByLabelText("Show All Mysteries"));

    expect(screen.getAllByTestId("home-carousel-pill-caption", { includeHiddenElements: true })).toHaveLength(1);
    expect(screen.getByText("Today", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.queryByText("Mysteries", { includeHiddenElements: true })).toBeNull();

    const heights = [0, 1].map(
      (page) =>
        StyleSheet.flatten(
          screen.getByTestId(`home-carousel-pill-${page}`, { includeHiddenElements: true }).props.style,
        ).height,
    );
    expect(new Set(heights).size).toBe(1);
  });

  it("localizes the captions in Spanish", async () => {
    await i18n.changeLanguage("es");
    await renderCarousel();

    expect(screen.getByText("Misterios", { includeHiddenElements: true })).toBeTruthy();
    await act(async () => i18n.changeLanguage("en"));
  });
});
