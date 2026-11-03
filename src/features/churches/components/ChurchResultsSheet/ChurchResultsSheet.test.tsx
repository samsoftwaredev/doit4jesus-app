import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { i18n } from "@/localization";
import { theme } from "@/theme/tokens";

import { ChurchResultsSheet, getChurchResultsSheetHeights, type ChurchResultsSheetSnap } from "./ChurchResultsSheet";

describe("ChurchResultsSheet", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("uses one accessible arrow button to toggle the drawer fully open and closed", async () => {
    const onSnapChange = jest.fn<void, [ChurchResultsSheetSnap]>();
    const { rerender } = await render(
      <ChurchResultsSheet
        bottomInset={72}
        panelHeight={640}
        onSnapChange={onSnapChange}
        snap="peek"
        summary="1 of 3 churches selected"
        title="Nearby churches"
      >
        <Text>Church result content</Text>
      </ChurchResultsSheet>,
    );

    expect(screen.getByTestId("church-results-sheet")).toHaveStyle({ bottom: 72 });
    expect(screen.queryByText("Church result content")).toBeNull();
    expect(screen.getAllByRole("button")).toHaveLength(1);
    await fireEvent.press(screen.getByRole("button", { name: "Expand church results" }));
    expect(onSnapChange).toHaveBeenCalledWith("expanded");

    await rerender(
      <ChurchResultsSheet
        bottomInset={72}
        panelHeight={640}
        onSnapChange={onSnapChange}
        snap="expanded"
        summary="1 of 3 churches selected"
        title="Nearby churches"
      >
        <Text>Church result content</Text>
      </ChurchResultsSheet>,
    );
    expect(screen.getByText("Church result content")).toBeTruthy();
    expect(screen.getAllByRole("button")).toHaveLength(1);
    await fireEvent.press(screen.getByRole("button", { name: "Collapse church results" }));
    expect(onSnapChange).toHaveBeenLastCalledWith("peek");
  });

  it("derives ordered peek, middle, and expanded snap heights", () => {
    expect(getChurchResultsSheetHeights(640)).toEqual({ expanded: 608, middle: 320, peek: 88 });
  });

  it("moves above page controls and traps accessibility focus for church details", async () => {
    await render(
      <ChurchResultsSheet
        onSnapChange={jest.fn()}
        overlaysControls
        panelHeight={640}
        snap="expanded"
        summary="1 of 3 churches selected"
        title="Nearby churches"
      >
        <Text>Church details</Text>
      </ChurchResultsSheet>,
    );

    expect(screen.getByTestId("church-results-sheet")).toHaveProp("accessibilityViewIsModal", true);
    expect(screen.getByTestId("church-results-sheet")).toHaveStyle({ zIndex: theme.zIndex.modal });
  });
});
