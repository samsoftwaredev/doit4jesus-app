import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { rosarySequence } from "@/features/prayer/rosary/data/rosarySequence";
import type { AppTheme } from "@/theme/tokens";
import { darkTheme, lightTheme, setActiveAppTheme } from "@/theme/tokens";

import { RosaryArc } from "./RosaryArc";
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
    await render(
      <>
        <ScriptureCard quotation="The Word became flesh." reference="John 1:14" />
        <RosaryArc
          beads={rosarySequence.slice(0, 2)}
          completedBeadIds={["hail-mary-1"]}
          currentBeadIndex={1}
          isTransitioning={false}
          onNext={jest.fn()}
          onPrevious={jest.fn()}
          onSelectBead={jest.fn()}
          progress={{ currentIndex: 2, prayerName: "Hail Mary", total: 10 }}
        />
        <RosaryBottomNavigation
          onAdvance={jest.fn()}
          onArtStyleChange={jest.fn()}
          onLengthChange={jest.fn()}
          onRestart={jest.fn()}
          progress={{ currentIndex: 2, prayerName: "Hail Mary", total: 10 }}
          rosaryLength="medium"
          rosaryArtStyle="comic"
        />
      </>,
    );

    const scriptureCardStyle = StyleSheet.flatten(screen.getByLabelText("Scripture. John 1:14").props.style);
    expect(scriptureCardStyle).toMatchObject({
      backgroundColor: selectedTheme.rosary.colors.immersiveCard,
    });
    expect(StyleSheet.flatten(screen.getByText("John 1:14").props.style)).toMatchObject({
      color: selectedTheme.rosary.colors.immersivePrimary,
    });
    const arcStyle = StyleSheet.flatten(screen.getByLabelText("Interactive Rosary arc").props.style);
    expect(arcStyle.backgroundColor).toBeUndefined();
    expect(arcStyle.borderColor).toBeUndefined();
    expect(arcStyle.borderWidth).toBeUndefined();
  });
});
