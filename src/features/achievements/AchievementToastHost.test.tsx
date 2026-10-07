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
    <Pressable accessibilityRole="button" onPress={() => queueAchievement("onboarding-complete")}>
      <Text>Show achievement</Text>
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
    expect(
      await screen.findByText("¡Cuenta creada! Recuerda buscar primero su Reino y todo lo demás vendrá por añadidura."),
    ).toBeTruthy();
  });
});
