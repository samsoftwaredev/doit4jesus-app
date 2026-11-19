import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ScreenShell } from "@/components/screen-shell";
import { Card } from "@/components/ui";
import { FriendRequestItem } from "@/features/friends/components";
import { useFriendRequests } from "@/features/friends/friends.hooks";
import { getNotifications, useNotificationBadge } from "@/features/notifications";
import type { AppNotification } from "@/features/notifications";
import { logDevelopmentError } from "@/lib/development-logger";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

/** In-app routes a notification may open; anything else is shown without a link. */
const OPENABLE_ROUTES = new Set(["/friends", "/friends/requests"]);

/** Lists friend requests and recent activity, then clears the bell badge once the user has seen them. */
export default function NotificationsScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const router = useRouter();
  const { markAllSeen } = useNotificationBadge();
  const requests = useFriendRequests("incoming");
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    let active = true;
    void getNotifications()
      .then((items) => {
        if (active) setNotifications(items);
      })
      .catch((error) => logDevelopmentError("loading notifications", error))
      // Viewing the page counts as seeing every notification, so the badge resets to zero.
      .finally(() => void markAllSeen());
    return () => {
      active = false;
    };
  }, [markAllSeen]);

  const pendingRequests = requests.requests.filter((request) => request.status === "pending");
  const activity = notifications.filter((item) => item.type !== "friend_request_received");
  const isEmpty = pendingRequests.length === 0 && activity.length === 0;

  return (
    <ScreenShell
      contentContainerStyle={styles.content}
      description={t("pages.notifications.description")}
      headerVariant="compact"
      onBack={() => router.back()}
      title={t("pages.notifications.title")}
    >
      {pendingRequests.length > 0 ? (
        <Card padding="none" title={t("pages.notifications.friendRequests")}>
          {pendingRequests.map((request) => (
            <View key={request.id} style={styles.requestRow}>
              <FriendRequestItem
                isMutating={requests.isMutatingId === request.id}
                onAccept={() =>
                  void requests
                    .resolve(request, "accepted")
                    .catch((error) => logDevelopmentError("accepting a friend request", error))
                }
                onDecline={() =>
                  void requests
                    .resolve(request, "rejected")
                    .catch((error) => logDevelopmentError("declining a friend request", error))
                }
                onOpenProfile={
                  request.user.username
                    ? () =>
                        router.push({
                          pathname: "/friends/user/[username]",
                          params: { username: request.user.username ?? "" },
                        })
                    : undefined
                }
                request={request}
              />
            </View>
          ))}
        </Card>
      ) : null}

      {activity.length > 0 ? (
        <Card padding="none" title={t("pages.notifications.recent")}>
          {activity.map((item) => {
            const route = item.actionUrl && OPENABLE_ROUTES.has(item.actionUrl) ? item.actionUrl : null;
            return (
              <Pressable
                accessibilityRole={route ? "button" : undefined}
                disabled={!route}
                key={item.id}
                onPress={() => route && router.push(route as "/friends")}
                style={styles.activityRow}
              >
                <Text style={styles.activityTitle}>{item.title}</Text>
                {item.body ? <Text style={styles.activityBody}>{item.body}</Text> : null}
              </Pressable>
            );
          })}
        </Card>
      ) : null}

      {isEmpty ? (
        <Card title={t("pages.notifications.caughtUp")}>
          <View style={styles.emptyState}>
            <Feather color={theme.colors.icon.active} name="bell" size={theme.sizes.iconHero} />
            <Text style={styles.description}>{t("pages.notifications.copy")}</Text>
          </View>
        </Card>
      ) : null}
    </ScreenShell>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  activityBody: { ...theme.typography.bodySmall, color: theme.colors.text.secondary, marginTop: theme.spacing[0.5] },
  activityRow: {
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    minHeight: theme.sizes.touchTarget,
    padding: theme.spacing[4],
  },
  activityTitle: { ...theme.typography.bodyMedium, color: theme.colors.text.primary },
  content: { gap: theme.spacing[4], maxWidth: 700 },
  description: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    gap: theme.spacing[3],
    paddingVertical: theme.spacing[4],
  },
  requestRow: { padding: theme.spacing[4] },
}));
