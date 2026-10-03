import { fireEvent, render, screen } from "@testing-library/react-native";

import { AppLanguageProvider } from "@/localization";

import { AchievementAlert } from "./AchievementAlert";

describe("AchievementAlert", () => {
  it("announces its message, shows confetti, and can be dismissed", async () => {
    const onDismiss = jest.fn();
    await render(
      <AppLanguageProvider>
        <AchievementAlert
          message="Account set up! Remember to seek first His kingdom, and all else will follow."
          onDismiss={onDismiss}
        />
      </AppLanguageProvider>,
    );

    expect(screen.getByTestId("achievement-alert").props.accessibilityRole).toBe("alert");
    expect(
      screen.getByText("Account set up! Remember to seek first His kingdom, and all else will follow."),
    ).toBeTruthy();
    expect(screen.getByTestId("achievement-confetti")).toBeTruthy();

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
});
