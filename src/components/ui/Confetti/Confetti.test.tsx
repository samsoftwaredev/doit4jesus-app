import { render, screen } from "@testing-library/react-native";
import { StyleSheet, View } from "react-native";

import { Confetti, getConfettiParticleCount } from "./Confetti";

const { useReducedMotion, withSequence } = jest.requireMock("react-native-reanimated") as {
  useReducedMotion: jest.Mock;
  withSequence: jest.Mock;
};

describe("Confetti", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useReducedMotion.mockReturnValue(false);
  });

  it("renders the requested number of falling particles", async () => {
    await render(
      <View style={{ flex: 1 }}>
        <Confetti particleCount={5} testID="confetti" />
      </View>,
    );

    expect(screen.getByTestId("confetti")).toBeTruthy();
    expect(screen.getAllByTestId("confetti-particle")).toHaveLength(5);
    expect(screen.getByTestId("confetti").props.pointerEvents).toBe("none");
    expect(screen.getByTestId("confetti").props.accessible).toBe(false);
    expect(StyleSheet.flatten(screen.getByTestId("confetti").props.style)).toEqual(
      expect.objectContaining({ bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }),
    );
  });

  it("uses responsive particle density unless the caller provides a count", () => {
    expect(getConfettiParticleCount(390)).toBe(56);
    expect(getConfettiParticleCount(768)).toBe(80);
    expect(getConfettiParticleCount(1_024)).toBe(96);
    expect(getConfettiParticleCount(1_024, 12)).toBe(12);
  });

  it("replays the staggered animation when its trigger changes", async () => {
    const rendered = await render(<Confetti particleCount={2} testID="confetti" trigger={1} />);
    const firstRunCount = withSequence.mock.calls.length;

    await rendered.rerender(<Confetti particleCount={2} testID="confetti" trigger={2} />);

    expect(firstRunCount).toBe(2);
    expect(withSequence).toHaveBeenCalledTimes(4);
  });

  it("keeps the viewport layer but suppresses particles for reduced motion", async () => {
    useReducedMotion.mockReturnValue(true);

    await render(<Confetti particleCount={5} testID="confetti" />);

    expect(screen.getByTestId("confetti")).toBeTruthy();
    expect(screen.queryAllByTestId("confetti-particle")).toHaveLength(0);
  });

  it("does not render while inactive", async () => {
    await render(<Confetti active={false} testID="confetti" />);

    expect(screen.queryByTestId("confetti")).toBeNull();
  });
});
