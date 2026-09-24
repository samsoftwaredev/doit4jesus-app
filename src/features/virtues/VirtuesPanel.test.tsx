/* eslint-disable @typescript-eslint/no-require-imports -- Jest mock factories load React Native primitives and SVG fixtures lazily. */
import { render, screen } from "@testing-library/react-native";

import { VirtuesPanel } from "./VirtuesPanel";

const expectedVirtueIcons = [
  require("../../../assets/images/virtues/cross.svg"),
  require("../../../assets/images/virtues/candel.svg"),
  require("../../../assets/images/virtues/sword.svg"),
  require("../../../assets/images/virtues/bible.svg"),
  require("../../../assets/images/virtues/heart.svg"),
  require("../../../assets/images/virtues/peace.svg"),
];
const mockRenderedVirtueIcons = jest.fn();

jest.mock("./VirtueProgressBar", () => ({
  VirtueProgressBar: ({
    icon,
    label,
    value,
    maxValue,
  }: {
    icon: number;
    label: string;
    value: number;
    maxValue: number;
  }) => {
    const { Text } = require("react-native");
    mockRenderedVirtueIcons(icon);
    return <Text>{`${label}: ${value}/${maxValue}`}</Text>;
  },
}));

describe("VirtuesPanel", () => {
  beforeEach(() => {
    mockRenderedVirtueIcons.mockClear();
  });

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

  it("uses the lightweight SVG artwork for every default virtue", async () => {
    await render(<VirtuesPanel />);

    expect(mockRenderedVirtueIcons.mock.calls.map(([icon]) => icon)).toEqual(expectedVirtueIcons);
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
