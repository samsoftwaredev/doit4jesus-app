import { fireEvent, render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { RemoveFriendConfirmationModal } from "./RemoveFriendConfirmationModal";

describe("RemoveFriendConfirmationModal", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("names the friend and exposes cancel and destructive confirmation actions", async () => {
    const onConfirm = jest.fn();
    const onDismiss = jest.fn();
    await render(
      <RemoveFriendConfirmationModal
        friendName="Maria Santos"
        isRemoving={false}
        onConfirm={onConfirm}
        onDismiss={onDismiss}
        visible
      />,
    );

    expect(screen.getByRole("header", { name: "Remove friend?" })).toBeTruthy();
    expect(screen.getByText(/Remove Maria Santos from your friends/)).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Cancel" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    await fireEvent.press(screen.getByRole("button", { name: "Remove Friend" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("prevents dismissal and duplicate confirmation while removal is pending", async () => {
    const onConfirm = jest.fn();
    const onDismiss = jest.fn();
    await render(
      <RemoveFriendConfirmationModal
        friendName="Maria Santos"
        isRemoving
        onConfirm={onConfirm}
        onDismiss={onDismiss}
        visible
      />,
    );

    expect(screen.getByRole("button", { name: "Cancel" }).props.accessibilityState.disabled).toBe(true);
    expect(screen.getByRole("button", { name: "Remove Friend" }).props.accessibilityState).toMatchObject({
      busy: true,
      disabled: true,
    });
    await fireEvent.press(screen.getByRole("button", { name: "Cancel" }));
    await fireEvent.press(screen.getByRole("button", { name: "Remove Friend" }));
    expect(onDismiss).not.toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("keeps an accessible failure visible and localizes the modal", async () => {
    await i18n.changeLanguage("es");
    await render(
      <RemoveFriendConfirmationModal
        error
        friendName="María Santos"
        isRemoving={false}
        onConfirm={jest.fn()}
        onDismiss={jest.fn()}
        visible
      />,
    );

    expect(screen.getByRole("header", { name: "¿Eliminar amigo?" })).toBeTruthy();
    expect(screen.getByRole("alert")).toHaveTextContent("No se pudo eliminar al amigo");
  });
});
