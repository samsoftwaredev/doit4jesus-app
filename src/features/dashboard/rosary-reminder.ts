import { ROSARY_REMINDER_THRESHOLDS, type RosaryReminderState, type RosaryReminderViewModel } from "./dashboard.types";

export function getRosaryReminderState(
  reminder: Pick<RosaryReminderViewModel, "completed">,
  remainingSeconds: number | null,
): RosaryReminderState {
  if (reminder.completed) return "completed";
  if (remainingSeconds === null || remainingSeconds > ROSARY_REMINDER_THRESHOLDS.THREE_HOURS) return "normal";
  if (remainingSeconds <= 0) return "expired";
  if (remainingSeconds <= ROSARY_REMINDER_THRESHOLDS.FINAL_FIFTEEN) return "final-fifteen";
  if (remainingSeconds <= ROSARY_REMINDER_THRESHOLDS.ONE_HOUR) return "one-hour";
  return "three-hour";
}

export function formatPoints(points: number): string {
  return new Intl.NumberFormat().format(points);
}
