import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { rosaryMysteries } from "@/features/prayer/rosary/data/rosaryMysteries";
import { rosarySequence } from "@/features/prayer/rosary/data/rosarySequence";
import type {
  PersistedRosarySession,
  RosaryBead,
  RosaryMystery,
  RosarySessionState,
} from "@/features/prayer/rosary/types";

const STORAGE_KEY = "@doit4jesus/rosary-session/v1";
const TRANSITION_LOCK_MS = 320;

export interface RosaryStorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

interface UseRosarySessionOptions {
  mysteries?: RosaryMystery[];
  beads?: RosaryBead[];
  isFullRosary?: boolean;
  storageKey?: string;
  storage?: RosaryStorageAdapter;
}

const initialSessionState: RosarySessionState = {
  currentMysteryIndex: 0,
  currentPrayerIndex: 0,
  currentBeadIndex: 0,
  completedBeadIds: [],
  isTransitioning: false,
};

function clamp(value: number, max: number) {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(value, max - 1));
}

function prayerIndexForBead(bead: RosaryBead | undefined, mystery: RosaryMystery | undefined) {
  if (!bead || !mystery) return 0;
  return Math.max(
    0,
    mystery.prayers.findIndex((prayer) => prayer.id === bead.prayerId),
  );
}

function uniqueIds(ids: string[]) {
  return [...new Set(ids)];
}

/**
 * Coordinates the visible decade, prayer selection, haptics and local recovery.
 * The optional dependencies make the persistence behavior straightforward to test.
 */
export function useRosarySession(options: UseRosarySessionOptions = {}) {
  const mysteries = options.mysteries ?? rosaryMysteries;
  const beads = options.beads ?? rosarySequence;
  const isFullRosary = options.isFullRosary ?? false;
  const storageKey = options.storageKey ?? STORAGE_KEY;
  const storage = options.storage ?? AsyncStorage;

  const [session, setSession] = useState<RosarySessionState>(initialSessionState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [isRosaryCompleted, setIsRosaryCompleted] = useState(false);
  const [lastPrayedOn, setLastPrayedOn] = useState<string | null>(null);
  const transitionLock = useRef(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculatedMysteryIndex = isFullRosary
    ? clamp(Math.floor(clamp(session.currentBeadIndex, beads.length) / 10), mysteries.length)
    : clamp(session.currentMysteryIndex, mysteries.length);
  const currentMystery = mysteries[calculatedMysteryIndex];
  const currentBead = beads[clamp(session.currentBeadIndex, beads.length)];
  const currentPrayer = currentMystery?.prayers.find((prayer) => prayer.id === currentBead?.prayerId);

  const persist = useCallback(
    async (nextSession: RosarySessionState, nextCompleted: boolean, prayedOn: string | null) => {
      const value: PersistedRosarySession = {
        currentMysteryIndex: nextSession.currentMysteryIndex,
        currentBeadIndex: nextSession.currentBeadIndex,
        completedBeadIds: nextSession.completedBeadIds,
        dateLastPrayed: prayedOn,
        isRosaryCompleted: nextCompleted,
      };

      try {
        await storage.setItem(storageKey, JSON.stringify(value));
      } catch {
        // A prayer session remains usable even when device storage is unavailable.
        setStorageError(true);
      }
    },
    [storage, storageKey],
  );

  useEffect(() => {
    let active = true;

    async function restore() {
      try {
        const storedValue = await storage.getItem(storageKey);
        if (!storedValue || !active) return;

        const restored = JSON.parse(storedValue) as Partial<PersistedRosarySession>;
        const restoredMysteryIndex = clamp(
          Number.isFinite(restored.currentMysteryIndex) ? Number(restored.currentMysteryIndex) : 0,
          mysteries.length,
        );
        const restoredBeadIndex = clamp(
          Number.isFinite(restored.currentBeadIndex) ? Number(restored.currentBeadIndex) : 0,
          beads.length,
        );
        const validIds = new Set(beads.map((bead) => bead.id));
        const completedBeadIds = Array.isArray(restored.completedBeadIds)
          ? restored.completedBeadIds.filter((id): id is string => typeof id === "string" && validIds.has(id))
          : [];
        const restoredMystery = mysteries[restoredMysteryIndex];
        const restoredBead = beads[restoredBeadIndex];

        setSession({
          currentMysteryIndex: isFullRosary
            ? clamp(Math.floor(restoredBeadIndex / 10), mysteries.length)
            : restoredMysteryIndex,
          currentBeadIndex: restoredBeadIndex,
          currentPrayerIndex: prayerIndexForBead(restoredBead, restoredMystery),
          completedBeadIds: uniqueIds(completedBeadIds),
          isTransitioning: false,
        });
        setIsRosaryCompleted(Boolean(restored.isRosaryCompleted));
        setLastPrayedOn(typeof restored.dateLastPrayed === "string" ? restored.dateLastPrayed : null);
      } catch {
        if (active) setStorageError(true);
      } finally {
        if (active) setIsHydrated(true);
      }
    }

    void restore();
    return () => {
      active = false;
    };
  }, [beads, isFullRosary, mysteries, storage, storageKey]);

  useEffect(() => {
    return () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    };
  }, []);

  const finishTransition = useCallback(() => {
    transitionTimer.current = setTimeout(() => {
      transitionLock.current = false;
      setSession((current) => ({ ...current, isTransitioning: false }));
    }, TRANSITION_LOCK_MS);
  }, []);

  const startTransition = useCallback(
    (update: (current: RosarySessionState) => RosarySessionState) => {
      if (transitionLock.current || beads.length === 0 || mysteries.length === 0) return false;
      transitionLock.current = true;
      setSession((current) => ({ ...update(current), isTransitioning: true }));
      void Haptics.selectionAsync().catch(() => undefined);
      finishTransition();
      return true;
    },
    [beads.length, finishTransition, mysteries.length],
  );

  const markActivity = useCallback(() => setLastPrayedOn(new Date().toISOString()), []);

  const goToNextBead = useCallback(() => {
    const didMove = startTransition((current) => {
      const index = clamp(current.currentBeadIndex, beads.length);
      const activeBead = beads[index];
      const completed = activeBead ? uniqueIds([...current.completedBeadIds, activeBead.id]) : current.completedBeadIds;

      if (index >= beads.length - 1) {
        setIsRosaryCompleted(true);
        return { ...current, completedBeadIds: completed };
      }

      const nextIndex = index + 1;
      return {
        ...current,
        currentBeadIndex: nextIndex,
        currentMysteryIndex: isFullRosary
          ? clamp(Math.floor(nextIndex / 10), mysteries.length)
          : current.currentMysteryIndex,
        currentPrayerIndex: prayerIndexForBead(
          beads[nextIndex],
          isFullRosary ? mysteries[clamp(Math.floor(nextIndex / 10), mysteries.length)] : currentMystery,
        ),
        completedBeadIds: completed,
      };
    });
    if (didMove) markActivity();
  }, [beads, currentMystery, isFullRosary, markActivity, mysteries, startTransition]);

  const goToPreviousBead = useCallback(() => {
    const didMove = startTransition((current) => {
      const currentIndex = clamp(current.currentBeadIndex, beads.length);
      const previousIndex = Math.max(0, currentIndex - 1);
      return {
        ...current,
        currentBeadIndex: previousIndex,
        currentPrayerIndex: prayerIndexForBead(beads[previousIndex], currentMystery),
      };
    });
    if (didMove) markActivity();
  }, [beads, currentMystery, markActivity, startTransition]);

  const selectBead = useCallback(
    (beadId: string) => {
      const selectedIndex = beads.findIndex((bead) => bead.id === beadId);
      if (selectedIndex < 0) return;
      const didMove = startTransition((current) => ({
        ...current,
        currentBeadIndex: selectedIndex,
        currentPrayerIndex: prayerIndexForBead(beads[selectedIndex], currentMystery),
      }));
      if (didMove) markActivity();
    },
    [beads, currentMystery, markActivity, startTransition],
  );

  const goToMystery = useCallback(
    (index: number) => {
      if (mysteries.length === 0) return;
      const mysteryIndex = clamp(index, mysteries.length);
      const startBeadIndex = isFullRosary ? Math.min(mysteryIndex * 10, Math.max(0, beads.length - 1)) : 0;
      const didMove = startTransition((current) => ({
        ...current,
        currentMysteryIndex: mysteryIndex,
        currentBeadIndex: startBeadIndex,
        currentPrayerIndex: prayerIndexForBead(beads[startBeadIndex], mysteries[mysteryIndex]),
        completedBeadIds: [],
      }));
      if (didMove) {
        setIsRosaryCompleted(false);
        markActivity();
      }
    },
    [beads, isFullRosary, markActivity, mysteries, startTransition],
  );

  const restartMystery = useCallback(() => {
    const didMove = startTransition((current) => ({
      ...current,
      currentBeadIndex: 0,
      currentMysteryIndex: 0,
      currentPrayerIndex: prayerIndexForBead(beads[0], mysteries[0] ?? currentMystery),
      completedBeadIds: [],
    }));
    if (didMove) {
      setIsRosaryCompleted(false);
      markActivity();
    }
  }, [beads, currentMystery, markActivity, mysteries, startTransition]);

  const previousMystery = useCallback(
    () => goToMystery(Math.max(0, calculatedMysteryIndex - 1)),
    [calculatedMysteryIndex, goToMystery],
  );
  const nextMystery = useCallback(
    () => goToMystery(Math.min(mysteries.length - 1, calculatedMysteryIndex + 1)),
    [calculatedMysteryIndex, goToMystery, mysteries.length],
  );

  useEffect(() => {
    if (!isHydrated) return;
    void persist(session, isRosaryCompleted, lastPrayedOn);
  }, [isHydrated, isRosaryCompleted, lastPrayedOn, persist, session]);

  return useMemo(
    () => ({
      ...session,
      currentMysteryIndex: calculatedMysteryIndex,
      currentMystery,
      currentBead,
      calculatedMysteryIndex,
      currentPrayer,
      isHydrated,
      isRosaryCompleted,
      lastPrayedOn,
      storageError,
      goToNextBead,
      goToPreviousBead,
      restartMystery,
      previousMystery,
      nextMystery,
      selectBead,
      goToMystery,
    }),
    [
      currentBead,
      currentMystery,
      currentPrayer,
      goToMystery,
      goToNextBead,
      goToPreviousBead,
      isHydrated,
      isRosaryCompleted,
      lastPrayedOn,
      nextMystery,
      previousMystery,
      restartMystery,
      selectBead,
      session,
      storageError,
    ],
  );
}

export { STORAGE_KEY as ROSARY_SESSION_STORAGE_KEY };
