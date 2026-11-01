import type { ChurchServiceType, ChurchSubscription, ChurchSummary, NotificationWeekday } from "./churches.types";

export type ChurchReminderDraft = {
  church: ChurchSummary;
  notificationWeekdays: NotificationWeekday[];
  serviceTypes: ChurchServiceType[];
};

export type ChurchSubscriptionOperation =
  ({ kind: "create" | "update" } & ChurchReminderDraft) | { church: ChurchSummary; kind: "delete" };

/** Compares two string selections without treating presentation order as a preference change. */
function selectionsMatch(current: readonly string[], next: readonly string[]): boolean {
  if (current.length !== next.length) return false;
  const currentSet = new Set(current);
  return next.every((value) => currentSet.has(value));
}

/** Builds the smallest create, update, and delete set needed to persist reminder drafts. */
export function buildSubscriptionOperations(
  existing: readonly ChurchSubscription[],
  drafts: readonly ChurchReminderDraft[],
): ChurchSubscriptionOperation[] {
  const existingByChurch = new Map(existing.map((subscription) => [subscription.churchId, subscription]));
  const draftsByChurch = new Map(drafts.map((draft) => [draft.church.id, draft]));
  const operations: ChurchSubscriptionOperation[] = [];

  for (const draft of drafts) {
    const subscription = existingByChurch.get(draft.church.id);
    if (!subscription) {
      operations.push({ ...draft, kind: "create" });
      continue;
    }
    if (
      !selectionsMatch(subscription.serviceTypes, draft.serviceTypes) ||
      !selectionsMatch(subscription.notificationWeekdays, draft.notificationWeekdays)
    ) {
      operations.push({ ...draft, kind: "update" });
    }
  }

  for (const subscription of existing) {
    if (!draftsByChurch.has(subscription.churchId)) {
      operations.push({ church: subscription.church, kind: "delete" });
    }
  }
  return operations;
}
