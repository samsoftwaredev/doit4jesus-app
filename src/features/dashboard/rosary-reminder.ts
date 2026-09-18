import { ROSARY_REMINDER_THRESHOLDS, type RosaryReminderState, type RosaryReminderViewModel } from "./dashboard.types";

export function getRosaryReminderState(
  reminder: Pick<RosaryReminderViewModel, "completed">,
  remainingSeconds: number | null,
): RosaryReminderState {
  if (reminder.completed) return "completed";
  if (remainingSeconds === null || remainingSeconds > ROSARY_REMINDER_THRESHOLDS.URGENT) return "normal";
  if (remainingSeconds <= 0) return "expired";
  return "urgent";
}

/** Formats dashboard point values in the active app locale. */
export function formatPoints(points: number, locale?: string): string {
  return new Intl.NumberFormat(locale).format(points);
}
