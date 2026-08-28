import { fireEvent, render, screen } from "@testing-library/react-native";

import { ScriptureReadingsCard } from "./ScriptureReadingsCard";

describe("ScriptureReadingsCard", () => {
  it("reveals reading text with the chevron instead of navigating away", async () => {
    const onReadingComplete = jest.fn(async () => undefined);
    await render(
      <ScriptureReadingsCard
        completedReadingIds={[]}
        metadata={{ country: "US", psalterWeek: 4, sundayCycle: "A", weekdayCycle: "II" }}
        onReadingComplete={onReadingComplete}
        readings={[
          {
            citation: "Ez 37:1-14",
            id: "first-reading",
            text: "Dry bones, hear the word of the LORD.",
            type: "FIRST_READING",
          },
        ]}
        season="ORDINARY_TIME"
      />,
    );

    expect(screen.queryByText("Dry bones, hear the word of the LORD.")).toBeNull();

    await fireEvent.press(screen.getByLabelText("Expand FIRST READING, Ez 37:1-14"));

    expect(screen.getByText("Dry bones, hear the word of the LORD.")).toBeTruthy();
    expect(screen.getByLabelText("Collapse FIRST READING, Ez 37:1-14")).toBeTruthy();
  });
});
