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
  enabled?: boolean;
  legacyBeads?: RosaryBead[];
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

/** Resolves the mystery represented by a prayer step, including opening and closing prayers. */
function mysteryIndexForBead(bead: RosaryBead | undefined, mysteries: RosaryMystery[], fallbackIndex: number) {
  if (mysteries.length === 0) return 0;

  if (bead?.mysteryId) {
    const linkedMysteryIndex = mysteries.findIndex((mystery) => mystery.id === bead.mysteryId);
    if (linkedMysteryIndex >= 0) return linkedMysteryIndex;
  }

  if (bead?.decade !== undefined) return clamp(bead.decade - 1, mysteries.length);
  if (bead?.section === "closing") return mysteries.length - 1;
  if (bead?.section === "opening") return 0;
  return clamp(fallbackIndex, mysteries.length);
}

/** Finds the first prayer step belonging to a mystery, with legacy ten-bead sequences as a fallback. */
function beadIndexForMystery(beads: RosaryBead[], mystery: RosaryMystery, mysteryIndex: number) {
  const linkedBeadIndex = beads.findIndex((bead) => bead.mysteryId === mystery.id);
  if (linkedBeadIndex >= 0) return linkedBeadIndex;
  return Math.min(mysteryIndex * 10, Math.max(0, beads.length - 1));
}

function uniqueIds(ids: string[]) {
  return [...new Set(ids)];
}

/** Resolves restored progress by stable step ID, with index-only legacy sessions as a fallback. */
function restoredBeadIndex(restored: Partial<PersistedRosarySession>, beads: RosaryBead[], legacyBeads: RosaryBead[]) {
  if (typeof restored.currentBeadId === "string") {
    const savedIdIndex = beads.findIndex((bead) => bead.id === restored.currentBeadId);
    if (savedIdIndex >= 0) return savedIdIndex;
  }

  const savedIndex = Number.isFinite(restored.currentBeadIndex) ? Number(restored.currentBeadIndex) : 0;
  const legacyStep = legacyBeads[clamp(savedIndex, legacyBeads.length)];
  const migratedIndex = legacyStep ? beads.findIndex((bead) => bead.id === legacyStep.id) : -1;
  return migratedIndex >= 0 ? migratedIndex : clamp(savedIndex, beads.length);
}

/** Finds the shared final Sign of the Cross used when a removed closing prayer was active. */
function finalSignOfCrossIndex(beads: RosaryBead[]) {
  for (let index = beads.length - 1; index >= 0; index -= 1) {
    const bead = beads[index];
    if (bead.type === "signOfCross" && bead.section === "closing") return index;
  }
  return Math.max(0, beads.length - 1);
}

/** Compares stable step IDs so equivalent arrays do not trigger session reconciliation. */
function sameBeadSequence(first: RosaryBead[], second: RosaryBead[]) {
  return first.length === second.length && first.every((bead, index) => bead.id === second[index]?.id);
}

/**
 * Coordinates the visible decade, prayer selection, haptics and local recovery.
 * The optional dependencies make the persistence behavior straightforward to test.
 */
export function useRosarySession(options: UseRosarySessionOptions = {}) {
  const mysteries = options.mysteries ?? rosaryMysteries;
  const beads = options.beads ?? rosarySequence;
  const enabled = options.enabled ?? true;
  const legacyBeads = options.legacyBeads ?? beads;
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
  const beadsRef = useRef(beads);
  const legacyBeadsRef = useRef(legacyBeads);
  const mysteriesRef = useRef(mysteries);
  const previousBeadsRef = useRef(beads);
  beadsRef.current = beads;
  legacyBeadsRef.current = legacyBeads;
  mysteriesRef.current = mysteries;

  const currentBead = beads[clamp(session.currentBeadIndex, beads.length)];
  const calculatedMysteryIndex = isFullRosary
    ? mysteryIndexForBead(currentBead, mysteries, session.currentMysteryIndex)
    : clamp(session.currentMysteryIndex, mysteries.length);
  const currentMystery = mysteries[calculatedMysteryIndex];
  const currentPrayer =
    currentBead?.prayer ?? currentMystery?.prayers.find((prayer) => prayer.id === currentBead?.prayerId);

  const persist = useCallback(
    async (nextSession: RosarySessionState, nextCompleted: boolean, prayedOn: string | null) => {
      const value: PersistedRosarySession = {
        currentMysteryIndex: nextSession.currentMysteryIndex,
        currentBeadIndex: nextSession.currentBeadIndex,
        currentBeadId: beads[nextSession.currentBeadIndex]?.id,
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
    [beads, storage, storageKey],
  );

  useEffect(() => {
    if (!enabled) {
      setIsHydrated(false);
      return;
    }

    let active = true;

    /** Restores compatible progress against the currently active prayer sequence. */
    async function restore() {
      try {
        const storedValue = await storage.getItem(storageKey);
        if (!storedValue || !active) return;

        const restored = JSON.parse(storedValue) as Partial<PersistedRosarySession>;
        const activeBeads = beadsRef.current;
        const activeLegacyBeads = legacyBeadsRef.current;
        const activeMysteries = mysteriesRef.current;
        const restoredMysteryIndex = clamp(
          Number.isFinite(restored.currentMysteryIndex) ? Number(restored.currentMysteryIndex) : 0,
          activeMysteries.length,
        );
        const restoredIndex = restoredBeadIndex(restored, activeBeads, activeLegacyBeads);
        const validIds = new Set(activeBeads.map((bead) => bead.id));
        const completedBeadIds = Array.isArray(restored.completedBeadIds)
          ? restored.completedBeadIds.filter((id): id is string => typeof id === "string" && validIds.has(id))
          : [];
        const restoredBead = activeBeads[restoredIndex];
        const resolvedMysteryIndex = isFullRosary
          ? mysteryIndexForBead(restoredBead, activeMysteries, restoredMysteryIndex)
          : restoredMysteryIndex;
        const restoredMystery = activeMysteries[resolvedMysteryIndex];

        setSession({
          currentMysteryIndex: resolvedMysteryIndex,
          currentBeadIndex: restoredIndex,
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
  }, [enabled, isFullRosary, storage, storageKey]);

  useEffect(() => {
    return () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    };
  }, []);

  useEffect(() => {
    const previousBeads = previousBeadsRef.current;
    previousBeadsRef.current = beads;
    if (previousBeads === beads || sameBeadSequence(previousBeads, beads) || !isHydrated) return;

    setSession((current) => {
      const previousStep = previousBeads[clamp(current.currentBeadIndex, previousBeads.length)];
      const sharedIndex = previousStep ? beads.findIndex((bead) => bead.id === previousStep.id) : -1;
      const nextIndex = sharedIndex >= 0 ? sharedIndex : finalSignOfCrossIndex(beads);
      const nextMysteryIndex = isFullRosary
        ? mysteryIndexForBead(beads[nextIndex], mysteries, current.currentMysteryIndex)
        : clamp(current.currentMysteryIndex, mysteries.length);
      const validIds = new Set(beads.map((bead) => bead.id));

      return {
        ...current,
        completedBeadIds: current.completedBeadIds.filter((id) => validIds.has(id)),
        currentBeadIndex: nextIndex,
        currentMysteryIndex: nextMysteryIndex,
        currentPrayerIndex: prayerIndexForBead(beads[nextIndex], mysteries[nextMysteryIndex]),
        isTransitioning: false,
      };
    });
    setIsRosaryCompleted(false);
  }, [beads, isFullRosary, isHydrated, mysteries]);

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
      const nextMysteryIndex = isFullRosary
        ? mysteryIndexForBead(beads[nextIndex], mysteries, current.currentMysteryIndex)
        : current.currentMysteryIndex;
      return {
        ...current,
        currentBeadIndex: nextIndex,
        currentMysteryIndex: nextMysteryIndex,
        currentPrayerIndex: prayerIndexForBead(beads[nextIndex], mysteries[nextMysteryIndex] ?? currentMystery),
        completedBeadIds: completed,
      };
    });
    if (didMove) markActivity();
  }, [beads, currentMystery, isFullRosary, markActivity, mysteries, startTransition]);

  const goToPreviousBead = useCallback(() => {
    const didMove = startTransition((current) => {
      const currentIndex = clamp(current.currentBeadIndex, beads.length);
      const previousIndex = Math.max(0, currentIndex - 1);
      const previousMysteryIndex = isFullRosary
        ? mysteryIndexForBead(beads[previousIndex], mysteries, current.currentMysteryIndex)
        : current.currentMysteryIndex;
      return {
        ...current,
        currentBeadIndex: previousIndex,
        currentMysteryIndex: previousMysteryIndex,
        currentPrayerIndex: prayerIndexForBead(beads[previousIndex], mysteries[previousMysteryIndex] ?? currentMystery),
      };
    });
    if (didMove) markActivity();
  }, [beads, currentMystery, isFullRosary, markActivity, mysteries, startTransition]);

  const selectBead = useCallback(
    (beadId: string) => {
      const selectedIndex = beads.findIndex((bead) => bead.id === beadId);
      if (selectedIndex < 0) return;
      const didMove = startTransition((current) => {
        const selectedMysteryIndex = isFullRosary
          ? mysteryIndexForBead(beads[selectedIndex], mysteries, current.currentMysteryIndex)
          : current.currentMysteryIndex;
        return {
          ...current,
          currentBeadIndex: selectedIndex,
          currentMysteryIndex: selectedMysteryIndex,
          currentPrayerIndex: prayerIndexForBead(
            beads[selectedIndex],
            mysteries[selectedMysteryIndex] ?? currentMystery,
          ),
        };
      });
      if (didMove) markActivity();
    },
    [beads, currentMystery, isFullRosary, markActivity, mysteries, startTransition],
  );

  const goToMystery = useCallback(
    (index: number) => {
      if (mysteries.length === 0) return;
      const mysteryIndex = clamp(index, mysteries.length);
      const startBeadIndex = isFullRosary ? beadIndexForMystery(beads, mysteries[mysteryIndex], mysteryIndex) : 0;
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
      calculatedMysteryIndex,
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
