import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "@/components/navigation";
import { OrnateCard } from "@/features/prayer/components";
import { PrayerIntentionAvatar } from "@/features/prayer/intentions/components";
import { getPrayerIntentionTheme, getCachedApprovedPrayerIntention } from "@/features/prayer/intentions";
import { theme } from "@/theme/tokens";

function firstString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function IntentionRosaryScreen() {
  const router = useRouter();
  const { intentionId: rawIntentionId } = useLocalSearchParams<{ intentionId?: string | string[] }>();
  const intentionId = firstString(rawIntentionId);
  const intention = getCachedApprovedPrayerIntention(intentionId);
  const intentionTheme = getPrayerIntentionTheme(intention?.symbol);

  if (!intention) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <BackHeader onBack={() => router.back()} title="Prayer Intention" />
        <View style={styles.unavailable}>
          <Text style={styles.unavailableTitle}>This intention is no longer loaded.</Text>
          <Text style={styles.unavailableCopy}>Return to the public prayer intentions list and choose it again.</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace("/prayer-intentions")}
            style={styles.action}
          >
            <Text style={styles.actionText}>View Prayer Intentions</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <LinearGradient
        colors={[intentionTheme.surface, theme.rosary.colors.canvasLight, theme.rosary.colors.canvas]}
        style={styles.background}
      >
        <BackHeader onBack={() => router.back()} title="Prayer Intention" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.creatorBlock}>
            <PrayerIntentionAvatar
              countryCode={intention.creator.countryCode}
              displayName={intention.creator.displayName}
              size={68}
              source={intention.creator.avatarUrl}
            />
            <Text style={styles.createdBy}>CREATED BY</Text>
            <Text style={styles.creatorName}>{intention.creator.displayName}</Text>
          </View>
          <Text accessibilityRole="header" numberOfLines={3} style={styles.title}>
            {intention.title}
          </Text>
          <Text style={styles.description}>{intention.description}</Text>
          <View style={styles.artFrame}>
            <Image
              accessible={false}
              contentFit="cover"
              source={require("../../../../assets/saints/blessed-virgin-mary.png")}
              style={styles.art}
            />
            <LinearGradient
              colors={["rgba(7, 26, 42, 0.06)", "rgba(7, 26, 42, 0.78)"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.artSymbol}>
              <Feather
                accessible={false}
                color={theme.rosary.colors.goldBright}
                name={intentionTheme.icon}
                size={theme.sizes.iconLarge}
              />
            </View>
          </View>
          <OrnateCard style={styles.prayerCard}>
            <Feather accessible={false} color={theme.rosary.colors.gold} name="plus" size={theme.sizes.iconMedium} />
            <Text style={styles.prayerLabel}>PRAYER INTENTION</Text>
            <Text style={styles.prayerCopy}>We unite this Rosary for this intention and its creator.</Text>
          </OrnateCard>
          <Pressable
            accessibilityLabel="Pray this Rosary"
            accessibilityRole="button"
            onPress={() =>
              router.push({ pathname: "/rosary", params: { intentionId: intention.id, source: "prayer-intention" } })
            }
            style={styles.action}
          >
            <Feather accessible={false} color={theme.colors.text.inverse} name="plus" size={theme.sizes.iconSmall} />
            <Text style={styles.actionText}>Pray This Rosary</Text>
          </Pressable>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    flexDirection: "row",
    gap: theme.spacing[2],
    justifyContent: "center",
    minHeight: theme.sizes.buttonHeightLarge,
    paddingHorizontal: theme.spacing[4],
  },
  actionText: { ...theme.typography.button, color: theme.colors.text.inverse },
  art: { height: "100%", width: "100%" },
  artFrame: {
    aspectRatio: 1.26,
    borderColor: "rgba(230, 186, 100, 0.62)",
    borderRadius: theme.radii.xl,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    overflow: "hidden",
    position: "relative",
  },
  artSymbol: {
    alignItems: "center",
    backgroundColor: "rgba(7, 26, 42, 0.62)",
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    bottom: theme.spacing[3],
    height: theme.spacing[10],
    justifyContent: "center",
    position: "absolute",
    right: theme.spacing[3],
    width: theme.spacing[10],
  },
  background: { flex: 1 },
  content: {
    alignSelf: "center",
    gap: theme.spacing[4],
    maxWidth: 620,
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[7],
    width: "100%",
  },
  createdBy: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
    marginTop: theme.spacing[2],
  },
  creatorBlock: { alignItems: "center" },
  creatorName: { ...theme.typography.bodyMedium, color: theme.colors.text.white, marginTop: theme.spacing[0.5] },
  description: { ...theme.typography.body, color: theme.rosary.colors.scripture, textAlign: "center" },
  prayerCard: { alignItems: "center", backgroundColor: "rgba(7, 26, 42, 0.76)", padding: theme.spacing[4] },
  prayerCopy: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.scripture,
    marginTop: theme.spacing[2],
    textAlign: "center",
  },
  prayerLabel: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
    marginTop: theme.spacing[2],
  },
  safeArea: { backgroundColor: theme.rosary.colors.canvas, flex: 1 },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.text.white,
    fontFamily: theme.fontFamilies.display,
    textAlign: "center",
  },
  unavailable: { alignItems: "center", flex: 1, justifyContent: "center", padding: theme.spacing[5] },
  unavailableCopy: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[2],
    textAlign: "center",
  },
  unavailableTitle: { ...theme.typography.heading3, color: theme.colors.text.white, textAlign: "center" },
});
