import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Share, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { BackHeader } from "@/components/navigation";
import { Button, Card } from "@/components/ui";
import { FriendAvatar, FriendsState } from "@/features/friends/components";
import { useFriendSearch, useSendFriendRequest } from "@/features/friends/friends.hooks";
import type { UserSearchResult } from "@/features/friends/friends.types";
import { logDevelopmentError } from "@/lib/development-logger";
import { APP_CONFIG } from "@/config/app-config";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

function statusKey(result: UserSearchResult, requestedUsernames: string[]): string | undefined {
  if (requestedUsernames.includes(result.username.toLowerCase()) || result.relationshipState === "outgoingPending") {
    return "friends.requested";
  }
  if (result.relationshipState === "incomingPending") return "friends.requestReceived";
  if (result.relationshipState === "friends") return "friends.title";
  return undefined;
}

/** Renders friend search plus a native invite-link sharing action within the shared atmosphere. */
export function AddFriendScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const search = useFriendSearch(query);
  const request = useSendFriendRequest();
  const searchHint = useMemo(() => query.trim().length === 0, [query]);

  /** Opens the operating system share sheet with the localized invite copy and public app landing page. */
  const handleInvite = useCallback(async () => {
    try {
      await Share.share({ message: `${t("friends.invite.message")}\n${APP_CONFIG.inviteUrl}` });
    } catch (error) {
      logDevelopmentError("sharing a friend invite", error);
    }
  }, [t]);

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader
        description={t("friends.addDescription")}
        onBack={() => router.back()}
        title={t("friends.addFriend")}
      />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", default: undefined })}
        style={styles.keyboardAvoiding}
      >
        <FlatList
          contentContainerStyle={styles.listContent}
          data={search.results}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item) => item.username}
          ListEmptyComponent={
            search.isLoading ? (
              <FriendsState
                message={t("friends.search.loading")}
                title={t("friends.search.loadingTitle")}
                type="loading"
              />
            ) : search.error ? (
              <FriendsState message={search.error} title={t("friends.search.label")} type="empty" />
            ) : searchHint ? (
              <FriendsState message={t("friends.search.hint")} title={t("friends.search.hintTitle")} type="empty" />
            ) : (
              <FriendsState
                message={t("friends.search.emptyDescription")}
                title={t("friends.search.emptyTitle")}
                type="empty"
              />
            )
          }
          ListHeaderComponent={
            <View>
              <Card padding="md" style={styles.inviteCard}>
                <View style={styles.inviteCopyRow}>
                  <Feather
                    accessible={false}
                    color={theme.colors.icon.active}
                    name="user-plus"
                    size={theme.sizes.iconMedium}
                  />
                  <View style={styles.inviteCopy}>
                    <Text accessibilityRole="header" style={styles.inviteTitle}>
                      {t("friends.invite.title")}
                    </Text>
                    <Text style={styles.inviteDescription}>{t("friends.invite.description")}</Text>
                  </View>
                </View>
                <Button
                  accessibilityLabel={t("friends.invite.action")}
                  fullWidth
                  onPress={handleInvite}
                  variant="outline"
                >
                  {t("friends.invite.action")}
                </Button>
              </Card>
              <View style={styles.searchInputWrap}>
                <Feather color={theme.colors.icon.muted} name="search" size={theme.sizes.iconSmall} />
                <TextInput
                  accessibilityLabel={t("friends.search.label")}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={30}
                  onChangeText={setQuery}
                  placeholder={t("friends.search.placeholder")}
                  placeholderTextColor={theme.colors.text.subtle}
                  returnKeyType="search"
                  style={styles.searchInput}
                  value={query}
                />
              </View>
              {request.error ? <Text style={styles.requestError}>{request.error}</Text> : null}
              {!searchHint && !search.error && !search.isLoading ? (
                <Text style={styles.resultsLabel}>{t("friends.search.results")}</Text>
              ) : null}
            </View>
          }
          renderItem={({ item }) => (
            <SearchResultItem
              isSending={request.pendingUsername === item.username}
              onAdd={() =>
                void request
                  .send(item.username)
                  .catch((error) => logDevelopmentError("sending a friend request from search", error))
              }
              requestedUsernames={request.requestedUsernames}
              result={item}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </AtmosphericSafeAreaView>
  );
}

/** Renders SearchResultItem with styles resolved from the active appearance. */
function SearchResultItem({
  isSending,
  onAdd,
  requestedUsernames,
  result,
}: {
  isSending: boolean;
  onAdd: () => void;
  requestedUsernames: string[];
  result: UserSearchResult;
}) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const relationshipKey = statusKey(result, requestedUsernames);
  const status = relationshipKey ? t(relationshipKey) : undefined;

  return (
    <Card padding="sm" style={styles.resultCard}>
      <View style={styles.resultRow}>
        <FriendAvatar
          accessibilityLabel={t("friends.avatarLabel", { name: `@${result.username}` })}
          name={result.username}
          source={result.avatarUrl}
        />
        <View style={styles.resultCopy}>
          <Text style={styles.username}>{`@${result.username}`}</Text>
          {result.title ? <Text style={styles.resultTitle}>{result.title}</Text> : null}
        </View>
        {status ? (
          <Text accessibilityLabel={`${result.username}: ${status}`} style={styles.relationshipStatus}>
            {status}
          </Text>
        ) : (
          <Button
            accessibilityLabel={t("friends.addFriendLabel", { username: result.username })}
            loading={isSending}
            onPress={onAdd}
            size="sm"
            variant="warning"
          >
            {t("friends.add")}
          </Button>
        )}
      </View>
    </Card>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  inviteCard: {
    gap: theme.spacing[4],
    marginBottom: theme.spacing[5],
  },
  inviteCopy: {
    flex: 1,
    marginLeft: theme.spacing[3],
    minWidth: theme.spacing[0],
  },
  inviteCopyRow: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  inviteDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[1],
  },
  inviteTitle: {
    ...theme.typography.bodyMedium,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  listContent: {
    alignSelf: "center",
    flexGrow: 1,
    gap: theme.spacing[3],
    maxWidth: 700,
    paddingBottom: theme.spacing[8],
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    width: "100%",
  },
  relationshipStatus: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.info,
    textAlign: "right",
  },
  requestError: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.danger,
    marginTop: theme.spacing[2],
  },
  resultCard: {
    flexGrow: 0,
  },
  resultCopy: {
    flex: 1,
    marginLeft: theme.spacing[3],
    minWidth: theme.spacing[0],
  },
  resultRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  resultTitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[0.5],
  },
  resultsLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.subtle,
    marginBottom: theme.spacing[3],
    marginTop: theme.spacing[5],
  },
  safeArea: {
    backgroundColor: theme.colors.background.primary,
    flex: 1,
  },
  searchInput: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    flex: 1,
    marginLeft: theme.spacing[2],
    minHeight: theme.sizes.touchTarget,
  },
  searchInputWrap: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.interactive,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    minHeight: theme.sizes.touchTarget + theme.spacing[4],
    paddingHorizontal: theme.spacing[3],
  },
  username: {
    ...theme.typography.bodyMedium,
  },
}));
