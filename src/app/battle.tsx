import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { Button, Card, SpriteSheetAnimation } from "@/components/ui";
import { ArenaDemonSelector, BattleDemonDetails } from "@/features/battle";
import type { DemonBattleDetails, DemonCatalogItem } from "@/features/demons";
import { fetchDemonBattleDetails, fetchDemonCatalog } from "@/features/demons";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

/** Renders this feature with colors from the currently resolved app appearance. */
export default function BattleScreen() {
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();
  const [demons, setDemons] = useState<readonly DemonCatalogItem[]>([]);
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
      setCatalogError(error instanceof Error ? error.message : "Unable to load demons.");
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
        setDetailsError(error instanceof Error ? error.message : "Unable to load the selected demon.");
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

  const selectedDemon = demons.find((demon) => demon.code === selectedDemonCode);

  return (
    <ScreenShell
      actions={
        <Button onPress={() => router.push("/demonsCatalog")} size="sm" variant="ghost">
          Catalog
        </Button>
      }
      background={<BattleBackground />}
      description="Choose a spiritual obstacle to understand its tactics and prepare a response."
      headerVariant="compact"
      onBack={() => router.back()}
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
          <ArenaDemonSelector
            demons={demons.slice(0, 4)}
            onSelect={(demon) => void selectDemon(demon)}
            selectedCode={selectedDemonCode}
          />

          <SpriteSheetAnimation
            autoplay
            fps={8}
            frameHeight={224}
            frameWidth={280}
            loop
            source={require("../assets/animations/wrathFury.png")}
            style={styles.wrathAnimation}
            totalFrames={8}
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
                  <Button fullWidth onPress={() => void selectDemon(selectedDemon)} variant="danger">
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
                Select a demon in the arena to view its attacks, defenses, and reward.
              </Text>
            </Card>
          ) : null}
        </>
      ) : null}
    </ScreenShell>
  );
}

function BattleBackground() {
  return (
    <Image
      accessible={false}
      contentFit="contain"
      contentPosition="top"
      source={require("../assets/backgrounds/arena1.png")}
      style={StyleSheet.absoluteFill}
    />
  );
}

const styleSheet = createThemedStyles((theme) => ({
  wrathAnimation: {
    alignSelf: "center",
    marginVertical: theme.spacing[4],
  },
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
}));
