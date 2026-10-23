import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Dimensions, StyleSheet } from "react-native";
import { fireGestureHandler, getByGestureTestId } from "react-native-gesture-handler/jest-utils";

import { fullRosarySequence } from "@/features/prayer/rosary/data/rosarySequence";
import { i18n } from "@/localization";

import { RosaryArc, type RosaryArcProps } from "./RosaryArc";

function setWindowDimensions({ fontScale = 1, height, width }: { fontScale?: number; height: number; width: number }) {
  const dimensions = { fontScale, height, scale: 3, width };
  Dimensions.set({ screen: dimensions, window: dimensions });
}

const defaultProps: RosaryArcProps = {
  beads: fullRosarySequence,
  completedBeadIds: [fullRosarySequence[2].id],
  currentBeadIndex: 3,
  isTransitioning: false,
  onNext: jest.fn(),
  onPrevious: jest.fn(),
  onSelectBead: jest.fn(),
  progress: { currentIndex: 2, prayerName: "Hail Mary", total: 59 },
};

describe("RosaryArc", () => {
  beforeEach(async () => {
    await act(async () => i18n.changeLanguage("en"));
    jest.clearAllMocks();
    setWindowDimensions({ height: 844, width: 390 });
  });

  it("renders the full physical Rosary with prayer-specific markers and progress semantics", async () => {
    await render(<RosaryArc {...defaultProps} />);

    expect(screen.getAllByTestId(/^rosary-arc-physical-/)).toHaveLength(59);
    expect(screen.getByTestId(`rosary-arc-pearl-${fullRosarySequence[2].id}`)).toBeTruthy();
    expect(screen.getByTestId(`rosary-arc-rose-${fullRosarySequence[3].id}`)).toBeTruthy();
    expect(screen.getByRole("header", { name: "Hail Mary" })).toBeTruthy();
    expect(screen.getByText("2 of 59")).toBeTruthy();
    expect(screen.getByRole("progressbar").props.accessibilityValue).toEqual({
      max: 59,
      min: 0,
      now: 2,
      text: "2 of 59",
    });
  });

  it("distinguishes completed, current, and upcoming markers without allowing progress skips", async () => {
    const onSelectBead = jest.fn();
    await render(<RosaryArc {...defaultProps} onSelectBead={onSelectBead} />);

    const completed = screen.getByRole("button", { name: "completed bead 1, Our Father" });
    const current = screen.getByRole("button", { name: "current bead 2, Hail Mary" });
    const upcoming = screen.getByRole("image", { name: "upcoming bead 3, Hail Mary" });

    await fireEvent.press(completed);
    await fireEvent.press(current);
    await fireEvent.press(upcoming);

    expect(onSelectBead).toHaveBeenCalledTimes(1);
    expect(onSelectBead).toHaveBeenCalledWith(fullRosarySequence[2].id);
    expect(current.props.accessibilityState).toMatchObject({ selected: true });
  });

  it("moves one prayer per horizontal swipe and ignores gestures during a transition", async () => {
    const onNext = jest.fn();
    const onPrevious = jest.fn();
    const rendered = await render(<RosaryArc {...defaultProps} onNext={onNext} onPrevious={onPrevious} />);

    fireGestureHandler(getByGestureTestId("rosary-arc-swipe-gesture"), [{ translationX: -60, translationY: 2 }]);
    fireGestureHandler(getByGestureTestId("rosary-arc-swipe-gesture"), [{ translationX: 60, translationY: 2 }]);

    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrevious).toHaveBeenCalledTimes(1);

    await rendered.rerender(<RosaryArc {...defaultProps} isTransitioning onNext={onNext} onPrevious={onPrevious} />);
    fireGestureHandler(getByGestureTestId("rosary-arc-swipe-gesture"), [{ translationX: -60, translationY: 2 }]);

    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("briefly reveals a prayer name on long press", async () => {
    await render(<RosaryArc {...defaultProps} />);

    const upcoming = screen.getByRole("image", { name: "upcoming bead 3, Hail Mary" });
    expect(screen.queryByLabelText("Prayer name: Hail Mary")).toBeNull();

    await fireEvent(upcoming, "longPress");

    expect(screen.getByLabelText("Prayer name: Hail Mary")).toBeTruthy();
  });

  it("keeps the preceding physical marker current for a non-physical prayer", async () => {
    const gloryBeIndex = fullRosarySequence.findIndex((bead) => bead.type === "gloryBe");
    await render(
      <RosaryArc
        {...defaultProps}
        currentBeadIndex={gloryBeIndex}
        progress={{ currentIndex: 4, prayerName: "Glory Be", total: 59 }}
      />,
    );

    expect(screen.getByRole("header", { name: "Glory Be" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "current bead 4, Hail Mary" })).toBeTruthy();
  });

  it("uses a crucifix for the opening prayers without adding it to physical progress", async () => {
    await render(
      <RosaryArc
        {...defaultProps}
        completedBeadIds={[]}
        currentBeadIndex={0}
        progress={{ currentIndex: 0, prayerName: "Sign of the Cross", total: 59 }}
      />,
    );

    expect(screen.getByRole("button", { name: "current crucifix, Apostles' Creed" })).toBeTruthy();
    expect(screen.getByTestId(`rosary-arc-crucifix-artwork-${fullRosarySequence[1].id}`).props.accessible).toBe(false);
    expect(screen.getAllByTestId(/^rosary-arc-physical-/)).toHaveLength(59);
    expect(screen.getByText("0 of 59")).toBeTruthy();
  });

  it("localizes progress and interaction guidance in Spanish", async () => {
    await act(async () => i18n.changeLanguage("es"));

    await render(
      <RosaryArc {...defaultProps} progress={{ currentIndex: 1, prayerName: "Padre Nuestro", total: 59 }} />,
    );

    expect(screen.getByRole("header", { name: "Padre Nuestro" })).toBeTruthy();
    expect(screen.getByText("1 de 59")).toBeTruthy();
    expect(screen.getByLabelText("Arco interactivo del Rosario")).toBeTruthy();
  });

  it.each([
    { height: 568, label: "narrow phone", width: 320 },
    { height: 844, label: "typical phone", width: 390 },
    { height: 1024, label: "tablet boundary", width: 768 },
    { height: 1366, label: "desktop boundary", width: 1024 },
    { height: 390, label: "landscape phone", width: 844 },
  ])("keeps a bounded upper arc on a $label", async ({ height, width }) => {
    setWindowDimensions({ height, width });
    await render(<RosaryArc {...defaultProps} />);

    const containerStyle = StyleSheet.flatten(screen.getByLabelText("Interactive Rosary arc").props.style);
    expect(containerStyle.height).toBeGreaterThanOrEqual(150);
    expect(containerStyle.height).toBeLessThanOrEqual(width >= 1024 ? 430 : width >= 768 ? 390 : 340);
  });

  it("reduces visual marker size at large font scaling while preserving the 44-point target", async () => {
    setWindowDimensions({ fontScale: 1.4, height: 844, width: 390 });
    await render(<RosaryArc {...defaultProps} />);

    const roseStyle = StyleSheet.flatten(screen.getByTestId(`rosary-arc-rose-${fullRosarySequence[3].id}`).props.style);
    const targetStyle = StyleSheet.flatten(
      screen.getByTestId(`rosary-arc-physical-${fullRosarySequence[3].id}`).props.style,
    );
    expect(roseStyle).toMatchObject({ height: 20, width: 20 });
    expect(targetStyle).toMatchObject({ height: 44, width: 44 });
  });

  it("leaves visible space between neighboring rose beads on a typical mobile viewport", async () => {
    setWindowDimensions({ height: 844, width: 390 });
    await render(<RosaryArc {...defaultProps} />);

    const currentStyle = StyleSheet.flatten(
      screen.getByTestId(`rosary-arc-physical-${fullRosarySequence[3].id}`).props.style,
    );
    const nextStyle = StyleSheet.flatten(
      screen.getByTestId(`rosary-arc-physical-${fullRosarySequence[4].id}`).props.style,
    );
    const horizontalDistance = Math.abs(Number(nextStyle.left) - Number(currentStyle.left));

    expect(horizontalDistance).toBeGreaterThanOrEqual(30);
  });

  it("adds extra spacing around Our Father pearls on a typical mobile viewport", async () => {
    setWindowDimensions({ height: 844, width: 390 });
    await render(<RosaryArc {...defaultProps} />);

    const ourFatherStyle = StyleSheet.flatten(
      screen.getByTestId(`rosary-arc-physical-${fullRosarySequence[2].id}`).props.style,
    );
    const firstRoseStyle = StyleSheet.flatten(
      screen.getByTestId(`rosary-arc-physical-${fullRosarySequence[3].id}`).props.style,
    );
    const secondRoseStyle = StyleSheet.flatten(
      screen.getByTestId(`rosary-arc-physical-${fullRosarySequence[4].id}`).props.style,
    );
    const distanceBetween = (first: { left: number; top: number }, second: { left: number; top: number }) =>
      Math.hypot(Number(second.left) - Number(first.left), Number(second.top) - Number(first.top));
    const ourFatherGap = distanceBetween(ourFatherStyle, firstRoseStyle);
    const regularRoseGap = distanceBetween(firstRoseStyle, secondRoseStyle);

    expect(ourFatherGap).toBeGreaterThanOrEqual(regularRoseGap * 1.3);
  });
});
