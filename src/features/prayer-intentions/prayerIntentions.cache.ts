import type { ApprovedPrayerIntention } from "./prayerIntentions.types";

const approvedPrayerIntentions = new Map<string, ApprovedPrayerIntention>();
const myIntentionsListeners = new Set<() => void>();

export function cacheApprovedPrayerIntentions(intentions: ApprovedPrayerIntention[]) {
  intentions.forEach((intention) => approvedPrayerIntentions.set(intention.id, intention));
}

export function getCachedApprovedPrayerIntention(id: string | undefined) {
  return id ? approvedPrayerIntentions.get(id) : undefined;
}

/** The project does not use a query-cache library; this lets mounted personal lists refetch after a submission. */
export function invalidateMyPrayerIntentions() {
  myIntentionsListeners.forEach((listener) => listener());
}

export function subscribeToMyPrayerIntentionsInvalidation(listener: () => void) {
  myIntentionsListeners.add(listener);
  return () => {
    myIntentionsListeners.delete(listener);
  };
}
