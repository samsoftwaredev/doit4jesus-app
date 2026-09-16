import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { i18n } from "@/localization";

import { RosaryBottomNavigation } from "./RosaryBottomNavigation";

describe("RosaryBottomNavigation", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("advances and restarts the Rosary from its accessible controls", async () => {
    const onAdvance = jest.fn();
    const onRestart = jest.fn();
    await render(
      <RosaryBottomNavigation
        onLengthChange={jest.fn()}
        onAdvance={onAdvance}
        onRestart={onRestart}
        progress={{ currentIndex: 2, prayerName: "Hail Mary", total: 10 }}
        rosaryLength="medium"
      />,
    );

    await fireEvent.press(screen.getByLabelText("Hail Mary, 2 of 10. Next bead."));
    await fireEvent.press(screen.getByLabelText("Open Rosary settings"));
    await fireEvent.press(screen.getByLabelText("Restart current mystery"));

    expect(onAdvance).toHaveBeenCalledTimes(1);
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it("allows settings to close without changing the mystery", async () => {
    const onRestart = jest.fn();
    await render(
      <RosaryBottomNavigation
        disabled
        onLengthChange={jest.fn()}
        onAdvance={jest.fn()}
        onRestart={onRestart}
        progress={{ currentIndex: 1, prayerName: "Hail Mary", total: 10 }}
        rosaryLength="medium"
      />,
    );

    await fireEvent.press(screen.getByLabelText("Open Rosary settings"));
    await fireEvent.press(screen.getByLabelText("Close Rosary settings"));

    expect(onRestart).not.toHaveBeenCalled();
  });

  it("shows cumulative prayer contents and changes length from accessible radio controls", async () => {
    const onLengthChange = jest.fn();
    await render(
      <RosaryBottomNavigation
        onAdvance={jest.fn()}
        onLengthChange={onLengthChange}
        onRestart={jest.fn()}
        progress={{ currentIndex: 59, prayerName: "Hail, Holy Queen", total: 59 }}
        rosaryLength="medium"
      />,
    );

    await fireEvent.press(screen.getByLabelText("Open Rosary settings"));

    expect(screen.getByRole("radio", { name: /Classic/i }).props.accessibilityState).toEqual({ selected: true });
    expect(screen.getByText("Everything in Short, plus:")).toBeTruthy();
    expect(screen.getByText("Everything in Classic, plus:")).toBeTruthy();
    expect(screen.getByText(/Our Father, Hail Mary, and Glory Be for the Pope’s intentions/)).toBeTruthy();
    expect(screen.getByText(/Litany of Loreto/)).toBeTruthy();

    await fireEvent.press(screen.getByRole("radio", { name: /Long/i }));
    expect(onLengthChange).toHaveBeenCalledWith("long");
    expect(screen.getByRole("radio", { name: /Long/i })).toBeTruthy();
  });

  it("shows the Classic Rosary name in Spanish", async () => {
    await act(async () => i18n.changeLanguage("es"));
    await render(
      <RosaryBottomNavigation
        onAdvance={jest.fn()}
        onLengthChange={jest.fn()}
        onRestart={jest.fn()}
        progress={{ currentIndex: 1, prayerName: "Ave María", total: 10 }}
        rosaryLength="medium"
      />,
    );

    await fireEvent.press(screen.getByLabelText("Abrir configuración del Rosario"));

    expect(screen.getByRole("radio", { name: "Clásico (20 min) Rosario" }).props.accessibilityState).toEqual({
      selected: true,
    });
    expect(screen.getByText("Todo lo incluido en Clásico, más:")).toBeTruthy();
  });

  it("plays and pauses available prayer audio with an accessible 44 pixel control", async () => {
    const onAudioToggle = jest.fn();
    const { rerender } = await render(
      <RosaryBottomNavigation
        audioAvailable
        audioPlaying={false}
        audioMuted={false}
        onAudioToggle={onAudioToggle}
        onAudioMutedChange={jest.fn()}
        onAdvance={jest.fn()}
        onLengthChange={jest.fn()}
        onRestart={jest.fn()}
        progress={{ currentIndex: 1, prayerName: "Hail Mary", total: 10 }}
        rosaryLength="medium"
      />,
    );

    const playButton = screen.getByRole("button", { name: "Play prayer audio" });
    expect(StyleSheet.flatten(playButton.props.style)).toEqual(expect.objectContaining({ height: 44, width: 44 }));
    await fireEvent.press(playButton);
    expect(onAudioToggle).toHaveBeenCalledTimes(1);

    await rerender(
      <RosaryBottomNavigation
        audioAvailable
        audioPlaying
        audioMuted={false}
        onAudioToggle={onAudioToggle}
        onAudioMutedChange={jest.fn()}
        onAdvance={jest.fn()}
        onLengthChange={jest.fn()}
        onRestart={jest.fn()}
        progress={{ currentIndex: 1, prayerName: "Hail Mary", total: 10 }}
        rosaryLength="medium"
      />,
    );
    expect(screen.getByRole("button", { name: "Pause prayer audio" })).toBeTruthy();
  });

  it("disables unavailable audio and exposes the persisted mute switch in both languages", async () => {
    const onAudioMutedChange = jest.fn();
    await render(
      <RosaryBottomNavigation
        audioAvailable={false}
        audioPlaying={false}
        audioMuted
        onAudioToggle={jest.fn()}
        onAudioMutedChange={onAudioMutedChange}
        onAdvance={jest.fn()}
        onLengthChange={jest.fn()}
        onRestart={jest.fn()}
        progress={{ currentIndex: 1, prayerName: "Saint Michael Prayer", total: 10 }}
        rosaryLength="medium"
      />,
    );

    expect(screen.getByRole("button", { name: "Prayer audio unavailable" }).props.accessibilityState).toEqual({
      disabled: true,
    });
    await fireEvent.press(screen.getByLabelText("Open Rosary settings"));
    const switchControl = screen.getByRole("switch", { name: "Rosary audio" });
    expect(switchControl.props.accessibilityState).toEqual({ checked: false });
    await fireEvent.press(switchControl);
    expect(onAudioMutedChange).toHaveBeenCalledWith(false);

    await act(async () => i18n.changeLanguage("es"));
    expect(screen.getByRole("button", { name: "Audio de oración no disponible" })).toBeTruthy();
    expect(screen.getByRole("switch", { name: "Audio del Rosario" })).toBeTruthy();
  });
});
