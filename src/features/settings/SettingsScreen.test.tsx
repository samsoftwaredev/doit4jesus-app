import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import { StyleSheet } from "react-native";

import SettingsScreen from "@/app/settings";
import { APP_LANGUAGE_PREFERENCE_STORAGE_KEY, AppLanguageProvider } from "@/localization";
import { AppThemeProvider } from "@/theme/AppThemeProvider";

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;

jest.mock("@/features/auth", () => ({
  useAuth: () => ({ configurationError: null }),
}));

describe("appearance settings", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    jest.spyOn(ReactNative, "useColorScheme").mockReturnValue("dark");
  });

  it("exposes one accessible radio group and applies the selected appearance immediately", async () => {
    await render(
      <AppLanguageProvider>
        <AppThemeProvider>
          <SettingsScreen />
        </AppThemeProvider>
      </AppLanguageProvider>,
    );

    const system = await screen.findByRole("radio", { name: "System" });
    const light = screen.getByRole("radio", { name: "Light" });
    const dark = screen.getByRole("radio", { name: "Dark" });

    expect(system.props.accessibilityState).toMatchObject({ checked: true });
    expect(light.props.accessibilityState).toMatchObject({ checked: false });
    expect(dark.props.accessibilityState).toMatchObject({ checked: false });
    expect(StyleSheet.flatten(screen.getByText("Appearance").props.style)).toMatchObject({
      color: "#F4F7F8",
    });

    fireEvent.press(light);

    await waitFor(() => expect(light.props.accessibilityState).toMatchObject({ checked: true }));
    expect(StyleSheet.flatten(screen.getByTestId("settings-screen").props.style)).toMatchObject({
      backgroundColor: "#F7F1E6",
    });
    expect(StyleSheet.flatten(screen.getByText("Appearance").props.style)).toMatchObject({
      color: "#132536",
    });
    expect(mockSetItem).toHaveBeenCalledWith(expect.stringContaining("theme-preference"), "light");
  });

  it("switches the whole screen to Spanish and stores the explicit language", async () => {
    await render(
      <AppLanguageProvider>
        <AppThemeProvider>
          <SettingsScreen />
        </AppThemeProvider>
      </AppLanguageProvider>,
    );

    await fireEvent.press(await screen.findByRole("radio", { name: "Español" }));

    expect(await screen.findByRole("header", { name: "Configuración" })).toBeTruthy();
    expect(screen.getByText("Idioma")).toBeTruthy();
    expect(mockSetItem).toHaveBeenCalledWith(APP_LANGUAGE_PREFERENCE_STORAGE_KEY, "es");
  });
});
