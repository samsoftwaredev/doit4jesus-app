jest.mock("@/lib/supabase", () => ({
  getSupabaseAccessToken: jest.fn(async () => "test-access-token"),
}));

import { recordRosaryActivity } from "@/features/prayer-intentions/rosaryActivities.api";
import { getTodayRosaryMysteryType } from "@/features/prayer-intentions/rosarySchedule";

describe("Rosary schedule", () => {
  it("uses the traditional weekday mystery schedule", () => {
    expect(getTodayRosaryMysteryType(new Date(2026, 7, 24, 12))).toBe("joyful"); // Monday
    expect(getTodayRosaryMysteryType(new Date(2026, 7, 25, 12))).toBe("sorrowful"); // Tuesday
    expect(getTodayRosaryMysteryType(new Date(2026, 7, 26, 12))).toBe("glorious"); // Wednesday
    expect(getTodayRosaryMysteryType(new Date(2026, 7, 27, 12))).toBe("luminous"); // Thursday
    expect(getTodayRosaryMysteryType(new Date(2026, 7, 30, 12))).toBe("glorious"); // Sunday
  });
});

describe("Rosary activity tracking", () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "http://localhost:3000";
  });

  it("records a ROSARY activity with the supplied idempotency key", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({ data: { replayed: false, xp: { currentLevel: 3, points: 50, totalXp: 995 } } }),
      ok: true,
    }));
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(
      recordRosaryActivity({
        completedAt: "2026-08-26T19:30:00-05:00",
        durationSeconds: 1800,
        idempotencyKey: "rosary-activity-key",
        occurredAt: "2026-08-26T19:00:00-05:00",
      }),
    ).resolves.toEqual({ currentLevel: 3, points: 50, replayed: false, totalXp: 995 });

    const [url, request] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("http://localhost:3000/api/v1/activities");
    expect(request.headers).toMatchObject({
      Authorization: "Bearer test-access-token",
      "Idempotency-Key": "rosary-activity-key",
    });
    expect(JSON.parse(String(request.body))).toEqual({
      activityCode: "ROSARY",
      completedAt: "2026-08-26T19:30:00-05:00",
      durationSeconds: 1800,
      metadata: {},
      occurredAt: "2026-08-26T19:00:00-05:00",
      quantity: 1,
    });
  });
});
