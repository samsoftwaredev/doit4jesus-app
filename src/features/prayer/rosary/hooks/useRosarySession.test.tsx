import { act, renderHook, waitFor } from "@testing-library/react-native";

import { rosaryMysteries } from "@/features/prayer/rosary/data/rosaryMysteries";
import { fullRosarySequence, rosarySequence } from "@/features/prayer/rosary/data/rosarySequence";
import { ROSARY_SESSION_STORAGE_KEY, useRosarySession } from "@/features/prayer/rosary/hooks/useRosarySession";
import type { RosaryStorageAdapter } from "@/features/prayer/rosary/hooks/useRosarySession";

function createStorage(initialValue: string | null = null): jest.Mocked<RosaryStorageAdapter> {
  return {
    getItem: jest.fn<Promise<string | null>, [string]>(() => Promise.resolve(initialValue)),
    setItem: jest.fn<Promise<void>, [string, string]>(() => Promise.resolve()),
  };
}

describe("useRosarySession", () => {
  it("should use the default Rosary data when no options are supplied", async () => {
    const { result } = await renderHook(() => useRosarySession());
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.currentMystery?.id).toBe("the_annunciation");
    expect(result.current.currentBead?.id).toBe("hail-mary-1");
  });

  it("should restore a valid saved prayer session", async () => {
    const storage = createStorage(
      JSON.stringify({
        currentMysteryIndex: 1,
        currentBeadIndex: 3,
        completedBeadIds: ["hail-mary-1", "hail-mary-2", "unknown"],
        dateLastPrayed: "2026-08-01T10:00:00.000Z",
        isRosaryCompleted: false,
      }),
    );
    const { result } = await renderHook(() => useRosarySession({ storage }));

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.currentMystery?.title).toBe("The Visitation");
    expect(result.current.currentBeadIndex).toBe(3);
    expect(result.current.completedBeadIds).toEqual(["hail-mary-1", "hail-mary-2"]);
    expect(storage.getItem).toHaveBeenCalledWith(ROSARY_SESSION_STORAGE_KEY);
  });

  it("should advance to the next bead and record the completed bead", async () => {
    const storage = createStorage();
    const { result } = await renderHook(() => useRosarySession({ storage }));
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    await act(async () => result.current.goToNextBead());

    expect(result.current.currentBeadIndex).toBe(1);
    expect(result.current.completedBeadIds).toContain("hail-mary-1");
    await waitFor(() => expect(storage.setItem).toHaveBeenCalled());
  });

  it("should keep the first bead selected when moving backward from the boundary", async () => {
    const { result } = await renderHook(() => useRosarySession({ storage: createStorage() }));
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    await act(async () => result.current.goToPreviousBead());

    expect(result.current.currentBeadIndex).toBe(0);
  });

  it("should mark a one-bead decade complete when the final bead advances", async () => {
    const { result } = await renderHook(() =>
      useRosarySession({
        beads: [rosarySequence[0]],
        mysteries: rosaryMysteries,
        storage: createStorage(),
      }),
    );
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    await act(async () => result.current.goToNextBead());

    expect(result.current.isRosaryCompleted).toBe(true);
    expect(result.current.completedBeadIds).toEqual(["hail-mary-1"]);
  });

  it("should advance to the next mystery after a decade in a full five-decade Rosary", async () => {
    const secondMysteryIndex = fullRosarySequence.findIndex((bead) => bead.mysteryId === rosaryMysteries[1].id);
    const storage = createStorage(
      JSON.stringify({ currentBeadIndex: secondMysteryIndex - 1, completedBeadIds: [], currentMysteryIndex: 0 }),
    );
    const { result } = await renderHook(() =>
      useRosarySession({
        beads: fullRosarySequence,
        isFullRosary: true,
        mysteries: rosaryMysteries,
        storage,
      }),
    );
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    await act(async () => result.current.goToNextBead());

    expect(result.current.currentBeadIndex).toBe(secondMysteryIndex);
    expect(result.current.currentMystery?.title).toBe("The Visitation");
    expect(result.current.currentMysteryIndex).toBe(1);
  });

  it("should restore opening, decade, and closing prayers to the correct mystery", async () => {
    const closingIndex = fullRosarySequence.length - 1;
    const storage = createStorage(
      JSON.stringify({ currentBeadIndex: closingIndex, completedBeadIds: [], currentMysteryIndex: 0 }),
    );
    const { result } = await renderHook(() =>
      useRosarySession({
        beads: fullRosarySequence,
        isFullRosary: true,
        mysteries: rosaryMysteries,
        storage,
      }),
    );

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.currentBead?.prayerId).toBe("sign-of-cross");
    expect(result.current.currentPrayer?.name).toBe("Sign of the Cross");
    expect(result.current.currentMystery?.title).toBe("The Finding of Jesus in the Temple");
    expect(result.current.currentMysteryIndex).toBe(4);
  });

  it("should fall back to an in-memory prayer session when storage fails", async () => {
    const storage: jest.Mocked<RosaryStorageAdapter> = {
      getItem: jest.fn<Promise<string | null>, [string]>(() => Promise.reject(new Error("Storage unavailable"))),
      setItem: jest.fn<Promise<void>, [string, string]>(() => Promise.reject(new Error("Storage unavailable"))),
    };
    const { result } = await renderHook(() => useRosarySession({ storage }));

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.storageError).toBe(true);
    await act(async () => result.current.goToNextBead());
    expect(result.current.currentBeadIndex).toBe(1);
  });

  it("should select a valid bead and ignore an unknown bead id", async () => {
    const { result } = await renderHook(() => useRosarySession({ storage: createStorage() }));
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    await act(async () => result.current.selectBead("hail-mary-5"));
    expect(result.current.currentBeadIndex).toBe(4);

    await act(async () => result.current.selectBead("not-a-bead"));
    expect(result.current.currentBeadIndex).toBe(4);
  });

  it("should move to an adjacent mystery and reset its decade", async () => {
    const { result } = await renderHook(() => useRosarySession({ storage: createStorage() }));
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    await act(async () => result.current.nextMystery());

    expect(result.current.currentMysteryIndex).toBe(1);
    expect(result.current.currentBeadIndex).toBe(0);
    expect(result.current.completedBeadIds).toEqual([]);
  });

  it("should return to the previous mystery", async () => {
    const storage = createStorage(
      JSON.stringify({
        currentMysteryIndex: 1,
        currentBeadIndex: 4,
        completedBeadIds: ["hail-mary-1", "hail-mary-2"],
      }),
    );
    const { result } = await renderHook(() => useRosarySession({ storage }));
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    await act(async () => result.current.previousMystery());
    expect(result.current.currentMysteryIndex).toBe(0);
  });

  it("should restart a restored decade", async () => {
    const storage = createStorage(
      JSON.stringify({
        currentMysteryIndex: 1,
        currentBeadIndex: 4,
        completedBeadIds: ["hail-mary-1", "hail-mary-2"],
      }),
    );
    const { result } = await renderHook(() => useRosarySession({ storage }));
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    await act(async () => result.current.restartMystery());
    expect(result.current.currentBeadIndex).toBe(0);
    expect(result.current.completedBeadIds).toEqual([]);
  });

  it("should safely handle an empty Rosary data set", async () => {
    const { result } = await renderHook(() =>
      useRosarySession({ beads: [], mysteries: [], storage: createStorage("not-json") }),
    );
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    await act(async () => result.current.goToNextBead());
    await act(async () => result.current.goToMystery(4));

    expect(result.current.currentBead).toBeUndefined();
    expect(result.current.currentMystery).toBeUndefined();
  });

  it("should clamp invalid restored indexes and direct mystery requests", async () => {
    const storage = createStorage(
      JSON.stringify({
        currentMysteryIndex: 999,
        currentBeadIndex: -4,
        completedBeadIds: null,
        dateLastPrayed: 32,
      }),
    );
    const { result } = await renderHook(() => useRosarySession({ storage }));
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    expect(result.current.currentMysteryIndex).toBe(rosaryMysteries.length - 1);
    expect(result.current.currentBeadIndex).toBe(0);

    await act(async () => result.current.goToMystery(-20));
    expect(result.current.currentMysteryIndex).toBe(0);
  });
});
