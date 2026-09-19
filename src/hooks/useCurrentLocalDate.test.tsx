import { act, renderHook } from "@testing-library/react-native";

import { useCurrentLocalDate } from "./useCurrentLocalDate";

describe("useCurrentLocalDate", () => {
  const originalTimeZone = process.env.TZ;

  beforeAll(() => {
    process.env.TZ = "America/Chicago";
  });

  afterAll(() => {
    process.env.TZ = originalTimeZone;
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("updates at local midnight and schedules the following midnight", async () => {
    jest.setSystemTime(new Date(2026, 7, 24, 23, 59, 59, 500));
    const { result } = await renderHook(() => useCurrentLocalDate());

    expect(result.current).toBe("2026-08-24");

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("2026-08-25");

    await act(async () => {
      jest.advanceTimersByTime(24 * 60 * 60 * 1000);
    });
    expect(result.current).toBe("2026-08-26");
  });

  it("calculates each midnight independently across daylight-saving changes", async () => {
    jest.setSystemTime(new Date(2026, 2, 7, 23, 59, 59, 500));
    const { result } = await renderHook(() => useCurrentLocalDate());

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("2026-03-08");

    await act(async () => {
      jest.advanceTimersByTime(23 * 60 * 60 * 1000);
    });
    expect(result.current).toBe("2026-03-09");
  });

  it("cleans up the scheduled midnight timer when unmounted", async () => {
    jest.setSystemTime(new Date(2026, 7, 24, 12));
    const clearTimeoutSpy = jest.spyOn(globalThis, "clearTimeout");
    const { unmount } = await renderHook(() => useCurrentLocalDate());

    await unmount();

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    clearTimeoutSpy.mockRestore();
  });
});
