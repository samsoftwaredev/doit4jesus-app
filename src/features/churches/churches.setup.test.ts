import type { ChurchSubscription } from "./churches.types";
import { buildSubscriptionOperations, type ChurchReminderDraft } from "./churches.setup";

const summary = {
  addressLine1: "203 E 10th St",
  addressLine2: null,
  city: "Austin",
  countryCode: "US",
  dioceseId: "diocese-austin",
  dioceseName: "Diocese of Austin",
  directoryVerificationStatus: "verified" as const,
  distanceMiles: 1.4,
  id: "church-1",
  latitude: 30.273,
  longitude: -97.739,
  name: "St. Mary Cathedral",
  postalCode: "78701",
  regionName: "Texas",
  scheduleStatus: "verified" as const,
  timezone: "America/Chicago",
};

const existing: ChurchSubscription[] = [
  {
    church: summary,
    churchId: "church-1",
    notificationWeekdays: ["sunday"],
    scheduleReady: true,
    serviceTypes: ["mass"],
  },
  {
    church: { ...summary, id: "church-2", name: "St. Austin" },
    churchId: "church-2",
    notificationWeekdays: ["saturday"],
    scheduleReady: true,
    serviceTypes: ["confession"],
  },
];

describe("church subscription setup", () => {
  it("builds create, update, and delete operations without rewriting unchanged preferences", () => {
    const drafts: ChurchReminderDraft[] = [
      {
        church: summary,
        notificationWeekdays: ["sunday"],
        serviceTypes: ["mass"],
      },
      {
        church: { ...summary, id: "church-3", name: "Holy Cross" },
        notificationWeekdays: ["friday"],
        serviceTypes: ["adoration"],
      },
    ];

    expect(buildSubscriptionOperations(existing, drafts)).toEqual([
      {
        church: { ...summary, id: "church-3", name: "Holy Cross" },
        kind: "create",
        notificationWeekdays: ["friday"],
        serviceTypes: ["adoration"],
      },
      { church: { ...summary, id: "church-2", name: "St. Austin" }, kind: "delete" },
    ]);
  });

  it("detects replacement changes independent of selection order", () => {
    const drafts: ChurchReminderDraft[] = [
      {
        church: summary,
        notificationWeekdays: ["wednesday", "sunday"],
        serviceTypes: ["confession", "mass"],
      },
      {
        church: { ...summary, id: "church-2", name: "St. Austin" },
        notificationWeekdays: ["saturday"],
        serviceTypes: ["confession"],
      },
    ];

    expect(buildSubscriptionOperations(existing, drafts)).toEqual([
      {
        church: summary,
        kind: "update",
        notificationWeekdays: ["wednesday", "sunday"],
        serviceTypes: ["confession", "mass"],
      },
    ]);
  });
});
