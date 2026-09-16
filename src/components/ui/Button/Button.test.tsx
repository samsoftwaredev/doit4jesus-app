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

    const content = screen.getByText("Continue").parent;

    expect(StyleSheet.flatten(content?.props.style)).toMatchObject({ flexGrow: 1, justifyContent: "center" });
  });
});
