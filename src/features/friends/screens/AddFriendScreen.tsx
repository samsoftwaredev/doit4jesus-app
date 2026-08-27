import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Card } from "@/components/ui";
import { FriendAvatar, FriendsHeader, FriendsState } from "@/features/friends/components";
import { useFriendSearch, useSendFriendRequest } from "@/features/friends/friends.hooks";
import type { UserSearchResult } from "@/features/friends/friends.types";
import { theme } from "@/theme/tokens";

function statusLabel(result: UserSearchResult, requestedUsernames: string[]): string | undefined {
  if (requestedUsernames.includes(result.username.toLowerCase()) || result.relationshipState === "outgoingPending") {
    return "Requested";
  }
  if (result.relationshipState === "incomingPending") return "Request received";
  if (result.relationshipState === "friends") return "Friends";
  return undefined;
}

export function AddFriendScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const search = useFriendSearch(query);
  const request = useSendFriendRequest();
  const searchHint = useMemo(() => query.trim().length === 0, [query]);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <FriendsHeader onBack={() => router.back()} title="Add Friend" />
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
              <FriendsState message="Searching active usernames…" title="Finding people" type="loading" />
            ) : search.error ? (
              <FriendsState message={search.error} title="Search by username" type="empty" />
            ) : searchHint ? (
              <FriendsState
                message="Enter at least four characters to find someone by username."
                title="Find a friend"
                type="empty"
              />
            ) : (
              <FriendsState message="Try a different username." title="No people found" type="empty" />
            )
          }
          ListHeaderComponent={
            <View>
              <View style={styles.searchInputWrap}>
                <Feather color={theme.colors.icon.muted} name="search" size={theme.sizes.iconSmall} />
                <TextInput
                  accessibilityLabel="Search by username"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={30}
                  onChangeText={setQuery}
                  placeholder="Search by username..."
                  placeholderTextColor={theme.colors.text.subtle}
                  returnKeyType="search"
                  style={styles.searchInput}
                  value={query}
                />
              </View>
              {request.error ? <Text style={styles.requestError}>{request.error}</Text> : null}
              {!searchHint && !search.error && !search.isLoading ? (
                <Text style={styles.resultsLabel}>SEARCH RESULTS</Text>
              ) : null}
            </View>
          }
          renderItem={({ item }) => (
            <SearchResultItem
              isSending={request.pendingUsername === item.username}
              onAdd={() => void request.send(item.username).catch(() => undefined)}
              requestedUsernames={request.requestedUsernames}
              result={item}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  const status = statusLabel(result, requestedUsernames);

  return (
    <Card padding="sm" style={styles.resultCard}>
      <View style={styles.resultRow}>
        <FriendAvatar
          accessibilityLabel={`@${result.username}'s profile image`}
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
            accessibilityLabel={`Add @${result.username} as a friend`}
            loading={isSending}
            onPress={onAdd}
            size="sm"
            variant="warning"
          >
            Add
          </Button>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
  listContent: {
    alignSelf: "center",
    flexGrow: 1,
    gap: theme.spacing[3],
    maxWidth: theme.sizes.contentMaxWidth,
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
});
