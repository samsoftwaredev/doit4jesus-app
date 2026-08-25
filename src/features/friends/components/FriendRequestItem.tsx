import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui";
import { theme } from "@/theme/tokens";

import type { FriendRequest } from "../friends.types";
import { FriendAvatar } from "./FriendAvatar";

type FriendRequestItemProps = {
  isMutating?: boolean;
  onAccept?: () => void;
  onCancel?: () => void;
  onDecline?: () => void;
  request: FriendRequest;
};

export function FriendRequestItem({
  isMutating = false,
  onAccept,
  onCancel,
  onDecline,
  request,
}: FriendRequestItemProps) {
  const isIncoming = request.direction === "incoming";
  const levelText = request.user.title ?? "Fellow pilgrim";

  return (
    <View style={styles.item}>
      <View style={styles.profileRow}>
        <FriendAvatar
          accessibilityLabel={`${request.user.displayName}'s profile image`}
          countryCode={request.user.countryCode}
          name={request.user.displayName}
          source={request.user.avatarUrl}
        />
        <View style={styles.copy}>
          <Text style={styles.name}>{request.user.displayName}</Text>
          <Text style={styles.metadata}>{levelText}</Text>
          {!isIncoming ? <Text style={styles.status}>Request sent</Text> : null}
        </View>
      </View>
      {request.status === "pending" && isIncoming ? (
        <View style={styles.actions}>
          <Button
            accessibilityLabel={`Decline friend request from ${request.user.displayName}`}
            contentStyle={styles.buttonContent}
            loading={isMutating}
            onPress={onDecline}
            size="sm"
            style={styles.declineButton}
            textStyle={styles.declineText}
            variant="secondary"
          >
            Decline
          </Button>
          <Button
            accessibilityLabel={`Accept friend request from ${request.user.displayName}`}
            contentStyle={styles.buttonContent}
            loading={isMutating}
            onPress={onAccept}
            size="sm"
            variant="warning"
          >
            Accept
          </Button>
        </View>
      ) : null}
      {request.status === "pending" && !isIncoming ? (
        <Button
          accessibilityLabel={`Cancel friend request to ${request.user.displayName}`}
          loading={isMutating}
          onPress={onCancel}
          size="sm"
          style={styles.cancelButton}
          textStyle={styles.declineText}
          variant="secondary"
        >
          Cancel request
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: theme.spacing[2],
    marginTop: theme.spacing[3],
  },
  buttonContent: {
    paddingHorizontal: theme.spacing[3],
  },
  cancelButton: {
    alignSelf: "stretch",
    backgroundColor: theme.colors.transparent,
    borderColor: theme.colors.border.default,
    marginTop: theme.spacing[3],
  },
  copy: {
    flex: 1,
    marginLeft: theme.spacing[3],
    minWidth: theme.spacing[0],
  },
  declineButton: {
    backgroundColor: theme.colors.transparent,
    borderColor: theme.colors.border.default,
    flex: 1,
  },
  declineText: {
    color: theme.colors.text.secondary,
  },
  item: {
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    paddingVertical: theme.spacing[4],
  },
  metadata: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[0.5],
  },
  name: {
    ...theme.typography.bodyMedium,
  },
  profileRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  status: {
    ...theme.typography.caption,
    color: theme.colors.text.info,
    marginTop: theme.spacing[1],
  },
});
