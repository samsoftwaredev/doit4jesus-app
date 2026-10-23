import { act, fireEvent, render, screen, within } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { i18n } from "@/localization";
import type { ResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { darkTheme, lightTheme, setActiveAppTheme } from "@/theme/tokens";

import { RosaryGardenSection } from "./RosaryGardenSection";

const goToNextMonth = jest.fn();
const goToPreviousMonth = jest.fn();
const retryMonthLoad = jest.fn();
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
let mockColorScheme: "light" | "dark" = "dark";

jest.mock("expo-haptics", () => ({
  ImpactFeedbackStyle: { Light: "light" },
  impactAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock("@/hooks/useResponsiveLayout", () => ({
  useResponsiveLayout: () => mockResponsiveLayout(),
}));

jest.mock("@/theme/AppThemeProvider", () => ({
  useAppTheme: () => ({ colorScheme: mockColorScheme }),
}));

jest.mock("@/features/prayer/rosary/garden/useRosaryGarden", () => ({ useRosaryGarden: jest.fn() }));

const { useRosaryGarden } = jest.requireMock("@/features/prayer/rosary/garden/useRosaryGarden") as {
  useRosaryGarden: jest.Mock;
};

const days = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1;
  return {
    completed: day === 3,
    date: `2026-08-${String(day).padStart(2, "0")}`,
    day,
    flowerVariant: day === 3 ? "redRose" : undefined,
    isEligible: day <= 8,
    isFuture: day > 8,
    isToday: day === 8,
  };
});

function relativeLuminance(hexColor: string): number {
  const channels = hexColor
    .slice(1)
    .match(/../g)!
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(firstColor: string, secondColor: string): number {
  const luminances = [relativeLuminance(firstColor), relativeLuminance(secondColor)].sort(
    (left, right) => right - left,
  );
  return (luminances[0] + 0.05) / (luminances[1] + 0.05);
}

function mockGarden(isUsingMockData = false, hasNavigationError = false) {
  useRosaryGarden.mockReturnValue({
    canGoNext: false,
    canGoPrevious: true,
    days,
    goToNextMonth,
    goToPreviousMonth,
    hasNavigationError,
    isLoading: false,
    isUsingMockData,
    markTodayCompleted: jest.fn(),
    retryMonthLoad,
    selectedMonthNumber: 8,
    selectedYear: 2026,
    stats: { completedDays: 1, completionPercentage: 13, currentStreak: 1, eligibleDays: 8, longestStreak: 1 },
  });
}

describe("RosaryGardenSection", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockColorScheme = "dark";
    mockResponsiveLayout.mockReturnValue(phoneLayout);
    setActiveAppTheme(darkTheme);
    mockGarden();
    await i18n.changeLanguage("en");
  });

  afterEach(() => {
    mockColorScheme = "dark";
    setActiveAppTheme(darkTheme);
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders the remaining garden areas without the relocated inspiration cards", async () => {
    await render(<RosaryGardenSection onPrayToday={jest.fn()} />);

    const gardenCard = screen.getByTestId("rosary-garden-card");
    expect(within(gardenCard).getByRole("header", { name: "Rosary Garden" })).toBeTruthy();
    expect(within(gardenCard).getByText("August 2026")).toBeTruthy();
    expect(within(gardenCard).getByLabelText("Monthly Rosary Garden calendar")).toBeTruthy();
    expect(within(gardenCard).getByText("CURRENT STREAK")).toBeTruthy();
    expect(within(gardenCard).getByRole("button", { name: "Pray today's rosary" })).toBeTruthy();
    expect(screen.queryByLabelText("Devotional quote from Our Lady of Fatima")).toBeNull();
    expect(screen.queryByText("Plant Today’s Flower")).toBeNull();

    const outerStyle = StyleSheet.flatten(gardenCard.props.style);
    expect(outerStyle.borderWidth).toBeGreaterThan(0);
    expect(outerStyle).toMatchObject({ overflow: "hidden" });

    expect(StyleSheet.flatten(screen.getByTestId("garden-hero").props.style)).toMatchObject({
      borderRadius: 0,
      borderWidth: 0,
    });
    expect(StyleSheet.flatten(screen.getByTestId("garden-calendar-area").props.style)).toMatchObject({
      width: "100%",
    });
    expect(StyleSheet.flatten(screen.getByTestId("garden-calendar").props.style)).toMatchObject({
      backgroundColor: "transparent",
      borderRadius: 0,
      borderWidth: 0,
    });
    expect(StyleSheet.flatten(screen.getByTestId("garden-stats").props.style)).toMatchObject({
      backgroundColor: "transparent",
      borderRadius: 0,
      borderWidth: 0,
    });

    expect(
      StyleSheet.flatten(screen.getByLabelText("Current streak 1 days").props.style).borderLeftWidth,
    ).toBeGreaterThan(0);

    await fireEvent.press(screen.getByTestId("garden-previous-month"));
    expect(goToPreviousMonth).toHaveBeenCalledTimes(1);
  });

  it("shows preview status and delegates the prayer action", async () => {
    const onPrayToday = jest.fn();
    mockGarden(true);

    await render(<RosaryGardenSection onPrayToday={onPrayToday} />);

    expect(within(screen.getByTestId("rosary-garden-card")).getByLabelText("Garden preview data")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Pray today's rosary" }));
    expect(onPrayToday).toHaveBeenCalledTimes(1);
  });

  it("uses high-contrast light-mode text and action colors throughout the Garden card", async () => {
    mockColorScheme = "light";
    setActiveAppTheme(lightTheme);
    mockGarden(false, true);
    await render(<RosaryGardenSection onPrayToday={jest.fn()} />);

    const primaryText = lightTheme.colors.text.primary;
    const secondaryText = lightTheme.colors.text.secondary;
    expect(StyleSheet.flatten(screen.getByText("Rosary Garden").props.style).color).toBe(primaryText);
    expect(
      StyleSheet.flatten(screen.getByText("Complete a rosary each day\nto make the garden bloom.").props.style).color,
    ).toBe(secondaryText);
    expect(StyleSheet.flatten(screen.getByText("August 2026").props.style).color).toBe(primaryText);
    expect(StyleSheet.flatten(screen.getByText("CURRENT STREAK").props.style).color).toBe(secondaryText);
    expect(
      StyleSheet.flatten(within(screen.getByLabelText("Current streak 1 days")).getByText("1").props.style).color,
    ).toBe(primaryText);
    expect(StyleSheet.flatten(within(screen.getByTestId("garden-weekday-0")).getByText("S").props.style).color).toBe(
      secondaryText,
    );
    expect(StyleSheet.flatten(screen.getByText("Couldn’t load that month’s Rosary Garden.").props.style).color).toBe(
      primaryText,
    );

    for (const backgroundColor of lightTheme.colors.gradients.gardenHero) {
      expect(contrastRatio(primaryText, backgroundColor)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(secondaryText, backgroundColor)).toBeGreaterThanOrEqual(4.5);
    }
    expect(lightTheme.colors.gradients.prayButton).toEqual(["#2F7A59", "#20583F"]);
    for (const backgroundColor of lightTheme.colors.gradients.prayButton) {
      expect(contrastRatio(lightTheme.colors.text.white, backgroundColor)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("preserves the Garden card's existing dark-mode color treatment", async () => {
    mockGarden(false, true);
    await render(<RosaryGardenSection onPrayToday={jest.fn()} />);

    expect(StyleSheet.flatten(screen.getByText("Rosary Garden").props.style).color).toBe(darkTheme.colors.text.white);
    expect(
      StyleSheet.flatten(screen.getByText("Complete a rosary each day\nto make the garden bloom.").props.style).color,
    ).toBe("#D3E2DD");
    expect(StyleSheet.flatten(screen.getByText("August 2026").props.style).color).toBe(darkTheme.colors.text.white);
    expect(StyleSheet.flatten(screen.getByText("CURRENT STREAK").props.style).color).toBe(darkTheme.colors.text.muted);
    expect(darkTheme.colors.gradients.prayButton).toEqual(["#276EEA", "#154FAE"]);
  });

  it("announces a failed month load and retries in English and Spanish", async () => {
    mockGarden(false, true);
    await render(<RosaryGardenSection onPrayToday={jest.fn()} />);

    expect(screen.getByText("Couldn’t load that month’s Rosary Garden.")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Retry month" }));
    expect(retryMonthLoad).toHaveBeenCalledTimes(1);

    await act(async () => {
      await i18n.changeLanguage("es");
    });
    expect(screen.getByText("No se pudo cargar el Jardín del Rosario de ese mes.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Volver a cargar el mes" })).toBeTruthy();
  });

  it("keeps garden content responsive on narrow phones, tablets, and large text", async () => {
    const rendered = await render(<RosaryGardenSection onPrayToday={jest.fn()} />);

    mockResponsiveLayout.mockReturnValue({
      ...phoneLayout,
      contentWidth: 320,
      isNarrowPhone: true,
      width: 320,
    });
    await rendered.rerender(<RosaryGardenSection onPrayToday={jest.fn()} />);
    expect(StyleSheet.flatten(screen.getByTestId("garden-stats").props.style).flexDirection).toBe("column");

    mockResponsiveLayout.mockReturnValue({
      ...phoneLayout,
      contentWidth: 736,
      height: 1024,
      isTablet: true,
      size: "tablet",
      width: 768,
    });
    await rendered.rerender(<RosaryGardenSection onPrayToday={jest.fn()} />);
    expect(StyleSheet.flatten(screen.getByTestId("garden-stats").props.style).flexDirection).toBe("row");

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
    await rendered.rerender(<RosaryGardenSection onPrayToday={jest.fn()} />);
    expect(StyleSheet.flatten(screen.getByTestId("garden-stats").props.style).flexDirection).toBe("column");
  });

  it("retains Spanish garden content", async () => {
    await i18n.changeLanguage("es");
    await render(<RosaryGardenSection onPrayToday={jest.fn()} />);

    expect(screen.getByRole("header", { name: "Jardín del Rosario" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Rezar el Rosario de hoy" })).toBeTruthy();
  });
});
