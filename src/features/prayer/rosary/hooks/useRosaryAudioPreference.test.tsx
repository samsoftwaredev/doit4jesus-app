import { act, renderHook, waitFor } from "@testing-library/react-native";

import {
  ROSARY_AUDIO_MUTED_STORAGE_KEY,
  useRosaryAudioPreference,
} from "@/features/prayer/rosary/hooks/useRosaryAudioPreference";
import type { RosaryStorageAdapter } from "@/features/prayer/rosary/hooks/useRosarySession";

function createStorage(initialValue: string | null = null): jest.Mocked<RosaryStorageAdapter> {
  return {
    getItem: jest.fn<Promise<string | null>, [string]>(() => Promise.resolve(initialValue)),
    setItem: jest.fn<Promise<void>, [string, string]>(() => Promise.resolve()),
  };
}

describe("useRosaryAudioPreference", () => {
  it("defaults to unmuted and persists mute changes", async () => {
    const storage = createStorage();
    const { result } = await renderHook(() => useRosaryAudioPreference(storage));

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.isMuted).toBe(false);

    await act(async () => result.current.setIsMuted(true));

    expect(result.current.isMuted).toBe(true);
    expect(storage.setItem).toHaveBeenCalledWith(ROSARY_AUDIO_MUTED_STORAGE_KEY, "true");
  });

  it("restores a muted preference", async () => {
    const storage = createStorage("true");
    const { result } = await renderHook(() => useRosaryAudioPreference(storage));

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.isMuted).toBe(true);
  });

  it("keeps mute usable in memory when storage fails", async () => {
    const storage: jest.Mocked<RosaryStorageAdapter> = {
      getItem: jest.fn<Promise<string | null>, [string]>(() => Promise.reject(new Error("unavailable"))),
      setItem: jest.fn<Promise<void>, [string, string]>(() => Promise.reject(new Error("unavailable"))),
    };
    const { result } = await renderHook(() => useRosaryAudioPreference(storage));

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    await act(async () => result.current.setIsMuted(true));

    expect(result.current.isMuted).toBe(true);
    expect(result.current.storageError).toBe(true);
  });
});
