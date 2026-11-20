import { LinearGradient } from "expo-linear-gradient";
import { forwardRef } from "react";
import { StyleSheet, Text, View } from "react-native";

import { CELEBRATION_COLORS } from "./celebrationTheme";
import { StarField } from "./StarField";
import { StreakEmblem } from "./StreakEmblem";

/** Logical size of the shareable image; captured at 3x for a 1080x1920 story-format picture. */
export const SHARE_IMAGE_SIZE = { height: 640, width: 360 } as const;

export interface RosaryShareImageProps {
  callToAction: string;
  dateLabel: string;
  highlights: string[];
  isNewRecord: boolean;
  recordLabel: string;
  site: string;
  streak: string;
  streakCaption: string;
  title: string;
}

/**
 * The picture people post: a starry, gold-and-midnight poster with the streak ringed by a rosary, the logo as its
 * pendant, a few key stats, and an invitation to try the app. Rendered off-screen and captured on share.
 */
export const RosaryShareImage = forwardRef<View, RosaryShareImageProps>(function RosaryShareImage(
  { callToAction, dateLabel, highlights, isNewRecord, recordLabel, site, streak, streakCaption, title },
  ref,
) {
  return (
    <View collapsable={false} ref={ref} style={styles.frame}>
      <LinearGradient colors={CELEBRATION_COLORS.background} style={StyleSheet.absoluteFill} />
      <StarField animated={false} count={46} seed={11} />

      <View style={styles.top}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{dateLabel}</Text>
      </View>

      <View style={styles.emblem}>
        <StreakEmblem animated={false} caption={streakCaption} size={300} streak={streak} />
      </View>

      {isNewRecord ? (
        <View style={styles.record}>
          <Text style={styles.recordText}>✦ {recordLabel} ✦</Text>
        </View>
      ) : null}

      <View style={styles.highlights}>
        {highlights.map((highlight) => (
          <Text key={highlight} style={styles.highlight}>
            {highlight}
          </Text>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.cta}>{callToAction}</Text>
        <Text style={styles.site}>{site}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  cta: { color: CELEBRATION_COLORS.text, fontSize: 18, fontWeight: "700", textAlign: "center" },
  date: { color: CELEBRATION_COLORS.textSoft, fontSize: 14, marginTop: 4 },
  emblem: { alignItems: "center", marginTop: 28 },
  footer: { alignItems: "center", bottom: 36, left: 24, position: "absolute", right: 24 },
  frame: {
    backgroundColor: CELEBRATION_COLORS.background[0],
    height: SHARE_IMAGE_SIZE.height,
    overflow: "hidden",
    width: SHARE_IMAGE_SIZE.width,
  },
  highlight: { color: CELEBRATION_COLORS.goldBright, fontSize: 16, fontWeight: "600" },
  highlights: { alignItems: "center", gap: 6, marginTop: 20 },
  record: {
    alignSelf: "center",
    backgroundColor: "rgba(255, 224, 154, 0.16)",
    borderColor: CELEBRATION_COLORS.goldBright,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  recordText: { color: CELEBRATION_COLORS.goldBright, fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  site: { color: CELEBRATION_COLORS.gold, fontSize: 14, fontWeight: "600", letterSpacing: 1, marginTop: 4 },
  title: { color: CELEBRATION_COLORS.gold, fontSize: 14, fontWeight: "800", letterSpacing: 4, textAlign: "center" },
  top: { alignItems: "center", marginTop: 48 },
});
