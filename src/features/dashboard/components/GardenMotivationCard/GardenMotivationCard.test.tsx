import { act, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import type { ResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { i18n } from "@/localization";

import { GardenMotivationCard } from "./GardenMotivationCard";

const phoneLayout: ResponsiveLayout = {
  contentWidth: 390,
  fontScale: 1,
  gutter: 16,
  height: 844,
  isDesktop: false,
  isLandscape: false,
  isLargeText: false,
  isNarrowPhone: false,
  isTablet: false,
  size: "phone",
  width: 390,
};
const mockResponsiveLayout = jest.fn(() => phoneLayout);

jest.mock("@/hooks/useResponsiveLayout", () => ({
  useResponsiveLayout: () => mockResponsiveLayout(),
}));

describe("GardenMotivationCard", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockResponsiveLayout.mockReturnValue(phoneLayout);
    await i18n.changeLanguage("en");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("explains the prayer cycle in a stacked, borderless phone layout", async () => {
    await render(<GardenMotivationCard />);

    expect(screen.getByText("Plant Today’s Flower")).toBeTruthy();
    expect(screen.getByText("Pray today")).toBeTruthy();
    expect(screen.getByText("Plant a flower")).toBeTruthy();
    expect(screen.getByText("Grow your streak")).toBeTruthy();
    expect(screen.getByText("Miss a day and your streak starts again. You can always begin again.")).toBeTruthy();
    expect(screen.getByTestId("garden-motivation-artwork").props.accessible).toBe(false);
    expect(StyleSheet.flatten(screen.getByTestId("garden-purpose-steps").props.style).flexDirection).toBe("column");
    expect(StyleSheet.flatten(screen.getByTestId("garden-motivation-card").props.style)).toMatchObject({
      backgroundColor: "transparent",
      borderWidth: 0,
    });
  });

  it("uses a step row on tablets, then stacks for large text and localizes Spanish", async () => {
    const rendered = await render(<GardenMotivationCard />);
    mockResponsiveLayout.mockReturnValue({
      ...phoneLayout,
      contentWidth: 736,
      height: 1024,
      isTablet: true,
      size: "tablet",
      width: 768,
    });
    await rendered.rerender(<GardenMotivationCard />);
    expect(StyleSheet.flatten(screen.getByTestId("garden-purpose-steps").props.style).flexDirection).toBe("row");

    mockResponsiveLayout.mockReturnValue({
      ...phoneLayout,
      contentWidth: 736,
      fontScale: 1.6,
      height: 1024,
      isLargeText: true,
      isTablet: true,
      size: "tablet",
      width: 768,
    });
    await act(async () => {
      await i18n.changeLanguage("es");
    });
    await rendered.rerender(<GardenMotivationCard />);
    expect(StyleSheet.flatten(screen.getByTestId("garden-purpose-steps").props.style).flexDirection).toBe("column");
    expect(screen.getByText("Reza hoy")).toBeTruthy();
    expect(screen.getByText("Planta una flor")).toBeTruthy();
    expect(screen.getByText("Aumenta tu racha")).toBeTruthy();
  });
});
