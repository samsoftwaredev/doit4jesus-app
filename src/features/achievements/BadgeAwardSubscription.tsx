import type { RealtimePostgresInsertPayload } from "@supabase/realtime-js";
import { useEffect } from "react";

import type { Database } from "../../../supabase/types";
import { useAuth } from "@/features/auth";
import { fetchBadgeCatalog } from "@/features/progress/progress.api";
import { logDevelopmentError } from "@/lib/development-logger";
import { supabase } from "@/lib/supabase";

import { useAchievement } from "./AchievementProvider";

type UserBadgeRow = Database["competition"]["Tables"]["user_badges"]["Row"];

const BADGE_AWARDS_CHANNEL_PREFIX = "badge-awards";

/** Checks the Realtime payload contains the identifiers required to display a badge award safely. */
function isUserBadgeRow(value: unknown): value is UserBadgeRow {
  if (typeof value !== "object" || value === null) return false;

  const row = value as Record<string, unknown>;
  return typeof row.badge_id === "string" && typeof row.id === "string" && typeof row.user_id === "string";
}

/** Subscribes the signed-in user to badge inserts and queues their resolved badge celebrations. */
export function BadgeAwardSubscription() {
  const { session } = useAuth();
  const { queueAchievement } = useAchievement();
  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (!userId) return;

    let isActive = true;
    let pendingResolution = Promise.resolve();

    /** Resolves one new award against the authenticated catalog before displaying it in arrival order. */
    function handleBadgeAward(payload: RealtimePostgresInsertPayload<UserBadgeRow>) {
      if (!isUserBadgeRow(payload.new) || payload.new.user_id !== userId) {
        logDevelopmentError("reading a Realtime badge award", new Error("Received an invalid user badge payload."));
        return;
      }

      const award = payload.new;
      pendingResolution = pendingResolution.then(async () => {
        try {
          const badgeCatalog = await fetchBadgeCatalog();
          if (!isActive) return;

          const badge = badgeCatalog.find((catalogBadge) => catalogBadge.id === award.badge_id);
          if (!badge) {
            logDevelopmentError(
              "resolving a Realtime badge award",
              new Error(`Badge ${award.badge_id} was not found.`),
            );
            return;
          }

          queueAchievement({
            type: "badge-award",
            badge: { code: badge.code, iconUrl: badge.iconUrl, id: badge.id, name: badge.name },
          });
        } catch (error) {
          logDevelopmentError("resolving a Realtime badge award", error);
        }
      });
    }

    /** Records Realtime connection failures without interrupting the signed-in app experience. */
    function handleSubscription(status: string) {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        logDevelopmentError("subscribing to Realtime badge awards", new Error(`Subscription status: ${status}`));
      }
    }

    const channel = supabase
      .channel(`${BADGE_AWARDS_CHANNEL_PREFIX}:${userId}`)
      .on<UserBadgeRow>(
        "postgres_changes",
        { event: "INSERT", filter: `user_id=eq.${userId}`, schema: "competition", table: "user_badges" },
        handleBadgeAward,
      )
      .subscribe(handleSubscription);

    return () => {
      isActive = false;
      void supabase.removeChannel(channel);
    };
  }, [queueAchievement, userId]);

  return null;
}
