import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as ReactNative from "react-native";

import {
  APP_THEME_PREFERENCE_STORAGE_KEY,
  AppThemeProvider,
  formatAppearancePreference,
  getStatusBarStyle,
  resolveColorScheme,
  useAppTheme,
} from "@/theme/AppThemeProvider";

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;

describe("AppThemeProvider", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(ReactNative, "useColorScheme").mockReturnValue("unspecified");
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue();
  });

  it("hydrates a valid stored preference before rendering its children", async () => {
    mockGetItem.mockResolvedValue("light");

    const { result } = await renderHook(() => useAppTheme(), {
      wrapper: AppThemeProvider,
    });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.preference).toBe("light");
    expect(result.current.colorScheme).toBe("light");
    expect(mockGetItem).toHaveBeenCalledWith(APP_THEME_PREFERENCE_STORAGE_KEY);
  });

  it.each([null, "sepia", "", "LIGHT"])("falls back to System for %p storage", async (storedValue) => {
    mockGetItem.mockResolvedValue(storedValue);

    const { result } = await renderHook(() => useAppTheme(), { wrapper: AppThemeProvider });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.preference).toBe("system");
    expect(result.current.colorScheme).toBe("dark");
  });

  it("recovers from failed reads and writes while applying changes immediately", async () => {
    mockGetItem.mockRejectedValueOnce(new Error("storage unavailable"));
    mockSetItem.mockRejectedValueOnce(new Error("storage unavailable"));

    const { result } = await renderHook(() => useAppTheme(), { wrapper: AppThemeProvider });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    await act(async () => result.current.setPreference("light"));

    expect(result.current.preference).toBe("light");
    expect(result.current.colorScheme).toBe("light");
    expect(mockSetItem).toHaveBeenCalledWith(APP_THEME_PREFERENCE_STORAGE_KEY, "light");
  });

  it("restores an explicit preference after remounting", async () => {
    const first = await renderHook(() => useAppTheme(), { wrapper: AppThemeProvider });
    await waitFor(() => expect(first.result.current.isHydrated).toBe(true));
    await act(async () => first.result.current.setPreference("dark"));
    await first.unmount();

    mockGetItem.mockResolvedValue("dark");
    const second = await renderHook(() => useAppTheme(), { wrapper: AppThemeProvider });
    await waitFor(() => expect(second.result.current.isHydrated).toBe(true));

    expect(second.result.current.preference).toBe("dark");
    expect(second.result.current.colorScheme).toBe("dark");
  });

  it("follows live system changes only while System is selected", async () => {
    let systemScheme: "light" | "dark" = "dark";
    jest.spyOn(ReactNative, "useColorScheme").mockImplementation(() => systemScheme);
    const provider = await renderHook(() => useAppTheme(), { wrapper: AppThemeProvider });
    await waitFor(() => expect(provider.result.current.isHydrated).toBe(true));

    systemScheme = "light";
    await provider.rerender(undefined);
    expect(provider.result.current.colorScheme).toBe("light");

    await act(async () => provider.result.current.setPreference("dark"));
    systemScheme = "light";
    await provider.rerender(undefined);
    expect(provider.result.current.colorScheme).toBe("dark");
  });

  it("uses the dark baseline when the platform does not report a scheme", () => {
    expect(resolveColorScheme("system", null)).toBe("dark");
    expect(getStatusBarStyle("dark")).toBe("light");
    expect(getStatusBarStyle("light")).toBe("dark");
  });

  it("formats System and explicit values for the profile summary", () => {
    expect(formatAppearancePreference("system", "light")).toBe("System (Light)");
    expect(formatAppearancePreference("system", "dark")).toBe("System (Dark)");
    expect(formatAppearancePreference("light", "light")).toBe("Light");
    expect(formatAppearancePreference("dark", "dark")).toBe("Dark");
  });
});
