import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { Button } from "./Button";

describe("Button", () => {
  it("lets its content fill and center within a taller button", async () => {
    await render(
      <Button onPress={jest.fn()} style={{ height: 72 }}>
        Continue
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Continue" });
    const content = screen.getByText("Continue").parent;

    expect(StyleSheet.flatten(button.props.style)).toMatchObject({ height: 72, minHeight: 44 });
    expect(StyleSheet.flatten(content?.props.style)).toMatchObject({ flexGrow: 1, justifyContent: "center" });
  });

  it.each([
    ["sm", 44],
    ["md", 44],
    ["lg", 52],
  ] as const)("keeps the %s size touch target on the outer button", async (size, minHeight) => {
    await render(
      <Button onPress={jest.fn()} size={size}>
        Continue
      </Button>,
    );

    expect(StyleSheet.flatten(screen.getByRole("button", { name: "Continue" }).props.style)).toMatchObject({
      minHeight,
    });
  });
});
