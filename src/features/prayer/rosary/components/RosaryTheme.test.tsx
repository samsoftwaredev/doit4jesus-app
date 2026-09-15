import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { fullRosarySequence, rosarySequence } from "@/features/prayer/rosary/data/rosarySequence";
import { darkTheme, lightTheme, setActiveAppTheme } from "@/theme/tokens";
import type { AppTheme } from "@/theme/tokens";

import { RosaryBead } from "./RosaryBead";
import { RosaryBeadNavigator } from "./RosaryBeadNavigator";
import { RosaryBottomNavigation } from "./RosaryBottomNavigation";
import { ScriptureCard } from "./ScriptureCard";

let mockColorScheme: "light" | "dark" = "dark";

jest.mock("@/theme/AppThemeProvider", () => ({
  useAppTheme: () => ({ colorScheme: mockColorScheme }),
}));

describe("Rosary prayer appearance", () => {
  afterEach(() => {
    setActiveAppTheme(darkTheme);
  });

  it.each([
    ["dark", darkTheme],
    ["light", lightTheme],
  ] as const)("uses the %s palette for prayer cards and controls", async (colorScheme, selectedTheme: AppTheme) => {
    mockColorScheme = colorScheme;
    setActiveAppTheme(selectedTheme);
    const creed = fullRosarySequence.find((bead) => bead.type === "creed");
    expect(creed).toBeDefined();

    await render(
      <>
        <ScriptureCard quotation="The Word became flesh." reference="John 1:14" />
        <RosaryBead bead={creed!} onPress={jest.fn()} state="active" />
        <RosaryBeadNavigator
          beads={rosarySequence.slice(0, 2)}
          completedBeadIds={["hail-mary-1"]}
          currentBeadIndex={1}
          isTransitioning={false}
          onNext={jest.fn()}
          onPrevious={jest.fn()}
          onSelectBead={jest.fn()}
        />
        <RosaryBottomNavigation
          onAdvance={jest.fn()}
          onLengthChange={jest.fn()}
          onRestart={jest.fn()}
          progress={{ currentIndex: 2, prayerName: "Hail Mary", total: 10 }}
          rosaryLength="medium"
        />
      </>,
    );

    expect(StyleSheet.flatten(screen.getByLabelText("Scripture. John 1:14").props.style)).toMatchObject({
      backgroundColor: selectedTheme.rosary.colors.card,
      borderColor: selectedTheme.colors.border.warning,
    });
    expect(StyleSheet.flatten(screen.getByText("John 1:14").props.style)).toMatchObject({
      color: selectedTheme.colors.text.primary,
    });
    const navigatorStyle = StyleSheet.flatten(screen.getByLabelText("Rosary bead navigator").props.style);
    expect(navigatorStyle.backgroundColor).toBeUndefined();
    expect(navigatorStyle.borderColor).toBeUndefined();
    expect(navigatorStyle.borderWidth).toBeUndefined();
    expect(StyleSheet.flatten(screen.getByTestId("rosary-bead-shape-1").props.style)).toMatchObject({
      backgroundColor: selectedTheme.rosary.colors.pearlShadow,
    });
    expect(StyleSheet.flatten(screen.getByTestId("rosary-bead-shape-2").props.style)).toMatchObject({
      backgroundColor: selectedTheme.rosary.colors.pearl,
    });
    expect(
      StyleSheet.flatten(screen.getByTestId(`rosary-crucifix-shape-${creed?.sequence}`).props.style),
    ).toMatchObject({
      backgroundColor: selectedTheme.colors.semantic.warningSurface,
    });
    expect(StyleSheet.flatten(screen.getByTestId("rosary-progress-button").props.style)).toMatchObject({
      backgroundColor: selectedTheme.colors.surface.secondary,
    });
    expect(StyleSheet.flatten(screen.getByTestId("open-rosary-settings").props.style)).toMatchObject({
      backgroundColor: selectedTheme.colors.surface.secondary,
      borderColor: selectedTheme.colors.border.warning,
    });
    expect(StyleSheet.flatten(screen.getByText("Hail Mary").props.style)).toMatchObject({
      color: selectedTheme.colors.text.primary,
    });

    await fireEvent.press(screen.getByLabelText("Open Rosary settings"));

    expect(StyleSheet.flatten(screen.getByRole("header", { name: "Rosary settings" }).props.style)).toMatchObject({
      color: selectedTheme.colors.text.primary,
    });
    expect(StyleSheet.flatten(screen.getByLabelText("Restart current mystery").props.style)).toMatchObject({
      borderColor: selectedTheme.colors.border.warning,
    });
  });
});
