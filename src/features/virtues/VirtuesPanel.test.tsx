import { render, screen } from "@testing-library/react-native";

import { VirtuesPanel } from "./VirtuesPanel";

jest.mock("./VirtueProgressBar", () => ({
  VirtueProgressBar: ({ label, value, maxValue }: { label: string; value: number; maxValue: number }) => {
    const { Text } = require("react-native");
    return <Text>{`${label}: ${value}/${maxValue}`}</Text>;
  },
}));

describe("VirtuesPanel", () => {
  it("renders the panel title", async () => {
    await render(<VirtuesPanel />);
    expect(screen.getByRole("header")).toBeTruthy();
    expect(screen.getByText("Virtues")).toBeTruthy();
  });

  it("renders all six default virtues", async () => {
    await render(<VirtuesPanel />);
    expect(screen.getByText(/Faith:/)).toBeTruthy();
    expect(screen.getByText(/Discipline:/)).toBeTruthy();
    expect(screen.getByText(/Courage:/)).toBeTruthy();
    expect(screen.getByText(/Wisdom:/)).toBeTruthy();
    expect(screen.getByText(/Charity:/)).toBeTruthy();
    expect(screen.getByText(/Purity:/)).toBeTruthy();
  });

  it("renders custom virtues when provided", async () => {
    const virtues = [
      { id: "faith" as const, icon: 1, label: "Fortitude", maxValue: 100, tone: "faith" as const, value: 60 },
    ];
    await render(<VirtuesPanel virtues={virtues} />);
    expect(screen.getByText("Fortitude: 60/100")).toBeTruthy();
    expect(screen.queryByText(/Discipline:/)).toBeNull();
  });

  it("has a testID when provided", async () => {
    await render(<VirtuesPanel testID="virtues-panel" />);
    expect(screen.getByTestId("virtues-panel")).toBeTruthy();
  });

  it("passes maxValue to each virtue bar", async () => {
    await render(<VirtuesPanel maxValue={200} />);
    expect(screen.getByText(/85\/200/)).toBeTruthy();
  });
});
