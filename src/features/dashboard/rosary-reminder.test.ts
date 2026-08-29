import { ROSARY_REMINDER_THRESHOLDS } from "./dashboard.types";
import { formatPoints, getRosaryReminderState } from "./rosary-reminder";

describe("Rosary reminder state", () => {
  it("centralizes reminder thresholds and completion precedence", () => {
    expect(ROSARY_REMINDER_THRESHOLDS).toEqual({ FINAL_FIFTEEN: 900, ONE_HOUR: 3600, THREE_HOURS: 10800 });
    expect(getRosaryReminderState({ completed: true }, 1)).toBe("completed");
    expect(getRosaryReminderState({ completed: false }, 10_801)).toBe("normal");
    expect(getRosaryReminderState({ completed: false }, 10_800)).toBe("three-hour");
    expect(getRosaryReminderState({ completed: false }, 3600)).toBe("one-hour");
    expect(getRosaryReminderState({ completed: false }, 900)).toBe("final-fifteen");
    expect(getRosaryReminderState({ completed: false }, 0)).toBe("expired");
  });

  it("does not create a countdown when the server has no deadline", () => {
    expect(getRosaryReminderState({ completed: false }, null)).toBe("normal");
  });

  it("formats points with thousands separators", () => {
    expect(formatPoints(4320)).toBe("4,320");
  });
});
