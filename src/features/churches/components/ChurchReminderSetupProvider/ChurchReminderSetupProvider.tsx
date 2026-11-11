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
} from "../../churches.api";
import type { ChurchSummary } from "../../churches.types";

const MAX_SUBSCRIPTIONS = 3;

export type ChurchReminderSetupContextValue = {
  clearError: () => void;
  errorMessage: string | null;
  isLoadingSubscriptions: boolean;
  /** True after an attempt to add a church beyond the maximum, until the next selection change. */
  limitReached: boolean;
  /** Churches whose follow or unfollow request is still in flight. */
  pendingChurchIds: ReadonlySet<string>;
  selectedChurchIds: ReadonlySet<string>;
  /** The churches the user follows, in the order they were added. */
  selectedChurches: ChurchSummary[];
  /** Follows or unfollows a church and saves the change immediately. */
  toggleSelectedChurch: (church: ChurchSummary) => void;
};

const ChurchReminderSetupContext = createContext<ChurchReminderSetupContextValue | null>(null);

/**
 * Owns the followed churches for every page inside the nested churches route.
 * Each add or remove is saved to the API immediately; the API applies default reminder preferences.
 */
export function ChurchReminderSetupProvider({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const { queueAchievement } = useAchievement();
  const [selectedChurches, setSelectedChurches] = useState<ChurchSummary[]>([]);
  const [pendingChurchIds, setPendingChurchIds] = useState<ReadonlySet<string>>(() => new Set());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const mayCelebrateFirstChurchRef = useRef(false);
  const selectedChurchIds = useMemo(() => new Set(selectedChurches.map((church) => church.id)), [selectedChurches]);

  useEffect(
    /** Loads the followed churches once for both discovery selection and the selected-churches list. */
    function loadInitialSubscriptions() {
      let active = true;
      void getChurchSubscriptions()
        .then((subscriptions) => {
          if (!active) return;
          setSelectedChurches(subscriptions.map((subscription) => subscription.church));
          mayCelebrateFirstChurchRef.current = subscriptions.length === 0;
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
    setLimitReached(false);
  }

  /** Marks one church as having a request in flight, or clears it when the request settles. */
  function setPending(churchId: string, isPending: boolean): void {
    setPendingChurchIds((current) => {
      const next = new Set(current);
      if (isPending) next.add(churchId);
      else next.delete(churchId);
      return next;
    });
  }

  /** Adds or removes one church and saves immediately, enforcing the server's three-church maximum locally. */
  function toggleSelectedChurch(church: ChurchSummary): void {
    if (pendingChurchIds.has(church.id)) return;
    const isSelected = selectedChurchIds.has(church.id);
    if (!isSelected) {
      const pendingAdditions = [...pendingChurchIds].filter((churchId) => !selectedChurchIds.has(churchId)).length;
      if (selectedChurches.length + pendingAdditions >= MAX_SUBSCRIPTIONS) {
        setErrorMessage(t("churches.errors.limit"));
        setLimitReached(true);
        return;
      }
    }
    clearError();
    setPending(church.id, true);
    void (async () => {
      try {
        let alreadyFollowed = false;
        if (isSelected) await deleteChurchSubscription(church.id);
        else alreadyFollowed = (await createChurchSubscription({ churchId: church.id })).alreadySubscribed;
        setSelectedChurches((current) =>
          isSelected
            ? current.filter((item) => item.id !== church.id)
            : current.some((item) => item.id === church.id)
              ? current
              : [...current, church],
        );
        // Only the first completed setup is celebrated; later adds, removals, and updates show no toast.
        if (alreadyFollowed) return;
        if (!isSelected && mayCelebrateFirstChurchRef.current) {
          queueAchievement({ type: "church-reminders-configured" });
          mayCelebrateFirstChurchRef.current = false;
        }
      } catch (error) {
        logDevelopmentError(isSelected ? "removing church subscription" : "adding church subscription", error);
        setErrorMessage(translateMutationError(error));
        setLimitReached(
          error instanceof ChurchApiError && (error.code === "CHURCH_SUBSCRIPTION_LIMIT" || error.status === 409),
        );
      } finally {
        setPending(church.id, false);
      }
    })();
  }

  return (
    <ChurchReminderSetupContext.Provider
      value={{
        clearError,
        errorMessage,
        isLoadingSubscriptions,
        limitReached,
        pendingChurchIds,
        selectedChurchIds,
        selectedChurches,
        toggleSelectedChurch,
      }}
    >
      {children}
    </ChurchReminderSetupContext.Provider>
  );
}

/** Returns the followed-church state shared by the nested discovery routes. */
export function useChurchReminderSetup(): ChurchReminderSetupContextValue {
  const context = useContext(ChurchReminderSetupContext);
  if (!context) throw new Error("useChurchReminderSetup must be used within ChurchReminderSetupProvider.");
  return context;
}
