import { useAssets } from "expo-asset";
import { Suspense, useEffect } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "react-native-reanimated";

import { logDevelopmentError } from "@/lib/development-logger";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

import { Canvas } from "../../church-globe-renderer";
import { ChurchGlobeErrorBoundary } from "../ChurchGlobeErrorBoundary";
import { EarthGlobeScene } from "../EarthGlobeScene";

export const CHURCH_GLOBE_ROTATION_DURATION_MS = 16_000;
const EARTH_TEXTURE_ASSET = require("../../../../../assets/images/churches/earth-blue-marble.jpg") as number;

/** Records an optional 3D failure while leaving the discovery controls available over a plain background. */
function handleGlobeError(error: Error): void {
  logDevelopmentError("rendering the church discovery globe", error);
}

/** Displays a full-panel 3D Earth while discovery is waiting for a submitted ZIP search. */
export function ChurchDiscoveryGlobe() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [assets, assetError] = useAssets(EARTH_TEXTURE_ASSET);
  const textureUri = assets?.[0]?.localUri ?? assets?.[0]?.uri;

  useEffect(
    /** Reports a bundled texture failure without replacing the globe with a two-dimensional visual. */
    function reportAssetLoadFailure() {
      if (assetError) handleGlobeError(assetError);
    },
    [assetError],
  );

  return (
    <View
      accessibilityLabel={t("churches.search.globeLabel")}
      accessibilityRole="image"
      accessible
      pointerEvents="none"
      style={styles.background}
    >
      <View accessible={false} pointerEvents="none" style={styles.canvasLayer}>
        {textureUri ? (
          <ChurchGlobeErrorBoundary fallback={null} onError={handleGlobeError}>
            <Canvas
              camera={{ far: 100, fov: 44, near: 0.1, position: [0, 0, 3.25] }}
              frameloop={reduceMotion ? "demand" : "always"}
              gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
              style={styles.canvas}
            >
              <Suspense fallback={null}>
                <EarthGlobeScene
                  reduceMotion={reduceMotion}
                  rotationDurationMs={CHURCH_GLOBE_ROTATION_DURATION_MS}
                  textureUri={textureUri}
                />
              </Suspense>
            </Canvas>
          </ChurchGlobeErrorBoundary>
        ) : null}
      </View>
      <Text style={styles.prompt}>{t("churches.search.globePrompt")}</Text>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  background: {
    alignItems: "center",
    backgroundColor: theme.colors.background.secondary,
    height: "100%",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  canvas: { height: "100%", width: "100%" },
  canvasLayer: { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
  prompt: {
    ...theme.typography.body,
    bottom: theme.spacing[6],
    color: theme.colors.text.secondary,
    left: theme.spacing[6],
    maxWidth: 360,
    position: "absolute",
    right: theme.spacing[6],
    textAlign: "center",
  },
}));
