import { render, screen } from "@testing-library/react-native";

import { LevelsProgression } from "./LevelsProgression";

function getCheckpointProgressBar(summary: RegExp) {
  return screen.getAllByLabelText(summary).find((element) => element.props.accessibilityRole === "progressbar");
}

describe("LevelsProgression", () => {
  it("renders the current and next level numbers", async () => {
    await render(<LevelsProgression currentLevel={5} nextLevel={6} />);
    expect(screen.getByText("5")).toBeTruthy();
    expect(screen.getByText("6")).toBeTruthy();
  });

  it("renders default level numbers when no props are given", async () => {
    await render(<LevelsProgression />);
    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByText("13")).toBeTruthy();
  });

  it("renders the Levels heading", async () => {
    await render(<LevelsProgression />);
    expect(screen.getByRole("header")).toBeTruthy();
    expect(screen.getByText("Levels")).toBeTruthy();
  });

  it("has an accessibility label summarizing level and checkpoint progress", async () => {
    await render(<LevelsProgression currentLevel={3} nextLevel={4} checkpointCount={5} completedCheckpoints={2} />);
    expect(screen.getByLabelText(/Current level 3.*Next level 4.*2 of 5 checkpoints/i)).toBeTruthy();
  });

  it("clamps completedCheckpoints to checkpointCount", async () => {
    await render(<LevelsProgression checkpointCount={4} completedCheckpoints={10} />);
    expect(getCheckpointProgressBar(/4 of 4 checkpoints/i)?.props.accessibilityValue).toEqual({
      max: 4,
      min: 0,
      now: 4,
    });
  });

  it("treats negative completedCheckpoints as 0", async () => {
    await render(<LevelsProgression checkpointCount={4} completedCheckpoints={-2} />);
    expect(getCheckpointProgressBar(/0 of 4 checkpoints/i)?.props.accessibilityValue).toEqual({
      max: 4,
      min: 0,
      now: 0,
    });
  });

  it("renders with a testID when provided", async () => {
    await render(<LevelsProgression testID="levels-widget" />);
    expect(screen.getByTestId("levels-widget")).toBeTruthy();
  });
});
