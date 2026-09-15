import { act, renderHook, waitFor } from "@testing-library/react-native";

import {
  ROSARY_LENGTH_STORAGE_KEY,
  useRosaryLengthPreference,
} from "@/features/prayer/rosary/hooks/useRosaryLengthPreference";
import type { RosaryStorageAdapter } from "@/features/prayer/rosary/hooks/useRosarySession";

function createStorage(initialValue: string | null = null): jest.Mocked<RosaryStorageAdapter> {
  return {
    getItem: jest.fn<Promise<string | null>, [string]>(() => Promise.resolve(initialValue)),
    setItem: jest.fn<Promise<void>, [string, string]>(() => Promise.resolve()),
  };
}

describe("useRosaryLengthPreference", () => {
  it("defaults to the Default Rosary value and remembers a changed length on the device", async () => {
    const storage = createStorage();
    const { result } = await renderHook(() => useRosaryLengthPreference(storage));

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.rosaryLength).toBe("medium");

    await act(async () => result.current.setRosaryLength("long"));

    expect(result.current.rosaryLength).toBe("long");
    expect(storage.setItem).toHaveBeenCalledWith(ROSARY_LENGTH_STORAGE_KEY, "long");
  });

  it("restores valid choices and ignores invalid stored values", async () => {
    const savedStorage = createStorage("short");
    const saved = await renderHook(() => useRosaryLengthPreference(savedStorage));
    await waitFor(() => expect(saved.result.current.isHydrated).toBe(true));
    expect(saved.result.current.rosaryLength).toBe("short");
    await saved.unmount();

    const invalidStorage = createStorage("extra-long");
    const invalid = await renderHook(() => useRosaryLengthPreference(invalidStorage));
    await waitFor(() => expect(invalid.result.current.isHydrated).toBe(true));
    expect(invalid.result.current.rosaryLength).toBe("medium");
    await invalid.unmount();
  });

  it("keeps the preference usable in memory when storage fails", async () => {
    const storage: jest.Mocked<RosaryStorageAdapter> = {
      getItem: jest.fn<Promise<string | null>, [string]>(() => Promise.reject(new Error("unavailable"))),
      setItem: jest.fn<Promise<void>, [string, string]>(() => Promise.reject(new Error("unavailable"))),
    };
    const { result } = await renderHook(() => useRosaryLengthPreference(storage));

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    await act(async () => result.current.setRosaryLength("short"));

    expect(result.current.rosaryLength).toBe("short");
    expect(result.current.storageError).toBe(true);
  });
});
