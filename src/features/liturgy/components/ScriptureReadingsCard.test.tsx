import { act, fireEvent, render, screen } from "@testing-library/react-native";
import type { ComponentProps } from "react";

import { i18n } from "@/localization";

import { ScriptureReadingsCard } from "./ScriptureReadingsCard";

describe("ScriptureReadingsCard", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

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

  it("explains the daily Scripture completion flow in both supported languages", async () => {
    const props: ComponentProps<typeof ScriptureReadingsCard> = {
      completedReadingIds: [],
      metadata: { country: "US", psalterWeek: 4, sundayCycle: "A", weekdayCycle: "II" },
      onReadingComplete: jest.fn(async () => undefined),
      readings: [],
      season: "ORDINARY_TIME",
    };
    const rendered = await render(<ScriptureReadingsCard {...props} />);

    expect(screen.getByText("Read each passage to complete today's Scripture.")).toBeTruthy();

    await act(async () => {
      await i18n.changeLanguage("es");
    });
    await rendered.rerender(<ScriptureReadingsCard {...props} />);

    expect(screen.getByText("Lee cada pasaje para completar la Escritura de hoy.")).toBeTruthy();
  });

  it("keeps the Scripture heading copy full width and places completion count above its progress bar", async () => {
    await render(
      <ScriptureReadingsCard
        completedReadingIds={[]}
        metadata={{ country: "US", psalterWeek: 4, sundayCycle: "A", weekdayCycle: "II" }}
        onReadingComplete={jest.fn(async () => undefined)}
        readings={[
          { citation: "Ez 37:1-14", id: "first-reading", text: "Dry bones, hear the word.", type: "FIRST_READING" },
          { citation: "Mt 22:34-40", id: "gospel", text: "You shall love the Lord.", type: "GOSPEL" },
        ]}
        season="ORDINARY_TIME"
      />,
    );

    expect(screen.getByTestId("scripture-readings-heading").props.style).toEqual(
      expect.objectContaining({ width: "100%" }),
    );
    expect(screen.getByTestId("scripture-readings-description").props.style).toEqual(
      expect.objectContaining({ width: "100%" }),
    );
    expect(screen.getByTestId("scripture-readings-progress").props.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ props: expect.objectContaining({ testID: "scripture-readings-progress-count" }) }),
        expect.objectContaining({ props: expect.objectContaining({ testID: "scripture-readings-progress-bar" }) }),
      ]),
    );
  });
});
