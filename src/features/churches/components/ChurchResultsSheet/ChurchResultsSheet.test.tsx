import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { i18n } from "@/localization";

import { ChurchResultsSheet, getChurchResultsSheetHeights, type ChurchResultsSheetSnap } from "./ChurchResultsSheet";

describe("ChurchResultsSheet", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("exposes accessible snap controls and hides content at the peek position", async () => {
    const onSnapChange = jest.fn<void, [ChurchResultsSheetSnap]>();
    const { rerender } = await render(
      <ChurchResultsSheet
        panelHeight={640}
        onSnapChange={onSnapChange}
        snap="peek"
        summary="1 of 3 churches selected"
        title="Nearby churches"
      >
        <Text>Church result content</Text>
      </ChurchResultsSheet>,
    );

    expect(screen.queryByText("Church result content")).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Expand church results" }));
    expect(onSnapChange).toHaveBeenCalledWith("middle");

    await rerender(
      <ChurchResultsSheet
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
    await fireEvent.press(screen.getByRole("button", { name: "Collapse church results" }));
    expect(onSnapChange).toHaveBeenLastCalledWith("middle");
  });

  it("derives ordered peek, middle, and expanded snap heights", () => {
    expect(getChurchResultsSheetHeights(640)).toEqual({ expanded: 608, middle: 320, peek: 88 });
  });
});
