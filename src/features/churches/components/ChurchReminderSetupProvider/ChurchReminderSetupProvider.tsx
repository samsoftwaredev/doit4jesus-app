import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAchievement } from "@/features/achievements";
import { logDevelopmentError } from "@/lib/development-logger";

import {
  ChurchApiError,
  createChurchSubscription,
  deleteChurchSubscription,
  getChurchSubscriptions,
  updateChurchSubscription,
} from "../../churches.api";
import {
  buildSubscriptionOperations,
  type ChurchReminderDraft,
  type ChurchSubscriptionOperation,
} from "../../churches.setup";
import type { ChurchServiceType, ChurchSubscription, ChurchSummary, NotificationWeekday } from "../../churches.types";

const MAX_SUBSCRIPTIONS = 3;

export type ChurchReminderMutationFailure = { churchId: string; message: string; name: string };

export type ChurchReminderSetupContextValue = {
  clearError: () => void;
  completeSetup: () => Promise<boolean>;
  drafts: ChurchReminderDraft[];
  errorMessage: string | null;
  existingSubscriptions: ChurchSubscription[];
  isLoadingSubscriptions: boolean;
  isSaving: boolean;
  mutationFailures: ChurchReminderMutationFailure[];
  selectedChurchIds: ReadonlySet<string>;
  toggleSelectedChurch: (church: ChurchSummary) => void;
  toggleServiceType: (churchId: string, serviceType: ChurchServiceType) => void;
  toggleWeekday: (churchId: string, weekday: NotificationWeekday) => void;
};

const ChurchReminderSetupContext = createContext<ChurchReminderSetupContextValue | null>(null);

/** Converts saved subscriptions into mutable reminder drafts without sharing their arrays. */
function subscriptionsToDrafts(subscriptions: readonly ChurchSubscription[]): ChurchReminderDraft[] {
  return subscriptions.map((subscription) => ({
    church: subscription.church,
    notificationWeekdays: [...subscription.notificationWeekdays],
    serviceTypes: [...subscription.serviceTypes],
  }));
}

/**
 * Owns church selection and reminder mutations for every page inside the nested churches route.
 * Unsaved drafts remain available while discovery and review pages stay within that route layout.
 */
export function ChurchReminderSetupProvider({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const { queueAchievement } = useAchievement();
  const [existingSubscriptions, setExistingSubscriptions] = useState<ChurchSubscription[]>([]);
  const [drafts, setDrafts] = useState<ChurchReminderDraft[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mutationFailures, setMutationFailures] = useState<ChurchReminderMutationFailure[]>([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const mayCelebrateInitialSetupRef = useRef(false);
  const selectedChurchIds = useMemo(() => new Set(drafts.map((draft) => draft.church.id)), [drafts]);

  useEffect(
    /** Loads the server baseline once for both discovery selection and reminder review. */
    function loadInitialSubscriptions() {
      let active = true;
      void getChurchSubscriptions()
        .then((subscriptions) => {
          if (!active) return;
          setExistingSubscriptions(subscriptions);
          setDrafts(subscriptionsToDrafts(subscriptions));
          mayCelebrateInitialSetupRef.current = subscriptions.length === 0;
        })
        .catch((error) => {
          logDevelopmentError("loading church subscriptions", error);
          if (!active) return;
          setErrorMessage(
            error instanceof ChurchApiError && error.status === 401
              ? t("churches.errors.authentication")
              : t("churches.errors.load"),
          );
        })
        .finally(() => {
          if (active) setIsLoadingSubscriptions(false);
        });
      return () => {
        active = false;
      };
    },
    [t],
  );

  /** Maps known subscription API failures to localized messages with a stable fallback. */
  function translateMutationError(error: unknown): string {
    if (error instanceof ChurchApiError) {
      if (
        error.code?.includes("DUPLICATE") ||
        error.code?.includes("ALREADY_SUBSCRIBED") ||
        error.code?.includes("ALREADY_EXISTS")
      ) {
        return t("churches.errors.duplicate");
      }
      if (error.code === "CHURCH_SUBSCRIPTION_LIMIT" || error.status === 409) return t("churches.errors.limit");
      if (error.status === 401) return t("churches.errors.authentication");
      if (error.status === 404) return t("churches.errors.unavailable");
    }
    return t("churches.errors.save");
  }

  /** Clears a recoverable selection or validation error before the user's next action. */
  function clearError(): void {
    setErrorMessage(null);
  }

  /** Adds or removes one church while enforcing the server's three-church maximum locally. */
  function toggleSelectedChurch(church: ChurchSummary): void {
    if (selectedChurchIds.has(church.id)) {
      setDrafts((current) => current.filter((draft) => draft.church.id !== church.id));
      setErrorMessage(null);
      return;
    }
    if (drafts.length >= MAX_SUBSCRIPTIONS) {
      setErrorMessage(t("churches.errors.limit"));
      return;
    }
    setErrorMessage(null);
    setDrafts((current) => [...current, { church, notificationWeekdays: [], serviceTypes: [] }]);
  }

  /** Toggles one service preference without changing other church drafts. */
  function toggleServiceType(churchId: string, serviceType: ChurchServiceType): void {
    setDrafts((current) =>
      current.map((draft) =>
        draft.church.id !== churchId
          ? draft
          : {
              ...draft,
              serviceTypes: draft.serviceTypes.includes(serviceType)
                ? draft.serviceTypes.filter((value) => value !== serviceType)
                : [...draft.serviceTypes, serviceType],
            },
      ),
    );
  }

  /** Toggles one notification weekday without changing other church drafts. */
  function toggleWeekday(churchId: string, weekday: NotificationWeekday): void {
    setDrafts((current) =>
      current.map((draft) =>
        draft.church.id !== churchId
          ? draft
          : {
              ...draft,
              notificationWeekdays: draft.notificationWeekdays.includes(weekday)
                ? draft.notificationWeekdays.filter((value) => value !== weekday)
                : [...draft.notificationWeekdays, weekday],
            },
      ),
    );
  }

  /** Executes one normalized subscription operation against its authenticated endpoint. */
  async function executeOperation(operation: ChurchSubscriptionOperation): Promise<ChurchSubscription | null> {
    if (operation.kind === "delete") {
      await deleteChurchSubscription(operation.church.id);
      return null;
    }
    if (operation.kind === "create") {
      return createChurchSubscription({
        churchId: operation.church.id,
        notificationWeekdays: operation.notificationWeekdays,
        serviceTypes: operation.serviceTypes,
      });
    }
    return updateChurchSubscription(operation.church.id, {
      notificationWeekdays: operation.notificationWeekdays,
      serviceTypes: operation.serviceTypes,
    });
  }

  /** Applies a fulfilled mutation to the comparison baseline used by individual retries. */
  function applySuccessfulOperation(
    baseline: ChurchSubscription[],
    operation: ChurchSubscriptionOperation,
    response: ChurchSubscription | null | undefined,
  ): ChurchSubscription[] {
    const withoutChurch = baseline.filter((subscription) => subscription.churchId !== operation.church.id);
    if (operation.kind === "delete") return withoutChurch;
    const previous = baseline.find((subscription) => subscription.churchId === operation.church.id);
    const subscription = response ?? {
      church: operation.church,
      churchId: operation.church.id,
      notificationWeekdays: [...operation.notificationWeekdays],
      scheduleReady: previous?.scheduleReady ?? operation.church.scheduleStatus === "verified",
      serviceTypes: [...operation.serviceTypes],
    };
    return [...withoutChurch, subscription];
  }

  /** Saves the smallest subscription diff and returns true only when every requested mutation succeeds. */
  async function completeSetup(): Promise<boolean> {
    if (drafts.some((draft) => draft.serviceTypes.length === 0 || draft.notificationWeekdays.length === 0)) {
      setErrorMessage(t("churches.setup.validation"));
      return false;
    }
    setIsSaving(true);
    setErrorMessage(null);
    setMutationFailures([]);
    const operations = buildSubscriptionOperations(existingSubscriptions, drafts);
    const results = await Promise.allSettled(operations.map(executeOperation));
    let nextBaseline = [...existingSubscriptions];
    const failures: ChurchReminderMutationFailure[] = [];
    results.forEach((result, index) => {
      const operation = operations[index]!;
      if (result.status === "fulfilled") {
        nextBaseline = applySuccessfulOperation(nextBaseline, operation, result.value);
      } else {
        failures.push({
          churchId: operation.church.id,
          message: translateMutationError(result.reason),
          name: operation.church.name,
        });
      }
    });
    setExistingSubscriptions(nextBaseline);
    setIsSaving(false);
    if (failures.length > 0) {
      setMutationFailures(failures);
      return false;
    }
    if (mayCelebrateInitialSetupRef.current && drafts.length > 0) {
      queueAchievement({ type: "church-reminders-configured" });
      mayCelebrateInitialSetupRef.current = false;
    } else {
      queueAchievement({ type: "church-reminders-updated" });
    }
    return true;
  }

  return (
    <ChurchReminderSetupContext.Provider
      value={{
        clearError,
        completeSetup,
        drafts,
        errorMessage,
        existingSubscriptions,
        isLoadingSubscriptions,
        isSaving,
        mutationFailures,
        selectedChurchIds,
        toggleSelectedChurch,
        toggleServiceType,
        toggleWeekday,
      }}
    >
      {children}
    </ChurchReminderSetupContext.Provider>
  );
}

/** Returns the reminder setup state shared by the nested discovery and review routes. */
export function useChurchReminderSetup(): ChurchReminderSetupContextValue {
  const context = useContext(ChurchReminderSetupContext);
  if (!context) throw new Error("useChurchReminderSetup must be used within ChurchReminderSetupProvider.");
  return context;
}
