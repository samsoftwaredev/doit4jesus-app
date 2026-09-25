import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import { AppVisualEffectsProvider, useAppVisualEffects } from "@/theme/AppVisualEffectsProvider";

import {
  getSacredAtmosphereDustDuration,
  getSacredAtmosphereParticleCount,
  SacredAtmosphere,
} from "./SacredAtmosphere";

const { useReducedMotion } = jest.requireMock("react-native-reanimated") as {
  useReducedMotion: jest.Mock;
};
const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;

function AtmosphereEffectControls() {
  const { setDustEnabled, setLightingEnabled } = useAppVisualEffects();
  return (
    <>
      <Pressable accessibilityRole="button" onPress={() => void setLightingEnabled(false)}>
        <Text>Disable lighting</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => void setDustEnabled(false)}>
        <Text>Disable dust</Text>
      </Pressable>
    </>
  );
}

describe("SacredAtmosphere", () => {
  beforeEach(() => {
    mockGetItem.mockResolvedValue(JSON.stringify({ dustEnabled: true, lightingEnabled: true }));
  });

  afterEach(() => {
    useReducedMotion.mockReturnValue(true);
  });

  it("renders sunlight behind the UI and a non-interactive foreground dust layer", async () => {
    useReducedMotion.mockReturnValue(false);
    await render(
      <AppVisualEffectsProvider>
        <View style={{ flex: 1 }}>
          <SacredAtmosphere />
          <SacredAtmosphere layer="foregroundDust" testID="sacred-atmosphere-foreground" />
        </View>
      </AppVisualEffectsProvider>,
    );

    expect((await screen.findByTestId("sacred-atmosphere")).props.pointerEvents).toBe("none");
    expect(screen.getByTestId("sacred-atmosphere-foreground").props.pointerEvents).toBe("none");
    expect(StyleSheet.flatten(screen.getByTestId("sacred-atmosphere-foreground").props.style).zIndex).toBe(
      theme.zIndex.sticky,
    );
    expect(screen.getByTestId("sacred-atmosphere-sunlight")).toBeTruthy();
    expect(screen.getByTestId("sacred-atmosphere-haze")).toBeTruthy();
    const particles = screen.getAllByTestId("sacred-atmosphere-dust");
    const largestParticle = Math.max(
      ...particles.map((particle) => Number(StyleSheet.flatten(particle.props.style).width)),
    );

    expect(particles).toHaveLength(36);
    expect(largestParticle).toBeGreaterThanOrEqual(9);
  });

  it("uses only a few static particles when reduced motion is enabled", async () => {
    useReducedMotion.mockReturnValue(true);
    await render(
      <AppVisualEffectsProvider>
        <SacredAtmosphere layer="foregroundDust" />
      </AppVisualEffectsProvider>,
    );

    await waitFor(() => expect(screen.getAllByTestId("sacred-atmosphere-dust")).toHaveLength(7));
  });

  it("hides each configured effect without affecting the other", async () => {
    await render(
      <AppVisualEffectsProvider>
        <AtmosphereEffectControls />
        <SacredAtmosphere />
        <SacredAtmosphere layer="foregroundDust" testID="sacred-atmosphere-foreground" />
      </AppVisualEffectsProvider>,
    );

    expect(screen.getByTestId("sacred-atmosphere-sunlight")).toBeTruthy();
    expect(screen.getAllByTestId("sacred-atmosphere-dust")).not.toHaveLength(0);

    fireEvent.press(screen.getByRole("button", { name: "Disable lighting" }));
    await waitFor(() => expect(screen.queryByTestId("sacred-atmosphere-sunlight")).toBeNull());
    expect(screen.getAllByTestId("sacred-atmosphere-dust")).not.toHaveLength(0);

    fireEvent.press(screen.getByRole("button", { name: "Disable dust" }));
    await waitFor(() => expect(screen.queryByTestId("sacred-atmosphere-foreground")).toBeNull());
  });

  it("increases density at the tablet and desktop breakpoints", async () => {
    expect(getSacredAtmosphereParticleCount(390, false)).toBe(36);
    expect(getSacredAtmosphereParticleCount(768, false)).toBe(52);
    expect(getSacredAtmosphereParticleCount(1024, false)).toBe(68);
  });

  it("uses a faster seven-to-eighteen second travel range", () => {
    expect(getSacredAtmosphereDustDuration(0)).toBeGreaterThanOrEqual(7_000);
    expect(getSacredAtmosphereDustDuration(0)).toBeLessThanOrEqual(18_000);
  });
});
