import type { ReactNode } from "react";
import { Text } from "react-native";
import { render, screen } from "@testing-library/react-native";

import { ChurchGlobeErrorBoundary } from "./ChurchGlobeErrorBoundary";

/** Throws during rendering so the globe boundary can exercise its recovery path. */
function BrokenGlobe(): ReactNode {
  throw new Error("WebGL context unavailable");
}

describe("ChurchGlobeErrorBoundary", () => {
  it("shows the supplied fallback after a 3D rendering failure", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);

    await render(
      <ChurchGlobeErrorBoundary fallback={<Text>Fallback content</Text>}>
        <BrokenGlobe />
      </ChurchGlobeErrorBoundary>,
    );

    expect(screen.getByText("Fallback content")).toBeTruthy();
    consoleError.mockRestore();
  });
});
