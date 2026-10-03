import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import { StyleSheet } from "react-native";

import SettingsScreen from "@/app/settings";
import { APP_LANGUAGE_PREFERENCE_STORAGE_KEY, AppLanguageProvider } from "@/localization";
import { AppThemeProvider } from "@/theme/AppThemeProvider";
import { APP_VISUAL_EFFECTS_PREFERENCE_STORAGE_KEY, AppVisualEffectsProvider } from "@/theme/AppVisualEffectsProvider";

const mockGetNotificationPreferences = jest.fn();
const mockReplaceNotificationPreferences = jest.fn();
const mockUpdateNotificationPreferences = jest.fn();

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;

jest.mock("@/features/auth", () => ({
  useAuth: () => ({ configurationError: null }),
}));

jest.mock("@/features/profile", () => ({
  useCurrentProfile: () => ({
    notificationPreferences: null,
    replaceNotificationPreferences: mockReplaceNotificationPreferences,
  }),
}));

jest.mock("@/features/onboarding", () => ({
  getNotificationPreferences: (...args: unknown[]) => mockGetNotificationPreferences(...args),
  updateNotificationPreferences: (...args: unknown[]) => mockUpdateNotificationPreferences(...args),
}));

describe("appearance settings", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    jest.spyOn(ReactNative, "useColorScheme").mockReturnValue("dark");
    mockGetNotificationPreferences.mockResolvedValue({
      confessionReminder: false,
      dailyRosaryReminder: true,
      eucharisticAdoration: false,
    });
    mockUpdateNotificationPreferences.mockImplementation(async (update) => ({
      confessionReminder: false,
      dailyRosaryReminder: true,
      eucharisticAdoration: false,
      ...update,
    }));
  });

  it("exposes one accessible radio group and applies the selected appearance immediately", async () => {
    await render(
      <AppLanguageProvider>
        <AppThemeProvider>
          <AppVisualEffectsProvider>
            <SettingsScreen />
          </AppVisualEffectsProvider>
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
          <AppVisualEffectsProvider>
            <SettingsScreen />
          </AppVisualEffectsProvider>
        </AppThemeProvider>
      </AppLanguageProvider>,
    );

    await fireEvent.press(await screen.findByRole("radio", { name: "Español" }));

    expect(await screen.findByRole("header", { name: "Configuración" })).toBeTruthy();
    expect(screen.getByText("Idioma")).toBeTruthy();
    expect(screen.getByRole("switch", { name: "Iluminación de fondo" })).toBeTruthy();
    expect(screen.getByRole("switch", { name: "Polvo de fondo" })).toBeTruthy();
    expect(mockSetItem).toHaveBeenCalledWith(APP_LANGUAGE_PREFERENCE_STORAGE_KEY, "es");
  });

  it("persists independently accessible lighting and dust switches", async () => {
    await render(
      <AppLanguageProvider>
        <AppThemeProvider>
          <AppVisualEffectsProvider>
            <SettingsScreen />
          </AppVisualEffectsProvider>
        </AppThemeProvider>
      </AppLanguageProvider>,
    );

    const lighting = await screen.findByRole("switch", { name: "Background lighting" });
    const dust = screen.getByRole("switch", { name: "Background dust" });
    expect(lighting.props.accessibilityState).toMatchObject({ checked: false });
    expect(dust.props.accessibilityState).toMatchObject({ checked: false });

    fireEvent(lighting, "valueChange", true);

    await waitFor(() => expect(lighting.props.accessibilityState).toMatchObject({ checked: true }));
    expect(dust.props.accessibilityState).toMatchObject({ checked: false });
    expect(mockSetItem).toHaveBeenCalledWith(
      APP_VISUAL_EFFECTS_PREFERENCE_STORAGE_KEY,
      JSON.stringify({ dustEnabled: false, lightingEnabled: true }),
    );
  });

  it("separates each settings card with the shared spacing token", async () => {
    await render(
      <AppLanguageProvider>
        <AppThemeProvider>
          <AppVisualEffectsProvider>
            <SettingsScreen />
          </AppVisualEffectsProvider>
        </AppThemeProvider>
      </AppLanguageProvider>,
    );

    expect(StyleSheet.flatten(screen.getByTestId("settings-card-list").props.style)).toMatchObject({ gap: 16 });
  });

  it("loads, saves, and exposes accessible prayer reminder switches above account actions", async () => {
    await render(
      <AppLanguageProvider>
        <AppThemeProvider>
          <AppVisualEffectsProvider>
            <SettingsScreen />
          </AppVisualEffectsProvider>
        </AppThemeProvider>
      </AppLanguageProvider>,
    );

    const rosaryReminder = await screen.findByRole("switch", { name: "Daily Rosary reminder" });
    expect(rosaryReminder.props.accessibilityState).toMatchObject({ checked: true });
    expect(screen.getByRole("switch", { name: "Confession reminder" }).props.accessibilityState).toMatchObject({
      checked: false,
    });
    expect(screen.getByText("Prayer and reminders")).toBeTruthy();
    expect(screen.getByText("Sign out")).toBeTruthy();

    await act(async () => {
      fireEvent(rosaryReminder, "valueChange", false);
    });

    await waitFor(() => expect(mockUpdateNotificationPreferences).toHaveBeenCalledWith({ dailyRosaryReminder: false }));
    await waitFor(() =>
      expect(mockReplaceNotificationPreferences).toHaveBeenCalledWith(
        expect.objectContaining({ dailyRosaryReminder: false }),
      ),
    );
  });

  it("shows Spanish reminder labels and retries a failed preference load", async () => {
    mockGetNotificationPreferences.mockRejectedValueOnce(new Error("offline"));
    await render(
      <AppLanguageProvider>
        <AppThemeProvider>
          <AppVisualEffectsProvider>
            <SettingsScreen />
          </AppVisualEffectsProvider>
        </AppThemeProvider>
      </AppLanguageProvider>,
    );

    expect(await screen.findByText("We couldn't load your reminder preferences. Please try again.")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Try Again" }));
    await screen.findByRole("switch", { name: "Daily Rosary reminder" });
    await fireEvent.press(screen.getByRole("radio", { name: "Español" }));

    expect(await screen.findByRole("switch", { name: "Recordatorio del Rosario diario" })).toBeTruthy();
  });
});
