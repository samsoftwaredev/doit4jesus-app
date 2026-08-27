import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { SpriteSheetAnimation } from "../components/ui";

/**
 * Example usage in an Expo screen.
 *
 * Pass an eight-frame, single-row image as `spriteSheetSource`. For example:
 *   <SpriteSheetAnimationExample
 *     spriteSheetSource={require("../assets/animations/hero-run-8.png")}
 *   />
 */
export default function SpriteSheetAnimationExample({ spriteSheetSource }) {
  const animationRef = useRef(null);
  const [finishedRuns, setFinishedRuns] = useState(0);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Eight-frame sprite animation</Text>

      <SpriteSheetAnimation
        ref={animationRef}
        source={spriteSheetSource}
        frameWidth={96}
        frameHeight={96}
        totalFrames={8}
        fps={8}
        loop
        autoplay
        onComplete={() => setFinishedRuns((count) => count + 1)}
        style={styles.sprite}
      />

      <View style={styles.controls}>
        <ControlButton label="Play" onPress={() => animationRef.current?.play()} />
        <ControlButton label="Pause" onPress={() => animationRef.current?.pause()} />
        <ControlButton label="Reset" onPress={() => animationRef.current?.reset()} />
        <ControlButton label="Restart" onPress={() => animationRef.current?.restart()} />
      </View>

      <Text style={styles.note}>Completed non-looping runs: {finishedRuns}</Text>
    </View>
  );
}

function ControlButton({ label, onPress }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.button}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    flex: 1,
    gap: 16,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  sprite: {
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
  },
  controls: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#1d4ed8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  buttonLabel: {
    color: "#ffffff",
    fontWeight: "600",
  },
  note: {
    color: "#4b5563",
  },
});
