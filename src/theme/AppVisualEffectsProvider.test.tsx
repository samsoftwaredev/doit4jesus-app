import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import {
  APP_VISUAL_EFFECTS_PREFERENCE_STORAGE_KEY,
  AppVisualEffectsProvider,
  parseVisualEffectsPreferences,
  useAppVisualEffects,
} from "./AppVisualEffectsProvider";

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;

describe("AppVisualEffectsProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
  });

  it("defaults both effects to disabled and persists independent changes", async () => {
    const { result } = await renderHook(() => useAppVisualEffects(), { wrapper: AppVisualEffectsProvider });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.dustEnabled).toBe(false);
    expect(result.current.lightingEnabled).toBe(false);

    await act(async () => {
      await result.current.setDustEnabled(true);
    });

    expect(result.current.dustEnabled).toBe(true);
    expect(result.current.lightingEnabled).toBe(false);
    expect(mockSetItem).toHaveBeenCalledWith(
      APP_VISUAL_EFFECTS_PREFERENCE_STORAGE_KEY,
      JSON.stringify({ dustEnabled: true, lightingEnabled: false }),
    );
  });

  it("restores valid persisted preferences and ignores malformed storage values", async () => {
    mockGetItem.mockResolvedValue(JSON.stringify({ dustEnabled: false, lightingEnabled: true }));
    const { result } = await renderHook(() => useAppVisualEffects(), { wrapper: AppVisualEffectsProvider });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.dustEnabled).toBe(false);
    expect(result.current.lightingEnabled).toBe(true);
    expect(parseVisualEffectsPreferences("not JSON")).toEqual({ dustEnabled: false, lightingEnabled: false });
  });

  it("keeps an in-memory change when persistence fails", async () => {
    mockSetItem.mockRejectedValue(new Error("Storage unavailable"));
    const { result } = await renderHook(() => useAppVisualEffects(), { wrapper: AppVisualEffectsProvider });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    await act(async () => {
      await result.current.setLightingEnabled(false);
    });

    expect(result.current.lightingEnabled).toBe(false);
  });
});
