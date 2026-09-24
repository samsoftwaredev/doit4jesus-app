import { render, screen } from "@testing-library/react-native";

import { VirtueProgressBar } from "./VirtueProgressBar";

const baseProps = {
  id: "faith" as const,
  icon: require("../../../assets/images/virtues/cross.svg"),
  label: "Faith",
  maxValue: 100,
  tone: "faith" as const,
  value: 70,
};

function getProgressBar(label: string) {
  return screen.getByLabelText(label);
}

describe("VirtueProgressBar", () => {
  it("renders the virtue label", async () => {
    await render(<VirtueProgressBar {...baseProps} />);
    expect(screen.getByText("Faith")).toBeTruthy();
  });

  it("renders the score text", async () => {
    await render(<VirtueProgressBar {...baseProps} />);
    expect(screen.getByText("70/100")).toBeTruthy();
  });

  it("has a progressbar accessibility role", async () => {
    await render(<VirtueProgressBar {...baseProps} />);
    expect(getProgressBar("Faith: 70 out of 100").props.accessibilityRole).toBe("progressbar");
  });

  it("sets correct accessibility values", async () => {
    await render(<VirtueProgressBar {...baseProps} />);
    const bar = getProgressBar("Faith: 70 out of 100");
    expect(bar.props.accessibilityValue).toEqual({ max: 100, min: 0, now: 70 });
  });

  it("clamps value to 0 when given a negative number", async () => {
    await render(<VirtueProgressBar {...baseProps} value={-10} />);
    expect(screen.getByText("0/100")).toBeTruthy();
    const bar = getProgressBar("Faith: 0 out of 100");
    expect(bar.props.accessibilityValue.now).toBe(0);
  });

  it("clamps value to maxValue when it exceeds the maximum", async () => {
    await render(<VirtueProgressBar {...baseProps} value={200} />);
    expect(screen.getByText("100/100")).toBeTruthy();
    const bar = getProgressBar("Faith: 100 out of 100");
    expect(bar.props.accessibilityValue.now).toBe(100);
  });

  it("treats maxValue of 0 as 1 to avoid division by zero", async () => {
    await render(<VirtueProgressBar {...baseProps} maxValue={0} value={0} />);
    expect(screen.getByText("0/1")).toBeTruthy();
  });

  it("renders with a custom maxValue", async () => {
    await render(<VirtueProgressBar {...baseProps} maxValue={50} value={25} />);
    expect(screen.getByText("25/50")).toBeTruthy();
    const bar = getProgressBar("Faith: 25 out of 50");
    expect(bar.props.accessibilityValue).toEqual({ max: 50, min: 0, now: 25 });
  });
});
