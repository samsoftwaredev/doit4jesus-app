import { render, screen } from "@testing-library/react-native";
import { StyleSheet, View } from "react-native";

import { theme } from "@/theme/tokens";

import {
  getSacredAtmosphereDustDuration,
  getSacredAtmosphereParticleCount,
  SacredAtmosphere,
} from "./SacredAtmosphere";

const { useReducedMotion } = jest.requireMock("react-native-reanimated") as {
  useReducedMotion: jest.Mock;
};

describe("SacredAtmosphere", () => {
  afterEach(() => {
    useReducedMotion.mockReturnValue(true);
  });

  it("renders sunlight behind the UI and a non-interactive foreground dust layer", async () => {
    useReducedMotion.mockReturnValue(false);
    await render(
      <View style={{ flex: 1 }}>
        <SacredAtmosphere />
        <SacredAtmosphere layer="foregroundDust" testID="sacred-atmosphere-foreground" />
      </View>,
    );

    expect(screen.getByTestId("sacred-atmosphere").props.pointerEvents).toBe("none");
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
    await render(<SacredAtmosphere layer="foregroundDust" />);

    expect(screen.getAllByTestId("sacred-atmosphere-dust")).toHaveLength(7);
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
