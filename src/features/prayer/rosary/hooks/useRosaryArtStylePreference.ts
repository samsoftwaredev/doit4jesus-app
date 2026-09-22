import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { RosaryStorageAdapter } from "@/features/prayer/rosary/hooks/useRosarySession";
import type { RosaryArtStyle } from "@/features/prayer/rosary/types";

const STORAGE_KEY = "@doit4jesus/rosary-art-style/v1";

/** Returns whether a stored value is a supported Rosary artwork style. */
export function isRosaryArtStyle(value: string | null): value is RosaryArtStyle {
  return value === "comic" || value === "classic";
}

/**
 * Restores and persists the preferred Rosary mystery artwork style on this device.
 * Storage failures retain the current in-memory selection so prayer can continue.
 */
export function useRosaryArtStylePreference(storage: RosaryStorageAdapter = AsyncStorage) {
  const [rosaryArtStyle, setArtStyle] = useState<RosaryArtStyle>("comic");
  const [isHydrated, setIsHydrated] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    let active = true;

    /** Restores a recognized style while preserving Comic style for missing or invalid values. */
    async function restorePreference() {
      try {
        const savedStyle = await storage.getItem(STORAGE_KEY);
        if (active && isRosaryArtStyle(savedStyle)) setArtStyle(savedStyle);
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

  const setRosaryArtStyle = useCallback(
    async (style: RosaryArtStyle) => {
      setArtStyle(style);
      try {
        await storage.setItem(STORAGE_KEY, style);
      } catch {
        setStorageError(true);
      }
    },
    [storage],
  );

  return useMemo(
    () => ({ isHydrated, rosaryArtStyle, setRosaryArtStyle, storageError }),
    [isHydrated, rosaryArtStyle, setRosaryArtStyle, storageError],
  );
}

export { STORAGE_KEY as ROSARY_ART_STYLE_STORAGE_KEY };
