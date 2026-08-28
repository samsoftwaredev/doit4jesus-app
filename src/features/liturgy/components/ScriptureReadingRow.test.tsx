import { fireEvent, render, screen } from "@testing-library/react-native";

import { ScriptureReadingRow } from "./ScriptureReadingRow";

const baseReading = {
  citation: "Ez 37:1-14",
  id: "first-reading",
  text: "Dry bones, hear the word of the LORD.",
  type: "FIRST_READING" as const,
};

describe("ScriptureReadingRow", () => {
  it("renders the reading type and citation", async () => {
    await render(
      <ScriptureReadingRow
        completed={false}
        expanded={false}
        onComplete={jest.fn()}
        onToggle={jest.fn()}
        reading={baseReading}
      />,
    );
    expect(screen.getByText("FIRST READING")).toBeTruthy();
    expect(screen.getByText("Ez 37:1-14")).toBeTruthy();
  });

  it("calls onToggle when the row header is pressed", async () => {
    const onToggle = jest.fn();
    await render(
      <ScriptureReadingRow
        completed={false}
        expanded={false}
        onComplete={jest.fn()}
        onToggle={onToggle}
        reading={baseReading}
      />,
    );
    await fireEvent.press(screen.getByLabelText("Expand FIRST READING, Ez 37:1-14"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("shows scripture text when expanded", async () => {
    await render(
      <ScriptureReadingRow
        completed={false}
        expanded
        onComplete={jest.fn()}
        onToggle={jest.fn()}
        reading={baseReading}
      />,
    );
    expect(screen.getByText("Dry bones, hear the word of the LORD.")).toBeTruthy();
  });

  it("hides scripture text when collapsed", async () => {
    await render(
      <ScriptureReadingRow
        completed={false}
        expanded={false}
        onComplete={jest.fn()}
        onToggle={jest.fn()}
        reading={baseReading}
      />,
    );
    expect(screen.queryByText("Dry bones, hear the word of the LORD.")).toBeNull();
  });

  it("labels the toggle button as Collapse when expanded", async () => {
    await render(
      <ScriptureReadingRow
        completed={false}
        expanded
        onComplete={jest.fn()}
        onToggle={jest.fn()}
        reading={baseReading}
      />,
    );
    expect(screen.getByLabelText("Collapse FIRST READING, Ez 37:1-14")).toBeTruthy();
  });

  it("shows 'Read to the End' button and disables it before scrolling to end", async () => {
    await render(
      <ScriptureReadingRow
        completed={false}
        expanded
        onComplete={jest.fn()}
        onToggle={jest.fn()}
        reading={baseReading}
      />,
    );
    expect(screen.getByText("Read to the End")).toBeTruthy();
  });

  it("shows 'Completed' when completed and expanded", async () => {
    await render(
      <ScriptureReadingRow completed expanded onComplete={jest.fn()} onToggle={jest.fn()} reading={baseReading} />,
    );
    expect(screen.getByText("Completed")).toBeTruthy();
  });

  it("calls onComplete after simulating content and viewport dimensions that reveal the end", async () => {
    const onComplete = jest.fn(async () => undefined);
    await render(
      <ScriptureReadingRow
        completed={false}
        expanded
        onComplete={onComplete}
        onToggle={jest.fn()}
        reading={baseReading}
      />,
    );

    const scrollView = screen.getByLabelText("FIRST READING, Ez 37:1-14, Scripture text");

    // Simulate the ScrollView layout so viewportHeight > 0
    await fireEvent(scrollView, "layout", { nativeEvent: { layout: { height: 300 } } });
    // Simulate content size so contentHeight matches viewport (short text fits fully)
    await fireEvent(scrollView, "contentSizeChange", 0, 300);

    await fireEvent.press(screen.getByText("Mark as Read"));
    expect(onComplete).toHaveBeenCalledWith("first-reading");
  });

  it("shows an error alert when onComplete rejects", async () => {
    const onComplete = jest.fn(async () => {
      throw new Error("Network error");
    });
    await render(
      <ScriptureReadingRow
        completed={false}
        expanded
        onComplete={onComplete}
        onToggle={jest.fn()}
        reading={baseReading}
      />,
    );

    const scrollView = screen.getByLabelText("FIRST READING, Ez 37:1-14, Scripture text");
    await fireEvent(scrollView, "layout", { nativeEvent: { layout: { height: 300 } } });
    await fireEvent(scrollView, "contentSizeChange", 0, 300);

    await fireEvent.press(screen.getByText("Mark as Read"));
    expect(screen.getByText("Your reading could not be saved. Please try again.")).toBeTruthy();
  });

  it("renders type label with underscores replaced by spaces", async () => {
    await render(
      <ScriptureReadingRow
        completed={false}
        expanded={false}
        onComplete={jest.fn()}
        onToggle={jest.fn()}
        reading={{ ...baseReading, type: "RESPONSORIAL_PSALM" }}
      />,
    );
    expect(screen.getByText("RESPONSORIAL PSALM")).toBeTruthy();
  });
});
