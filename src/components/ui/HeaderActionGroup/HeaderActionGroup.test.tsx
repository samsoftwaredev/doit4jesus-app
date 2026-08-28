import { fireEvent, render, screen } from "@testing-library/react-native";

import { HeaderActionButton } from "./HeaderActionButton";
import { HeaderActionGroup } from "./HeaderActionGroup";

describe("HeaderActionButton", () => {
  it("announces unread counts and reacts to focus and presses", async () => {
    const onPress = jest.fn();
    await render(<HeaderActionButton iconName="bell" label="Notifications" onPress={onPress} unreadCount={101.8} />);

    const button = screen.getByRole("button", { name: "Notifications, 101 unread" });
    expect(screen.getByText("99+")).toBeTruthy();
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("clamps negative counts and makes loading or disabled actions unavailable", async () => {
    const onPress = jest.fn();
    const rendered = await render(
      <HeaderActionButton iconName="mail" label="Messages" onPress={onPress} unreadCount={-4} />,
    );
    expect(rendered.getByLabelText("Messages")).toBeTruthy();

    await rendered.rerender(
      <HeaderActionButton iconName="settings" label="Settings" loading onPress={onPress} testID="settings" />,
    );
    expect(rendered.getByTestId("settings").props.accessibilityState).toEqual({ busy: true, disabled: true });

    await rendered.rerender(<HeaderActionButton disabled iconName="mail" label="Messages" onPress={onPress} />);
    await fireEvent.press(rendered.getByLabelText("Messages"));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe("HeaderActionGroup", () => {
  it("connects each action and derives child test IDs", async () => {
    const onNotificationsPress = jest.fn();
    const onMessagesPress = jest.fn();
    const onSettingsPress = jest.fn();
    const rendered = await render(
      <HeaderActionGroup
        messageUnreadCount={2}
        notificationUnreadCount={1}
        onMessagesPress={onMessagesPress}
        onNotificationsPress={onNotificationsPress}
        onSettingsPress={onSettingsPress}
        testID="actions"
      />,
    );

    await fireEvent.press(rendered.getByLabelText("Notifications, 1 unread"));
    await fireEvent.press(rendered.getByLabelText("Messages, 2 unread"));
    await fireEvent.press(rendered.getByLabelText("Settings"));
    expect(onNotificationsPress).toHaveBeenCalledTimes(1);
    expect(onMessagesPress).toHaveBeenCalledTimes(1);
    expect(onSettingsPress).toHaveBeenCalledTimes(1);
  });

  it("propagates global and individual disabled states", async () => {
    const rendered = await render(
      <HeaderActionGroup
        disabled
        loading
        messagesDisabled
        notificationsDisabled
        onMessagesPress={jest.fn()}
        onNotificationsPress={jest.fn()}
        onSettingsPress={jest.fn()}
        settingsDisabled
        testID="actions"
      />,
    );

    expect(rendered.getByLabelText("Notifications").props.accessibilityState.disabled).toBe(true);
    expect(rendered.getByLabelText("Messages").props.accessibilityState.busy).toBe(true);
    expect(rendered.getByLabelText("Settings").props.accessibilityState.disabled).toBe(true);
  });
});
