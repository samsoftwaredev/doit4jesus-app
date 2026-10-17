import { act, renderHook, waitFor } from "@testing-library/react-native";

import {
  ROSARY_ART_STYLE_STORAGE_KEY,
  useRosaryArtStylePreference,
} from "@/features/prayer/rosary/hooks/useRosaryArtStylePreference";
import type { RosaryStorageAdapter } from "@/features/prayer/rosary/hooks/useRosarySession";

function createStorage(initialValue: string | null = null): jest.Mocked<RosaryStorageAdapter> {
  return {
    getItem: jest.fn<Promise<string | null>, [string]>(() => Promise.resolve(initialValue)),
    setItem: jest.fn<Promise<void>, [string, string]>(() => Promise.resolve()),
  };
}

describe("useRosaryArtStylePreference", () => {
  it("defaults to classical art and persists art-style changes", async () => {
    const storage = createStorage();
    const { result } = await renderHook(() => useRosaryArtStylePreference(storage));

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.rosaryArtStyle).toBe("classic");

    await act(async () => result.current.setRosaryArtStyle("comic"));

    expect(result.current.rosaryArtStyle).toBe("comic");
    expect(storage.setItem).toHaveBeenCalledWith(ROSARY_ART_STYLE_STORAGE_KEY, "comic");
  });

  it("restores only recognized art styles", async () => {
    const saved = await renderHook(() => useRosaryArtStylePreference(createStorage("classic")));
    await waitFor(() => expect(saved.result.current.isHydrated).toBe(true));
    expect(saved.result.current.rosaryArtStyle).toBe("classic");

    const invalid = await renderHook(() => useRosaryArtStylePreference(createStorage("watercolor")));
    await waitFor(() => expect(invalid.result.current.isHydrated).toBe(true));
    expect(invalid.result.current.rosaryArtStyle).toBe("classic");
  });

  it("keeps art-style changes in memory when storage fails", async () => {
    const storage: jest.Mocked<RosaryStorageAdapter> = {
      getItem: jest.fn<Promise<string | null>, [string]>(() => Promise.reject(new Error("unavailable"))),
      setItem: jest.fn<Promise<void>, [string, string]>(() => Promise.reject(new Error("unavailable"))),
    };
    const { result } = await renderHook(() => useRosaryArtStylePreference(storage));

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    await act(async () => result.current.setRosaryArtStyle("comic"));

    expect(result.current.rosaryArtStyle).toBe("comic");
    expect(result.current.storageError).toBe(true);
  });
});
