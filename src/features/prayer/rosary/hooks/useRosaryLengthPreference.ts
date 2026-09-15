import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

import { DEFAULT_ROSARY_LENGTH, isRosaryLength } from "@/features/prayer/rosary/data/rosaryLengths";
import type { RosaryStorageAdapter } from "@/features/prayer/rosary/hooks/useRosarySession";
import type { RosaryLength } from "@/features/prayer/rosary/types";

const STORAGE_KEY = "@doit4jesus/rosary-length/v1";

/**
 * Restores and updates the device-local Rosary length preference.
 * Storage failures fall back to the in-memory Default selection without blocking prayer.
 */
export function useRosaryLengthPreference(storage: RosaryStorageAdapter = AsyncStorage) {
  const [rosaryLength, setLength] = useState<RosaryLength>(DEFAULT_ROSARY_LENGTH);
  const [isHydrated, setIsHydrated] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    let active = true;

    /** Restores a valid saved length while retaining Default for missing or invalid values. */
    async function restorePreference() {
      try {
        const savedLength = await storage.getItem(STORAGE_KEY);
        if (active && isRosaryLength(savedLength)) setLength(savedLength);
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

  const setRosaryLength = useCallback(
    async (length: RosaryLength) => {
      setLength(length);
      try {
        await storage.setItem(STORAGE_KEY, length);
      } catch {
        setStorageError(true);
      }
    },
    [storage],
  );

  return useMemo(
    () => ({ isHydrated, rosaryLength, setRosaryLength, storageError }),
    [isHydrated, rosaryLength, setRosaryLength, storageError],
  );
}

export { STORAGE_KEY as ROSARY_LENGTH_STORAGE_KEY };
