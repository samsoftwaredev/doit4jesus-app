import { render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { AppLoadingScreen } from "./AppLoadingScreen";

let mockColorScheme: "light" | "dark" = "dark";

jest.mock("@/theme/AppThemeProvider", () => ({
  useAppTheme: () => ({ colorScheme: mockColorScheme }),
}));

describe("AppLoadingScreen", () => {
  beforeEach(async () => {
    mockColorScheme = "dark";
    await i18n.changeLanguage("en");
  });

  it("centers the company logo above an accessible indeterminate progress bar", async () => {
    await render(<AppLoadingScreen />);

    expect(screen.getByRole("image", { name: "Do It for Jesus" }).props.source).toEqual([
      require("../../../assets/svgs/whiteCompanyLogo.svg"),
    ]);
    expect(screen.getByRole("progressbar", { name: "Loading your account" }).props.accessibilityValue).toEqual({
      text: "Loading your account",
    });
    expect(screen.getByTestId("app-loading-content").props.style).toEqual(
      expect.objectContaining({ alignItems: "center", justifyContent: "center" }),
    );
  });

  it("uses the dark logo in light appearance", async () => {
    mockColorScheme = "light";

    await render(<AppLoadingScreen />);

    expect(screen.getByRole("image", { name: "Do It for Jesus" }).props.source).toEqual([
      require("../../../assets/svgs/blackCompanyLogo.svg"),
    ]);
  });

  it("localizes the progress announcement in Spanish", async () => {
    await i18n.changeLanguage("es");

    await render(<AppLoadingScreen />);

    expect(screen.getByRole("progressbar", { name: "Cargando tu cuenta" })).toBeTruthy();
  });
});
