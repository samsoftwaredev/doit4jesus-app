import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { BackHeader } from "@/components/navigation";
import { Button, Card } from "@/components/ui";
import { logDevelopmentError } from "@/lib/development-logger";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

import { fetchBlockedAccounts, unblockAccount, type BlockedAccount } from "./community-safety.api";

export function BlockedAccountsScreen() {
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<BlockedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setAccounts(await fetchBlockedAccounts());
    } catch (loadError) {
      logDevelopmentError("loading blocked accounts", loadError);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  async function unblock(userId: string) {
    try {
      await unblockAccount(userId);
      setAccounts((current) => current.filter((item) => item.userId !== userId));
    } catch (unblockError) {
      logDevelopmentError("unblocking an account", unblockError);
      setError(true);
    }
  }

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader
        description={t("safety.blockedDescription")}
        onBack={() => router.back()}
        title={t("safety.blockedAccounts")}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? <Text style={styles.copy}>{t("safety.loadingBlocked")}</Text> : null}
        {error ? <Button onPress={() => void load()}>{t("common.retry")}</Button> : null}
        {!loading && !error && accounts.length === 0 ? (
          <Text style={styles.copy}>{t("safety.noBlockedAccounts")}</Text>
        ) : null}
        {accounts.map((account) => (
          <Card key={account.userId} padding="md">
            <View style={styles.row}>
              <View style={styles.identity}>
                <Text style={styles.name}>{account.displayName}</Text>
                {account.username ? <Text style={styles.copy}>@{account.username}</Text> : null}
              </View>
              <Button onPress={() => void unblock(account.userId)} size="sm" variant="outline">
                {t("safety.unblock")}
              </Button>
            </View>
          </Card>
        ))}
      </ScrollView>
    </AtmosphericSafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  safeArea: { backgroundColor: theme.colors.background.primary, flex: 1 },
  content: { gap: theme.spacing[3], padding: theme.spacing[4] },
  row: { alignItems: "center", flexDirection: "row", gap: theme.spacing[3], justifyContent: "space-between" },
  identity: { flex: 1 },
  name: { ...theme.typography.bodyMedium, color: theme.colors.text.primary },
  copy: { ...theme.typography.bodySmall, color: theme.colors.text.secondary },
}));
