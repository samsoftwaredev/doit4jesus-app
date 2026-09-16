import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { RosaryStorageAdapter } from "@/features/prayer/rosary/hooks/useRosarySession";

const STORAGE_KEY = "@doit4jesus/rosary-audio-muted/v1";

/** Restores and persists whether automatic Rosary audio is muted on this device. */
export function useRosaryAudioPreference(storage: RosaryStorageAdapter = AsyncStorage) {
  const [isMuted, setMuted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    let active = true;

    /** Restores the saved mute flag while defaulting first use to audible playback. */
    async function restorePreference() {
      try {
        const savedValue = await storage.getItem(STORAGE_KEY);
        if (active) setMuted(savedValue === "true");
      } catch {
        if (active) setStorageError(true);
      } finally {
        if (active) setIsHydrated(true);
      }
    }

    void restorePreference();
    return () => {
      active = false;
    };
  }, [storage]);

  const setIsMuted = useCallback(
    async (muted: boolean) => {
      setMuted(muted);
      try {
        await storage.setItem(STORAGE_KEY, String(muted));
      } catch {
        setStorageError(true);
      }
    },
    [storage],
  );

  return useMemo(
    () => ({ isHydrated, isMuted, setIsMuted, storageError }),
    [isHydrated, isMuted, setIsMuted, storageError],
  );
}

export { STORAGE_KEY as ROSARY_AUDIO_MUTED_STORAGE_KEY };
