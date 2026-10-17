import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { AppLanguageProvider, i18n } from "@/localization";

import { RosaryBottomNavigation } from "./RosaryBottomNavigation";

jest.mock("@expo/vector-icons/Feather", () => {
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");

  /** Renders icon names as test identifiers so icon state remains testable. */
  return function MockFeather({ name }: { name: string }) {
    return <View testID={`feather-icon-${name}`} />;
  };
});

describe("RosaryBottomNavigation", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage("en");
  });

  it("advances and restarts the Rosary from its accessible controls", async () => {
    const onAdvance = jest.fn();
    const onRestart = jest.fn();
    await render(
      <RosaryBottomNavigation
        rosaryArtStyle="comic"
        onArtStyleChange={jest.fn()}
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

  it("explains that the daily Next-button limit was reached while keeping the control available for feedback", async () => {
    const onAdvance = jest.fn();
    await render(
      <RosaryBottomNavigation
        advanceLimitReached
        onAdvance={onAdvance}
        onArtStyleChange={jest.fn()}
        onLengthChange={jest.fn()}
        onRestart={jest.fn()}
        progress={{ currentIndex: 2, prayerName: "Hail Mary", total: 10 }}
        rosaryArtStyle="comic"
        rosaryLength="medium"
      />,
    );

    const limitedButton = screen.getByRole("button", {
      name: "Hail Mary, 2 of 10. Daily skip limit reached.",
    });
    expect(limitedButton.props.accessibilityHint).toBe("Swipe up to continue praying.");

    await fireEvent.press(limitedButton);
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it("allows settings to close without changing the mystery", async () => {
    const onRestart = jest.fn();
    await render(
      <RosaryBottomNavigation
        rosaryArtStyle="comic"
        onArtStyleChange={jest.fn()}
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
        rosaryArtStyle="comic"
        onArtStyleChange={jest.fn()}
        onAdvance={jest.fn()}
        onLengthChange={onLengthChange}
        onRestart={jest.fn()}
        progress={{ currentIndex: 59, prayerName: "Hail, Holy Queen", total: 59 }}
        rosaryLengthAudioDurations={{ long: 1634, medium: 1417, short: 1269 }}
        rosaryLength="medium"
      />,
    );

    await fireEvent.press(screen.getByLabelText("Open Rosary settings"));

    expect(screen.getByRole("radio", { name: "Classic (23:37) Rosary" }).props.accessibilityState).toEqual({
      selected: true,
    });
    expect(screen.getByText("Everything in Short, plus:")).toBeTruthy();
    expect(screen.getByText("Everything in Classic, plus:")).toBeTruthy();
    expect(screen.getByText(/Five mysteries/)).toBeTruthy();
    const shortRosaryOption = screen.getByRole("radio", { name: "Short (21:09) Rosary" });
    expect(shortRosaryOption.props.accessibilityHint).toContain("Five mysteries");
    expect(shortRosaryOption.props.accessibilityHint).not.toContain("Fatima Prayers");
    expect(shortRosaryOption.props.accessibilityHint).not.toContain("Hail, Holy Queen");
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
        rosaryArtStyle="comic"
        onArtStyleChange={jest.fn()}
        onAdvance={jest.fn()}
        onLengthChange={jest.fn()}
        onRestart={jest.fn()}
        progress={{ currentIndex: 1, prayerName: "Ave María", total: 10 }}
        rosaryLengthAudioDurations={{ long: 1911, medium: 1663, short: 1498 }}
        rosaryLength="medium"
      />,
    );

    await fireEvent.press(screen.getByLabelText("Abrir configuración del Rosario"));

    expect(screen.getByRole("radio", { name: "Clásico (27:43) Rosario" }).props.accessibilityState).toEqual({
      selected: true,
    });
    expect(screen.getByText(/Cinco misterios/)).toBeTruthy();
    const shortRosaryOption = screen.getByRole("radio", { name: "Corto (24:58) Rosario" });
    expect(shortRosaryOption.props.accessibilityHint).toContain("Cinco misterios");
    expect(shortRosaryOption.props.accessibilityHint).not.toContain("oraciones de Fátima");
    expect(shortRosaryOption.props.accessibilityHint).not.toContain("La Salve");
    expect(screen.getByText("Todo lo incluido en Clásico, más:")).toBeTruthy();
  });

  it("plays and pauses available prayer audio with an accessible 44 pixel control", async () => {
    const onAudioToggle = jest.fn();
    const rendered = await render(
      <RosaryBottomNavigation
        rosaryArtStyle="comic"
        onArtStyleChange={jest.fn()}
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
    expect(screen.getByTestId("feather-icon-play")).toBeTruthy();
    await fireEvent.press(playButton);
    expect(onAudioToggle).toHaveBeenCalledTimes(1);

    await rendered.rerender(
      <RosaryBottomNavigation
        rosaryArtStyle="comic"
        onArtStyleChange={jest.fn()}
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

    await rendered.rerender(
      <RosaryBottomNavigation
        rosaryArtStyle="comic"
        onArtStyleChange={jest.fn()}
        audioAvailable
        audioPlaying={false}
        audioMuted
        onAudioToggle={onAudioToggle}
        onAudioMutedChange={jest.fn()}
        onAdvance={jest.fn()}
        onLengthChange={jest.fn()}
        onRestart={jest.fn()}
        progress={{ currentIndex: 1, prayerName: "Hail Mary", total: 10 }}
        rosaryLength="medium"
      />,
    );
    expect(screen.getByTestId("feather-icon-volume-x")).toBeTruthy();
  });

  it("explains the persisted mute switch and exposes its enabled state in both languages", async () => {
    const onAudioMutedChange = jest.fn();
    await render(
      <RosaryBottomNavigation
        rosaryArtStyle="comic"
        onArtStyleChange={jest.fn()}
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
    const switchControl = screen.getByRole("switch", { name: "Mute Rosary audio" });
    expect(switchControl.props.accessibilityHint).toBe("Turn this on to mute audio during the Rosary.");
    expect(switchControl.props.accessibilityState).toEqual({ checked: true });
    expect(screen.getByText("Turn this on to mute audio during the Rosary.")).toBeTruthy();
    await fireEvent.press(switchControl);
    expect(onAudioMutedChange).toHaveBeenCalledWith(false);

    await act(async () => i18n.changeLanguage("es"));
    expect(screen.getByRole("button", { name: "Audio de oración no disponible" })).toBeTruthy();
    expect(screen.getByRole("switch", { name: "Silenciar el audio del Rosario" })).toBeTruthy();
    expect(screen.getByText("Activa esta opción para silenciar el audio durante el Rosario.")).toBeTruthy();
  });

  it("organizes settings into labeled sections with language last", async () => {
    await render(
      <RosaryBottomNavigation
        onAdvance={jest.fn()}
        onArtStyleChange={jest.fn()}
        onLengthChange={jest.fn()}
        onRestart={jest.fn()}
        progress={{ currentIndex: 1, prayerName: "Hail Mary", total: 10 }}
        rosaryLength="medium"
        rosaryArtStyle="comic"
      />,
    );

    await fireEvent.press(screen.getByLabelText("Open Rosary settings"));

    const headingNames = screen.getAllByRole("header").map((heading) => heading.props.children);
    expect(headingNames).toEqual([
      "Rosary settings",
      "Prayer progress",
      "Art style",
      "Rosary length",
      "Audio",
      "Language",
    ]);
    expect(screen.getByLabelText("Art style").props.accessibilityRole).toBe("radiogroup");
    expect(screen.getByLabelText("Rosary length").props.accessibilityRole).toBe("radiogroup");
    expect(screen.getByLabelText("App language").props.accessibilityRole).toBe("radiogroup");
  });

  it("changes and persists the app language from the final settings section", async () => {
    await render(
      <AppLanguageProvider>
        <RosaryBottomNavigation
          rosaryArtStyle="comic"
          onArtStyleChange={jest.fn()}
          onAdvance={jest.fn()}
          onLengthChange={jest.fn()}
          onRestart={jest.fn()}
          progress={{ currentIndex: 1, prayerName: "Hail Mary", total: 10 }}
          rosaryLength="medium"
        />
      </AppLanguageProvider>,
    );

    await fireEvent.press(screen.getByLabelText("Open Rosary settings"));
    await fireEvent.press(screen.getByRole("radio", { name: "Español" }));

    expect(await screen.findByText("Configuración del Rosario")).toBeTruthy();
    expect(screen.getAllByRole("header").map((heading) => heading.props.children)).toEqual([
      "Configuración del Rosario",
      "Progreso de la oración",
      "Estilo artístico",
      "Duración del Rosario",
      "Audio",
      "Idioma",
    ]);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@doit4jesus/language-preference:v1", "es");
  });

  it("changes art style from accessible radio controls in both languages", async () => {
    const onArtStyleChange = jest.fn();
    await render(
      <RosaryBottomNavigation
        onAdvance={jest.fn()}
        onArtStyleChange={onArtStyleChange}
        onLengthChange={jest.fn()}
        onRestart={jest.fn()}
        progress={{ currentIndex: 1, prayerName: "Hail Mary", total: 10 }}
        rosaryArtStyle="comic"
        rosaryLength="medium"
      />,
    );

    await fireEvent.press(screen.getByLabelText("Open Rosary settings"));
    expect(screen.getByRole("radio", { name: "Comic style" }).props.accessibilityState).toEqual({ selected: true });
    await fireEvent.press(screen.getByRole("radio", { name: "Classical art" }));
    expect(onArtStyleChange).toHaveBeenCalledWith("classic");

    await act(async () => i18n.changeLanguage("es"));
    expect(screen.getByRole("radio", { name: "Arte clásico" })).toBeTruthy();
  });
});
