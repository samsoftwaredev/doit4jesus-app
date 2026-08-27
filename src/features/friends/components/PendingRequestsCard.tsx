import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui";
import { theme } from "@/theme/tokens";

import type { FriendRequest } from "../friends.types";
import { FriendRequestItem } from "./FriendRequestItem";

type PendingRequestsCardProps = {
  isMutatingId?: string;
  onAccept: (request: FriendRequest) => void;
  onDecline: (request: FriendRequest) => void;
  onSeeAll: () => void;
  requests: FriendRequest[];
};

export function PendingRequestsCard({
  isMutatingId,
  onAccept,
  onDecline,
  onSeeAll,
  requests,
}: PendingRequestsCardProps) {
  return (
    <Card
      header={
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text accessibilityRole="header" style={styles.heading}>
              PENDING REQUESTS
            </Text>
            {requests.length ? (
              <View accessibilityLabel={`${requests.length} pending friend requests`} style={styles.badge}>
                <Text style={styles.badgeText}>{requests.length}</Text>
              </View>
            ) : null}
          </View>
          <Pressable accessibilityLabel="See all friend requests" onPress={onSeeAll} style={styles.seeAll}>
            <Text style={styles.seeAllText}>See all</Text>
            <Feather color={theme.colors.icon.active} name="chevron-right" size={theme.sizes.iconSmall} />
          </Pressable>
        </View>
      }
      padding="none"
    >
      <View style={styles.content}>
        {requests.length ? (
          requests
            .slice(0, 2)
            .map((request) => (
              <FriendRequestItem
                isMutating={isMutatingId === request.id}
                key={request.id}
                onAccept={() => onAccept(request)}
                onDecline={() => onDecline(request)}
                request={request}
              />
            ))
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No pending requests</Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    backgroundColor: theme.colors.gold.primary,
    borderRadius: theme.radii.pill,
    justifyContent: "center",
    minHeight: theme.spacing[5],
    minWidth: theme.spacing[5],
    paddingHorizontal: theme.spacing[1.5],
  },
  badgeText: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.inverse,
  },
  content: {
    paddingHorizontal: theme.spacing[4],
  },
  empty: {
    alignItems: "center",
    minHeight: theme.spacing[14],
    justifyContent: "center",
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heading: {
    ...theme.typography.heading3,
  },
  seeAll: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: theme.sizes.touchTarget,
  },
  seeAllText: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.link,
  },
  titleRow: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing[2],
    minWidth: theme.spacing[0],
  },
});
