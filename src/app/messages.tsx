import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ScreenShell } from "@/components/screen-shell";
import { Card } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

/** Renders this feature with colors from the currently resolved app appearance. */
export default function MessagesScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ScreenShell
      contentContainerStyle={styles.content}
      description={t("pages.messages.description")}
      headerVariant="compact"
      onBack={() => router.back()}
      title={t("pages.messages.title")}
    >
      <Card title={t("pages.messages.inbox")}>
        <View style={styles.emptyState}>
          <Feather color={theme.colors.icon.active} name="mail" size={theme.sizes.iconHero} />
          <Text style={styles.description}>{t("pages.messages.copy")}</Text>
        </View>
      </Card>
    </ScreenShell>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  content: { maxWidth: 700 },
  emptyState: {
    alignItems: "center",
    gap: theme.spacing[3],
    paddingVertical: theme.spacing[4],
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
}));
