import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import {
  APP_LANGUAGE_PREFERENCE_STORAGE_KEY,
  AppLanguageProvider,
  parseLanguagePreference,
  resolveAppLanguage,
  useAppLanguage,
} from "./AppLanguageProvider";

let mockLocales: { languageCode: string | null; languageTag: string }[] = [
  { languageCode: "en", languageTag: "en-US" },
];

jest.mock("expo-localization", () => ({
  useLocales: () => mockLocales,
}));

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;

describe("AppLanguageProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocales = [{ languageCode: "en", languageTag: "en-US" }];
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue();
  });

  it.each([
    ["en", "en"],
    ["es", "es"],
    ["fr", null],
    ["", null],
    [null, null],
  ] as const)("parses %p as %p", (stored, expected) => {
    expect(parseLanguagePreference(stored)).toBe(expected);
  });

  it.each([
    [null, "es", "es"],
    [null, "en", "en"],
    [null, "fr", "en"],
    [null, null, "en"],
    ["es", "en", "es"],
    ["en", "es", "en"],
  ] as const)("resolves stored %p and device %p to %p", (stored, deviceLanguage, expected) => {
    expect(resolveAppLanguage(stored, deviceLanguage)).toBe(expected);
  });

  it("uses a supported device language when no explicit choice is stored", async () => {
    mockLocales = [{ languageCode: "es", languageTag: "es-MX" }];

    const { result } = await renderHook(() => useAppLanguage(), { wrapper: AppLanguageProvider });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.language).toBe("es");
    expect(result.current.locale).toBe("es-419");
    expect(result.current.preference).toBeNull();
  });

  it("prefers a stored choice and persists immediate changes", async () => {
    mockLocales = [{ languageCode: "en", languageTag: "en-US" }];
    mockGetItem.mockResolvedValue("es");

    const { result } = await renderHook(() => useAppLanguage(), { wrapper: AppLanguageProvider });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.language).toBe("es");

    await act(async () => result.current.setLanguage("en"));

    expect(result.current.language).toBe("en");
    expect(mockSetItem).toHaveBeenCalledWith(APP_LANGUAGE_PREFERENCE_STORAGE_KEY, "en");
  });

  it("falls back to English when storage and the device locale are unsupported", async () => {
    mockLocales = [{ languageCode: "fr", languageTag: "fr-FR" }];
    mockGetItem.mockResolvedValue("pt");

    const { result } = await renderHook(() => useAppLanguage(), { wrapper: AppLanguageProvider });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.language).toBe("en");
  });

  it("continues with the active session language when persistence fails", async () => {
    mockGetItem.mockRejectedValueOnce(new Error("unavailable"));
    mockSetItem.mockRejectedValueOnce(new Error("unavailable"));

    const { result } = await renderHook(() => useAppLanguage(), { wrapper: AppLanguageProvider });
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    await act(async () => result.current.setLanguage("es"));

    expect(result.current.language).toBe("es");
  });
});
