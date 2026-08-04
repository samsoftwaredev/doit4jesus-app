import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { Button, Card } from "@/components/ui";
import {
  BattleDemonDetails,
  BattleDemonRoster,
} from "@/features/battle";
import {
  fetchDemonBattleDetails,
  fetchDemonCatalog,
} from "@/features/demons";
import type {
  DemonBattleDetails,
  DemonCatalogItem,
} from "@/features/demons";
import { theme } from "@/theme/tokens";

export default function BattleScreen() {
  const router = useRouter();
  const [demons, setDemons] = useState<ReadonlyArray<DemonCatalogItem>>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState<string>();
  const [selectedDemonCode, setSelectedDemonCode] = useState<string>();
  const [details, setDetails] = useState<DemonBattleDetails>();
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string>();
  const selectionRequestId = useRef(0);

  const loadCatalog = useCallback(async () => {
    setCatalogError(undefined);
    setIsLoadingCatalog(true);

    try {
      setDemons(await fetchDemonCatalog());
    } catch (error) {
      setCatalogError(
        error instanceof Error ? error.message : "Unable to load demons.",
      );
    } finally {
      setIsLoadingCatalog(false);
    }
  }, []);

  const selectDemon = useCallback(async (demon: DemonCatalogItem) => {
    const requestId = selectionRequestId.current + 1;

    selectionRequestId.current = requestId;
    setSelectedDemonCode(demon.code);
    setDetails(undefined);
    setDetailsError(undefined);
    setIsLoadingDetails(true);

    try {
      const battleDetails = await fetchDemonBattleDetails(demon.code);

      if (selectionRequestId.current === requestId) {
        setDetails(battleDetails);
      }
    } catch (error) {
      if (selectionRequestId.current === requestId) {
        setDetailsError(
          error instanceof Error
            ? error.message
            : "Unable to load the selected demon.",
        );
      }
    } finally {
      if (selectionRequestId.current === requestId) {
        setIsLoadingDetails(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const selectedDemon = demons.find(
    (demon) => demon.code === selectedDemonCode,
  );

  return (
    <ScreenShell
      headerAccessory={
        <Button onPress={() => router.push("/demonsCatalog")} size="sm" variant="ghost">
          Catalog
        </Button>
      }
      subtitle="Choose a spiritual obstacle to understand its tactics and prepare a response."
      title="Arena"
    >
      {isLoadingCatalog ? (
        <Card fullWidth title="Loading demons">
          <View style={styles.stateContainer}>
            <ActivityIndicator color={theme.colors.semantic.danger} size="large" />
            <Text style={styles.stateText}>Gathering opponents for the arena.</Text>
          </View>
        </Card>
      ) : null}

      {catalogError ? (
        <Card
          footer={
            <Button fullWidth onPress={() => void loadCatalog()} variant="danger">
              Retry
            </Button>
          }
          fullWidth
          title="Arena unavailable"
          variant="danger"
        >
          <Text style={styles.stateText}>{catalogError}</Text>
        </Card>
      ) : null}

      {!isLoadingCatalog && !catalogError ? (
        <>
          <BattleDemonRoster
            demons={demons}
            onSelect={(demon) => void selectDemon(demon)}
            selectedCode={selectedDemonCode}
          />

          {isLoadingDetails ? (
            <Card fullWidth title="Preparing the encounter">
              <View style={styles.stateContainer}>
                <ActivityIndicator color={theme.colors.semantic.danger} />
                <Text style={styles.stateText}>Reviewing this demon&apos;s tactics.</Text>
              </View>
            </Card>
          ) : null}

          {detailsError ? (
            <Card
              footer={
                selectedDemon ? (
                  <Button
                    fullWidth
                    onPress={() => void selectDemon(selectedDemon)}
                    variant="danger"
                  >
                    Retry
                  </Button>
                ) : undefined
              }
              fullWidth
              title="Demon details unavailable"
              variant="danger"
            >
              <Text style={styles.stateText}>{detailsError}</Text>
            </Card>
          ) : null}

          {details ? <BattleDemonDetails details={details} /> : null}

          {!selectedDemonCode && !isLoadingDetails ? (
            <Card fullWidth title="Select an opponent" variant="info">
              <Text style={styles.stateText}>
                Swipe through the roster, then select a demon to view its attacks, defenses, and reward.
              </Text>
            </Card>
          ) : null}
        </>
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
  stateText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
});
