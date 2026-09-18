import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { i18n } from "@/localization";
import type { ResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { RosaryGardenSection } from "./RosaryGardenSection";

const goToNextMonth = jest.fn();
const goToPreviousMonth = jest.fn();
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

jest.mock("expo-haptics", () => ({
  ImpactFeedbackStyle: { Light: "light" },
  impactAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock("@/hooks/useResponsiveLayout", () => ({
  useResponsiveLayout: () => mockResponsiveLayout(),
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

function mockGarden(isUsingMockData = false) {
  useRosaryGarden.mockReturnValue({
    canGoNext: false,
    canGoPrevious: true,
    days,
    goToNextMonth,
    goToPreviousMonth,
    isLoading: false,
    isUsingMockData,
    markTodayCompleted: jest.fn(),
    selectedMonthNumber: 8,
    selectedYear: 2026,
    stats: { completedDays: 1, completionPercentage: 13, currentStreak: 1, eligibleDays: 8, longestStreak: 1 },
  });
}

describe("RosaryGardenSection", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockResponsiveLayout.mockReturnValue(phoneLayout);
    mockGarden();
    await i18n.changeLanguage("en");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders every garden area and supports month navigation", async () => {
    await render(<RosaryGardenSection onPrayToday={jest.fn()} />);

    expect(screen.getByRole("header", { name: "Rosary Garden" })).toBeTruthy();
    expect(screen.getByText("August 2026")).toBeTruthy();
    expect(screen.getByLabelText("Monthly Rosary Garden calendar")).toBeTruthy();
    expect(screen.getByLabelText("Devotional quote from Our Lady of Fatima")).toBeTruthy();
    expect(screen.getByText("Plant Today’s Flower")).toBeTruthy();
    expect(screen.getByText("CURRENT STREAK")).toBeTruthy();

    await fireEvent.press(screen.getByTestId("garden-previous-month"));
    expect(goToPreviousMonth).toHaveBeenCalledTimes(1);
  });

  it("shows preview status and delegates the prayer action", async () => {
    const onPrayToday = jest.fn();
    mockGarden(true);

    await render(<RosaryGardenSection onPrayToday={onPrayToday} />);

    expect(screen.getByLabelText("Garden preview data")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Pray today's rosary" }));
    expect(onPrayToday).toHaveBeenCalledTimes(1);
  });

  it("uses a single column on phones and a calendar-and-quote row on tablets", async () => {
    const rendered = await render(<RosaryGardenSection onPrayToday={jest.fn()} />);
    expect(StyleSheet.flatten(screen.getByTestId("garden-calendar-area").props.style).flexDirection).not.toBe("row");

    mockResponsiveLayout.mockReturnValue({
      ...phoneLayout,
      contentWidth: 736,
      height: 1024,
      isTablet: true,
      size: "tablet",
      width: 768,
    });
    await rendered.rerender(<RosaryGardenSection onPrayToday={jest.fn()} />);

    expect(StyleSheet.flatten(screen.getByTestId("garden-calendar-area").props.style)).toMatchObject({
      flexDirection: "row",
    });

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

    expect(StyleSheet.flatten(screen.getByTestId("garden-calendar-area").props.style).flexDirection).not.toBe("row");
  });

  it("retains Spanish garden content", async () => {
    await i18n.changeLanguage("es");
    await render(<RosaryGardenSection onPrayToday={jest.fn()} />);

    expect(screen.getByRole("header", { name: "Jardín del Rosario" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Rezar el Rosario de hoy" })).toBeTruthy();
  });
});
