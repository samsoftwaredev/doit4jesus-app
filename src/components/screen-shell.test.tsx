import { render, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";

import { ScreenShell } from "./screen-shell";

describe("ScreenShell", () => {
  it("includes the shared decorative atmosphere by default", async () => {
    await render(
      <ScreenShell subtitle="A calm place to grow." title="Welcome">
        <Text>Screen content</Text>
      </ScreenShell>,
    );

    expect(screen.getByTestId("sacred-atmosphere").props.pointerEvents).toBe("none");
    expect(screen.getByTestId("sacred-atmosphere-foreground").props.pointerEvents).toBe("none");
    expect(screen.getByText("Screen content")).toBeTruthy();
  });

  it("keeps the shared atmosphere when a screen supplies its own background", async () => {
    await render(
      <ScreenShell background={<View testID="route-background" />} subtitle="A calm place to grow." title="Welcome">
        <Text>Screen content</Text>
      </ScreenShell>,
    );

    expect(screen.getByTestId("route-background")).toBeTruthy();
    expect(screen.getByTestId("sacred-atmosphere")).toBeTruthy();
    expect(screen.getByTestId("sacred-atmosphere-foreground")).toBeTruthy();
  });
});
