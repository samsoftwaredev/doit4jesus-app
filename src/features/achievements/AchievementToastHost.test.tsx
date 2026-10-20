import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppLanguageProvider, i18n } from "@/localization";
import { theme } from "@/theme/tokens";

import { AchievementProvider, useAchievement } from "./AchievementProvider";
import { AchievementToastHost } from "./AchievementToastHost";

/** Queues an onboarding completion message for the global toast host. */
function AchievementTrigger() {
  const { queueAchievement } = useAchievement();

  return (
    <Pressable accessibilityRole="button" onPress={() => queueAchievement({ type: "onboarding-complete" })}>
      <Text>Show achievement</Text>
    </Pressable>
  );
}

/** Queues a resolved badge award for the global toast host. */
function BadgeAchievementTrigger() {
  const { queueAchievement } = useAchievement();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        queueAchievement({
          type: "badge-award",
          badge: {
            code: "FIRST_ROSARY",
            iconUrl: "https://example.com/first-rosary.png",
            id: "badge-1",
            name: "First Rosary",
          },
        })
      }
    >
      <Text>Show badge award</Text>
    </Pressable>
  );
}

/** Queues a daily Scripture completion message for the global toast host. */
function DailyScriptureAchievementTrigger() {
  const { queueAchievement } = useAchievement();

  return (
    <Pressable accessibilityRole="button" onPress={() => queueAchievement({ type: "daily-scripture-complete" })}>
      <Text>Show Scripture completion</Text>
    </Pressable>
  );
}

/** Renders the reactive achievement provider with the globally positioned toast host. */
function renderToastHost() {
  return render(
    <AppLanguageProvider>
      <SafeAreaProvider
        initialMetrics={{
          frame: { height: 844, width: 390, x: 0, y: 0 },
          insets: { bottom: 0, left: 0, right: 0, top: 0 },
        }}
      >
        <AchievementProvider>
          <AchievementTrigger />
          <BadgeAchievementTrigger />
          <DailyScriptureAchievementTrigger />
          <AchievementToastHost />
        </AchievementProvider>
      </SafeAreaProvider>
    </AppLanguageProvider>,
  );
}

describe("AchievementToastHost", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage("en");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows a queued onboarding achievement in a top-centered viewport layer and allows dismissal", async () => {
    await renderToastHost();

    await fireEvent.press(screen.getByRole("button", { name: "Show achievement" }));

    expect(await screen.findByText("Congrats! 🎉 Your account is ready.")).toBeTruthy();
    expect(StyleSheet.flatten(screen.getByTestId("achievement-toast-host").props.style)).toEqual(
      expect.objectContaining({ position: "absolute", top: 0, zIndex: theme.zIndex.toast }),
    );
    expect(StyleSheet.flatten(screen.getByTestId("achievement-toast-content").props.style)).toEqual(
      expect.objectContaining({ alignSelf: "center" }),
    );

    await fireEvent.press(screen.getByRole("button", { name: "Dismiss message" }));
    expect(screen.queryByTestId("achievement-alert")).toBeNull();
  });

  it("automatically dismisses the toast after five seconds", async () => {
    jest.useFakeTimers();
    await renderToastHost();

    await fireEvent.press(screen.getByRole("button", { name: "Show achievement" }));
    expect(await screen.findByTestId("achievement-alert")).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });
    expect(screen.queryByTestId("achievement-alert")).toBeNull();
  });

  it("uses the Spanish completion announcement", async () => {
    await renderToastHost();
    await act(async () => i18n.changeLanguage("es"));

    await fireEvent.press(screen.getByRole("button", { name: "Show achievement" }));
    expect(await screen.findByText("¡Felicidades! 🎉 Tu cuenta está lista.")).toBeTruthy();
  });

  it("celebrates daily Scripture completion with localized confetti toast copy", async () => {
    await renderToastHost();

    await fireEvent.press(screen.getByRole("button", { name: "Show Scripture completion" }));
    expect(await screen.findByText("You completed today’s Scripture! 🎉")).toBeTruthy();
    expect(screen.getByTestId("achievement-confetti")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Dismiss message" }));
    await act(async () => i18n.changeLanguage("es"));
    await fireEvent.press(screen.getByRole("button", { name: "Show Scripture completion" }));
    expect(await screen.findByText("¡Completaste la Escritura de hoy! 🎉")).toBeTruthy();
  });

  it("announces a localized badge award with its resolved artwork", async () => {
    await renderToastHost();
    await act(async () => i18n.changeLanguage("es"));

    await fireEvent.press(screen.getByRole("button", { name: "Show badge award" }));

    expect(await screen.findByText("¡Obtuviste First Rosary!")).toBeTruthy();
    expect(screen.getByTestId("achievement-badge-artwork")).toBeTruthy();
  });
});
