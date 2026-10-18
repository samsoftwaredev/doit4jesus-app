import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import LandingScreen from "@/app/index";
import { darkTheme, lightTheme } from "@/theme/tokens";
import type { AppTheme } from "@/theme/tokens";

let mockColorScheme: "light" | "dark" = "dark";
let mockAppTheme: AppTheme = darkTheme;
const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/theme/AppThemeProvider", () => ({
  useAppTheme: () => ({ colorScheme: mockColorScheme, theme: mockAppTheme }),
}));

jest.mock("@/hooks/useResponsiveLayout", () => ({
  useResponsiveLayout: () => ({
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
  }),
}));

describe("LandingScreen difference callout", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockColorScheme = "dark";
    mockAppTheme = darkTheme;
  });

  it("opens the login route from the sign-in action", async () => {
    await render(<LandingScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Sign in" }));

    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it.each([
    ["dark", darkTheme],
    ["light", lightTheme],
  ] as const)("uses readable %s-theme callout colors", async (colorScheme, selectedTheme) => {
    mockColorScheme = colorScheme;
    mockAppTheme = selectedTheme;
    await render(<LandingScreen />);

    const intro = screen.getByText("DoIt4Jesus helps you fight.");
    const detail = screen.getByText(
      "Your Catholic life becomes an adventure where what you do in the real world determines what happens in the game.",
    );
    const calloutStyle = StyleSheet.flatten(intro.parent?.props.style);

    expect(calloutStyle).toMatchObject({
      backgroundColor: selectedTheme.colors.surface.navy,
      borderColor: selectedTheme.colors.border.warning,
    });
    expect(StyleSheet.flatten(intro.props.style)).toMatchObject({ color: selectedTheme.rosary.colors.goldBright });
    expect(StyleSheet.flatten(detail.props.style)).toMatchObject({ color: selectedTheme.colors.text.secondary });
  });
});
