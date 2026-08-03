import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { Button, Card } from "@/components/ui";
import {
  DemonCatalogItemCard,
  fetchDemonCatalog,
} from "@/features/demons";
import type { DemonCatalogItem } from "@/features/demons";
import { theme } from "@/theme/tokens";

export default function DemonsCatalogScreen() {
  const router = useRouter();
  const [demons, setDemons] = useState<ReadonlyArray<DemonCatalogItem>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const loadDemons = useCallback(async () => {
    setErrorMessage(undefined);
    setIsLoading(true);

    try {
      setDemons(await fetchDemonCatalog());
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load the demons catalog.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDemons();
  }, [loadDemons]);

  return (
    <ScreenShell
      title="Demons Catalog"
      subtitle="A comprehensive guide to various demons and their attributes."
      headerAccessory={
        <Button onPress={() => router.back()} size="sm" variant="ghost">
          Back
        </Button>
      }
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
            <DemonCatalogItemCard demon={demon} key={demon.id} />
          ))}
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
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
    gap: theme.spacing[4],
  },
});
