import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import type { ResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { i18n } from "@/localization";
import { darkTheme, lightTheme, setActiveAppTheme } from "@/theme/tokens";

import { DailyRosaryCard } from "./DailyRosaryCard";

const serverNow = "2026-08-29T18:00:00.000Z";
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

jest.mock("@/hooks/useResponsiveLayout", () => ({
  useResponsiveLayout: () => mockResponsiveLayout(),
}));

jest.mock("@/theme/AppThemeProvider", () => ({
  useAppTheme: () => ({ colorScheme: mockColorScheme }),
}));

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

function reminder({
  completed = false,
  seconds = 4 * 60 * 60,
  status = "active",
}: {
  completed?: boolean;
  seconds?: number;
  status?: "active" | "at-risk" | "none" | "reset";
} = {}) {
  return {
    completed,
    deadlineAt: new Date(Date.parse(serverNow) + seconds * 1000).toISOString(),
    serverNow,
    streak: { current: 28, longest: 42, status },
  } as const;
}

function renderCard(overrides: Partial<React.ComponentProps<typeof DailyRosaryCard>> = {}) {
  return render(
    <DailyRosaryCard
      error={false}
      isLoading={false}
      onExpired={jest.fn()}
      onPrayRosary={jest.fn()}
      onRetry={jest.fn()}
      onViewGarden={jest.fn()}
      reminder={reminder()}
      {...overrides}
    />,
  );
}

describe("DailyRosaryCard", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockColorScheme = "dark";
    mockResponsiveLayout.mockReturnValue(phoneLayout);
    setActiveAppTheme(darkTheme);
    await i18n.changeLanguage("en");
  });

  afterEach(() => {
    jest.useRealTimers();
    mockColorScheme = "dark";
    setActiveAppTheme(darkTheme);
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("teaches a new user the daily prayer cycle in one card", async () => {
    await renderCard({ reminder: reminder({ seconds: 4 * 60 * 60, status: "none" }) });

    expect(screen.getByText("Plant Today’s Flower")).toBeTruthy();
    expect(screen.getByText("Pray today")).toBeTruthy();
    expect(screen.getByText("Plant a flower")).toBeTruthy();
    expect(screen.getByText("Grow your streak")).toBeTruthy();
    expect(screen.getByText("Miss a day and your streak starts again. You can always begin again.")).toBeTruthy();
    expect(screen.getByText("Begin a prayerful rhythm today.")).toBeTruthy();
    expect(screen.getByText("04:00:00 until Rosary streak resets")).toBeTruthy();
    expect(screen.getByLabelText("4 hours, 0 minutes, 0 seconds until Rosary streak resets")).toBeTruthy();
    expect(StyleSheet.flatten(screen.getByTestId("rosary-countdown").props.style)).toMatchObject({
      flexShrink: 1,
      maxWidth: "100%",
      textAlign: "center",
    });
    expect(screen.queryByLabelText("Devotional quote from Our Lady of Fatima")).toBeNull();
    expect(screen.getByRole("button", { name: "Pray Rosary" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "View Garden" })).toBeEnabled();

    expect(StyleSheet.flatten(screen.getByTestId("daily-rosary-habit-card").props.style).borderWidth).toBeGreaterThan(
      0,
    );
    expect(StyleSheet.flatten(screen.getByTestId("garden-motivation-card").props.style)).toMatchObject({
      backgroundColor: "transparent",
      borderWidth: 0,
    });
    expect(screen.queryByTestId("garden-quote-card")).toBeNull();
  });

  it("opens the Rosary Garden from the secondary Home action", async () => {
    const onViewGarden = jest.fn();
    await renderCard({ onViewGarden });

    await fireEvent.press(screen.getByRole("button", { name: "View Garden" }));

    expect(onViewGarden).toHaveBeenCalledTimes(1);
  });

  it("promotes the countdown once at three hours and keeps one urgent treatment", async () => {
    const rendered = await renderCard({ reminder: reminder({ seconds: 3 * 60 * 60 + 1 }) });
    const subtleStyle = StyleSheet.flatten(screen.getByTestId("rosary-countdown").props.style);
    expect(screen.getByText("03:00:01 until Rosary streak resets")).toBeTruthy();

    await rendered.rerender(
      <DailyRosaryCard
        error={false}
        isLoading={false}
        onExpired={jest.fn()}
        onPrayRosary={jest.fn()}
        onRetry={jest.fn()}
        onViewGarden={jest.fn()}
        reminder={reminder({ seconds: 3 * 60 * 60 })}
      />,
    );
    const urgentStyle = StyleSheet.flatten(screen.getByTestId("rosary-countdown").props.style);
    expect(urgentStyle.fontSize).toBeGreaterThan(subtleStyle.fontSize);

    for (const seconds of [60 * 60, 15 * 60]) {
      await rendered.rerender(
        <DailyRosaryCard
          error={false}
          isLoading={false}
          onExpired={jest.fn()}
          onPrayRosary={jest.fn()}
          onRetry={jest.fn()}
          onViewGarden={jest.fn()}
          reminder={reminder({ seconds })}
        />,
      );
      expect(StyleSheet.flatten(screen.getByTestId("rosary-countdown").props.style)).toMatchObject({
        color: urgentStyle.color,
        fontSize: urgentStyle.fontSize,
      });
    }
  });

  it("keeps every light-mode timing treatment readable across the Daily Rosary gradients", async () => {
    mockColorScheme = "light";
    setActiveAppTheme(lightTheme);
    const rendered = await renderCard();

    expect(StyleSheet.flatten(screen.getByTestId("rosary-countdown").props.style).color).toBe(
      lightTheme.colors.text.secondary,
    );
    for (const gradient of [
      lightTheme.colors.gradients.dailyRosary,
      lightTheme.colors.gradients.dailyRosaryComplete,
      lightTheme.colors.gradients.dailyRosaryReset,
    ]) {
      for (const backgroundColor of gradient) {
        expect(contrastRatio(lightTheme.colors.text.secondary, backgroundColor)).toBeGreaterThanOrEqual(4.5);
      }
    }

    await rendered.rerender(
      <DailyRosaryCard
        error={false}
        isLoading={false}
        onExpired={jest.fn()}
        onPrayRosary={jest.fn()}
        onRetry={jest.fn()}
        onViewGarden={jest.fn()}
        reminder={reminder({ completed: true })}
      />,
    );
    expect(StyleSheet.flatten(screen.getByText("Completed today").props.style).color).toBe(
      lightTheme.colors.text.secondary,
    );

    await rendered.rerender(
      <DailyRosaryCard
        error={false}
        isLoading={false}
        onExpired={jest.fn()}
        onPrayRosary={jest.fn()}
        onRetry={jest.fn()}
        onViewGarden={jest.fn()}
        reminder={reminder({ seconds: 3 * 60 * 60 })}
      />,
    );
    const urgentColor = StyleSheet.flatten(screen.getByTestId("rosary-countdown").props.style).color;
    expect(urgentColor).toBe(lightTheme.colors.text.warning);
    for (const backgroundColor of lightTheme.colors.gradients.countdownHour) {
      expect(contrastRatio(urgentColor, backgroundColor)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("preserves the existing dark-mode Daily Rosary timing colors", async () => {
    const rendered = await renderCard();

    expect(StyleSheet.flatten(screen.getByTestId("rosary-countdown").props.style).color).toBe(
      darkTheme.colors.text.muted,
    );

    await rendered.rerender(
      <DailyRosaryCard
        error={false}
        isLoading={false}
        onExpired={jest.fn()}
        onPrayRosary={jest.fn()}
        onRetry={jest.fn()}
        onViewGarden={jest.fn()}
        reminder={reminder({ seconds: 3 * 60 * 60 })}
      />,
    );
    expect(StyleSheet.flatten(screen.getByTestId("rosary-countdown").props.style).color).toBe(
      darkTheme.colors.gold.light,
    );
  });

  it("refreshes once at expiry without hiding the Rosary action", async () => {
    jest.useFakeTimers();
    const onExpired = jest.fn();
    await renderCard({ onExpired, reminder: reminder({ seconds: 1, status: "at-risk" }) });

    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });

    await waitFor(() => expect(onExpired).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Updating time")).toBeTruthy();
    expect(screen.queryByText(/until Rosary streak resets/)).toBeNull();
    expect(screen.queryByText(/-/)).toBeNull();
    expect(screen.getByRole("button", { name: "Pray Rosary" })).toBeEnabled();
  });

  it("keeps honest timing and the Rosary action in completed, loading, error, reset, and missing-deadline states", async () => {
    const onPrayRosary = jest.fn();
    const rendered = await renderCard({ onPrayRosary, reminder: reminder({ completed: true }) });
    expect(screen.getByText("Completed today")).toBeTruthy();
    expect(screen.queryByText(/until Rosary streak resets/)).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Pray Rosary" }));
    expect(onPrayRosary).toHaveBeenCalledTimes(1);

    await rendered.rerender(
      <DailyRosaryCard
        error={false}
        isLoading
        onExpired={jest.fn()}
        onPrayRosary={onPrayRosary}
        onRetry={jest.fn()}
        onViewGarden={jest.fn()}
        reminder={null}
      />,
    );
    expect(screen.getByText("Loading time")).toBeTruthy();
    expect(screen.queryByText(/until Rosary streak resets/)).toBeNull();
    expect(screen.getByRole("button", { name: "Pray Rosary" })).toBeEnabled();

    await rendered.rerender(
      <DailyRosaryCard
        error
        isLoading={false}
        onExpired={jest.fn()}
        onPrayRosary={onPrayRosary}
        onRetry={jest.fn()}
        onViewGarden={jest.fn()}
        reminder={null}
      />,
    );
    expect(screen.getByText("Time unavailable")).toBeTruthy();
    expect(screen.queryByText(/until Rosary streak resets/)).toBeNull();
    expect(screen.getByRole("button", { name: "Pray Rosary" })).toBeEnabled();

    await rendered.rerender(
      <DailyRosaryCard
        error={false}
        isLoading={false}
        onExpired={jest.fn()}
        onPrayRosary={onPrayRosary}
        onRetry={jest.fn()}
        onViewGarden={jest.fn()}
        reminder={reminder({ seconds: 2 * 60 * 60, status: "reset" })}
      />,
    );
    expect(screen.getByText("Streak Reset")).toBeTruthy();
    expect(screen.getByText("Start again today.")).toBeTruthy();
    expect(screen.getByText("02:00:00 until Rosary streak resets")).toBeTruthy();

    await rendered.rerender(
      <DailyRosaryCard
        error={false}
        isLoading={false}
        onExpired={jest.fn()}
        onPrayRosary={onPrayRosary}
        onRetry={jest.fn()}
        onViewGarden={jest.fn()}
        reminder={{ ...reminder({ status: "reset" }), deadlineAt: null }}
      />,
    );
    expect(screen.getByText("Time unavailable")).toBeTruthy();
    expect(screen.queryByText(/until Rosary streak resets/)).toBeNull();
    expect(screen.getByRole("button", { name: "Pray Rosary" })).toBeEnabled();
  });

  it("localizes the combined teaching and timing status in Spanish", async () => {
    await i18n.changeLanguage("es");
    await renderCard({ reminder: reminder({ status: "none" }) });

    expect(screen.getByText("Reza hoy")).toBeTruthy();
    expect(screen.getByText("Planta una flor")).toBeTruthy();
    expect(screen.getByText("Aumenta tu racha")).toBeTruthy();
    expect(screen.getByText("04:00:00 hasta que se reinicie la racha del Rosario")).toBeTruthy();
    expect(
      screen.getByLabelText("4 horas, 0 minutos, 0 segundos hasta que se reinicie la racha del Rosario"),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Rezar el Rosario" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Ver jardín" })).toBeEnabled();
  });

  it("keeps the complete countdown explanation available on narrow screens with large text", async () => {
    mockResponsiveLayout.mockReturnValue({
      ...phoneLayout,
      contentWidth: 288,
      fontScale: 1.6,
      isLargeText: true,
      isNarrowPhone: true,
      width: 320,
    });

    await renderCard();

    const countdown = screen.getByText("04:00:00 until Rosary streak resets");
    expect(countdown.props.numberOfLines).toBeUndefined();
    expect(screen.getByRole("button", { name: "Pray Rosary" })).toBeEnabled();
  });

  it("cleans up the synchronized timer on unmount", async () => {
    const clearIntervalSpy = jest.spyOn(globalThis, "clearInterval");
    const rendered = await renderCard();
    await rendered.unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
