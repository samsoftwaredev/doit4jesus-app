import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ScreenShell } from "@/components/screen-shell";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

/** Renders this feature with colors from the currently resolved app appearance. */
export default function AboutScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ScreenShell
      contentContainerStyle={styles.content}
      description={t("pages.about.description")}
      headerVariant="compact"
      onBack={() => router.back()}
      title={t("pages.about.title")}
    >
      <View style={styles.card}>
        <Text style={styles.copy}>{t("pages.about.copy")}</Text>
      </View>
    </ScreenShell>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  content: { maxWidth: 700 },
  card: {
    backgroundColor: theme.colors.surface.navy,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    padding: theme.spacing[5],
  },
  copy: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    lineHeight: theme.lineHeights.lg,
  },
}));
