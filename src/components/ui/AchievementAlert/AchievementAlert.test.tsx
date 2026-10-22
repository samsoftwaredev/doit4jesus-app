import { fireEvent, render, screen } from "@testing-library/react-native";

import { AppLanguageProvider } from "@/localization";

import { AchievementAlert } from "./AchievementAlert";

describe("AchievementAlert", () => {
  it("announces its message without constraining the host-owned confetti and can be dismissed", async () => {
    const onDismiss = jest.fn();
    await render(
      <AppLanguageProvider>
        <AchievementAlert message="Congrats! 🎉 Your account is ready." onDismiss={onDismiss} />
      </AppLanguageProvider>,
    );

    expect(screen.getByTestId("achievement-alert").props.accessibilityRole).toBe("alert");
    expect(screen.getByText("Congrats! 🎉 Your account is ready.")).toBeTruthy();
    expect(screen.queryByTestId("achievement-confetti")).toBeNull();

    await fireEvent.press(screen.getByRole("button", { name: "Dismiss message" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("uses the localized dismiss action with Spanish achievement copy", async () => {
    await render(
      <AppLanguageProvider>
        <AchievementAlert message="Crece en la fe. Cambia el mundo por Jesús." onDismiss={jest.fn()} />
      </AppLanguageProvider>,
    );

    expect(screen.getByText("Crece en la fe. Cambia el mundo por Jesús.")).toBeTruthy();
  });

  it("shows badge artwork and restores the award icon if the image cannot load", async () => {
    await render(
      <AppLanguageProvider>
        <AchievementAlert
          badgeArtwork={{ uri: "https://example.com/first-rosary.png" }}
          message="You earned First Rosary!"
          onDismiss={jest.fn()}
        />
      </AppLanguageProvider>,
    );

    expect(screen.getByTestId("achievement-badge-artwork")).toBeTruthy();

    await fireEvent(screen.getByTestId("achievement-badge-artwork"), "error", { nativeEvent: {} });

    expect(screen.queryByTestId("achievement-badge-artwork")).toBeNull();
    expect(screen.getByTestId("achievement-icon-fallback")).toBeTruthy();
  });
});
