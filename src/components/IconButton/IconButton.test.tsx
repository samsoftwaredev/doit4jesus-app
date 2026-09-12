import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("exposes an accessible 44-point button and invokes its action", async () => {
    const onPress = jest.fn();

    await render(
      <IconButton accessibilityLabel="Add friend" onPress={onPress}>
        <Text>+</Text>
      </IconButton>,
    );

    const button = screen.getByRole("button", { name: "Add friend" });
    expect(button.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ height: 44, width: 44 })]));

    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("reports and blocks unavailable actions", async () => {
    const onPress = jest.fn();

    await render(
      <IconButton accessibilityLabel="Loading action" loading onPress={onPress}>
        <Text>+</Text>
      </IconButton>,
    );

    const button = screen.getByRole("button", { name: "Loading action" });
    expect(button.props.accessibilityState).toEqual(expect.objectContaining({ busy: true, disabled: true }));

    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
