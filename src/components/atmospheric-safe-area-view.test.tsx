import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { AtmosphericSafeAreaView } from "./atmospheric-safe-area-view";

describe("AtmosphericSafeAreaView", () => {
  it("places the non-interactive atmosphere behind screen content", async () => {
    await render(
      <AtmosphericSafeAreaView>
        <Text>Protected screen content</Text>
      </AtmosphericSafeAreaView>,
    );

    expect(screen.getByTestId("sacred-atmosphere").props.pointerEvents).toBe("none");
    expect(screen.getByTestId("sacred-atmosphere-foreground").props.pointerEvents).toBe("none");
    expect(screen.getByText("Protected screen content")).toBeTruthy();
  });

  it("allows a gradient screen to provide its own correctly layered atmosphere", async () => {
    await render(
      <AtmosphericSafeAreaView includeAtmosphere={false}>
        <Text>Gradient screen content</Text>
      </AtmosphericSafeAreaView>,
    );

    expect(screen.queryByTestId("sacred-atmosphere")).toBeNull();
    expect(screen.getByTestId("sacred-atmosphere-foreground")).toBeTruthy();
    expect(screen.getByText("Gradient screen content")).toBeTruthy();
  });
});
