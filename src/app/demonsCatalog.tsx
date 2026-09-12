import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, Text, useWindowDimensions, View } from "react-native";
import type { ViewStyle } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { Button, Card } from "@/components/ui";
import { DemonCatalogItemCard, fetchDemonCatalog } from "@/features/demons";
import type { DemonCatalogItem } from "@/features/demons";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const catalogCardBaseStyle = {
  flexGrow: 0,
  flexShrink: 1,
  maxWidth: "100%",
  minWidth: theme.spacing[0],
} satisfies ViewStyle;

/** Renders this feature with colors from the currently resolved app appearance. */
export default function DemonsCatalogScreen() {
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [demons, setDemons] = useState<readonly DemonCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const loadDemons = useCallback(async () => {
    setErrorMessage(undefined);
    setIsLoading(true);

    try {
      setDemons(await fetchDemonCatalog());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load the demons catalog.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDemons();
  }, [loadDemons]);

  const catalogCardStyle =
    width >= theme.breakpoints.desktop
      ? styles.catalogCardDesktop
      : width >= theme.breakpoints.tablet
        ? styles.catalogCardTablet
        : styles.catalogCardMobile;

  return (
    <ScreenShell
      description="Learn about spiritual obstacles and how to confront them."
      headerVariant="compact"
      onBack={() => router.back()}
      title="Demons Catalog"
    >
      {isLoading ? (
        <Card fullWidth title="Loading demons">
          <View style={styles.stateContainer}>
            <ActivityIndicator color={theme.colors.semantic.danger} size="large" />
            <Text style={styles.description}>Gathering the catalog of spiritual obstacles.</Text>
          </View>
        </Card>
      ) : null}

      {errorMessage ? (
        <Card
          footer={
            <Button fullWidth onPress={() => void loadDemons()} variant="danger">
              Retry
            </Button>
          }
          fullWidth
          title="Catalog unavailable"
          variant="danger"
        >
          <Text style={styles.description}>{errorMessage}</Text>
        </Card>
      ) : null}

      {!isLoading && !errorMessage && demons.length === 0 ? (
        <Card fullWidth title="No demons found">
          <Text style={styles.description}>There are no active demon records to display.</Text>
        </Card>
      ) : null}

      {!isLoading && !errorMessage ? (
        <View style={styles.catalogList}>
          {demons.map((demon) => (
            <DemonCatalogItemCard demon={demon} key={demon.id} style={catalogCardStyle} />
          ))}
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  stateContainer: {
    alignItems: "center",
    gap: theme.spacing[3],
    paddingVertical: theme.spacing[4],
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  catalogList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[4],
  },
  catalogCardMobile: {
    ...catalogCardBaseStyle,
    flexBasis: "100%",
  },
  catalogCardTablet: {
    ...catalogCardBaseStyle,
    flexBasis: "47%",
  },
  catalogCardDesktop: {
    ...catalogCardBaseStyle,
    flexBasis: "31%",
  },
}));
