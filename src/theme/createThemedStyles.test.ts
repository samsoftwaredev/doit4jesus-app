import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as ReactNative from "react-native";

import { AppThemeProvider, useAppTheme } from "@/theme/AppThemeProvider";
import { createThemedStyles, createThemedValue, useThemedStyles } from "@/theme/createThemedStyles";
import { darkTheme, lightTheme, setActiveAppTheme } from "@/theme/tokens";

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;

describe("theme-aware cached values", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    setActiveAppTheme(darkTheme);
  });

  beforeEach(() => {
    mockGetItem.mockResolvedValue(null);
    jest.spyOn(ReactNative, "useColorScheme").mockReturnValue("dark");
  });

  it("switches representative styles without changing the dark baseline", () => {
    setActiveAppTheme(darkTheme);
    const styles = createThemedStyles({
      screen: {
        backgroundColor: darkTheme.colors.background.primary,
        borderColor: darkTheme.colors.border.default,
      },
      title: { color: darkTheme.colors.text.primary },
    });

    expect(styles.screen).toMatchObject({ backgroundColor: "#0B1A26", borderColor: "#315A78" });
    expect(styles.title).toMatchObject({ color: "#F4F7F8" });

    setActiveAppTheme(lightTheme);
    expect(styles.screen).toMatchObject({ backgroundColor: "#F7F1E6", borderColor: "#D8C8AF" });
    expect(styles.title).toMatchObject({ color: "#132536" });
  });

  it("updates non-style component configuration such as controls", () => {
    const control = createThemedValue({ color: darkTheme.colors.text.link });

    setActiveAppTheme(lightTheme);

    expect(control.color).toBe(lightTheme.colors.text.link);
  });

  it("builds both palettes when a route module loads while light appearance is active", () => {
    setActiveAppTheme(lightTheme);
    const styles = createThemedStyles((currentTheme) => ({ title: { color: currentTheme.colors.text.primary } }));

    setActiveAppTheme(darkTheme);
    expect(styles.title).toMatchObject({ color: darkTheme.colors.text.primary });

    setActiveAppTheme(lightTheme);
    expect(styles.title).toMatchObject({ color: lightTheme.colors.text.primary });
  });

  it("returns a render-visible style sheet for the resolved appearance", async () => {
    const styleSheet = createThemedStyles({
      title: { color: darkTheme.colors.text.primary },
    });
    const themed = await renderHook(() => ({ appearance: useAppTheme(), styles: useThemedStyles(styleSheet) }), {
      wrapper: AppThemeProvider,
    });

    await waitFor(() => expect(themed.result.current.appearance.isHydrated).toBe(true));
    expect(themed.result.current.styles.title).toMatchObject({ color: darkTheme.colors.text.primary });

    await act(async () => themed.result.current.appearance.setPreference("light"));

    expect(themed.result.current.styles.title).toMatchObject({ color: lightTheme.colors.text.primary });
  });
});
