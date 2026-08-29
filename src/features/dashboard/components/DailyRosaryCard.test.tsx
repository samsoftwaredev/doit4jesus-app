import { act, render, screen, waitFor } from "@testing-library/react-native";

import { DailyRosaryCard } from "./DailyRosaryCard";

const serverNow = "2026-08-29T18:00:00.000Z";

function reminder({
  completed = false,
  seconds = 4 * 60 * 60,
  status = "active",
}: {
  completed?: boolean;
  seconds?: number;
  status?: "active" | "at-risk" | "none" | "reset";
} = {}) {
  return {
    completed,
    deadlineAt: new Date(Date.parse(serverNow) + seconds * 1000).toISOString(),
    serverNow,
    streak: { current: 28, longest: 42, status },
  } as const;
}

function renderCard(overrides: Partial<React.ComponentProps<typeof DailyRosaryCard>> = {}) {
  return render(
    <DailyRosaryCard
      error={false}
      isLoading={false}
      onExpired={jest.fn()}
      onPrayRosary={jest.fn()}
      onRetry={jest.fn()}
      reminder={reminder()}
      {...overrides}
    />,
  );
}

describe("DailyRosaryCard", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows the completed state before any countdown urgency", async () => {
    await renderCard({ reminder: reminder({ completed: true, seconds: 60 }) });
    expect(screen.getByText("Today’s Rosary Complete")).toBeTruthy();
    expect(screen.queryByText("00 : 01 : 00")).toBeNull();
  });

  it("keeps the card compact when more than three hours remain", async () => {
    await renderCard({ reminder: reminder({ seconds: 3 * 60 * 60 + 1 }) });
    expect(screen.getByText("Today’s Rosary is waiting for you.")).toBeTruthy();
    expect(screen.queryByText("03 : 00 : 01")).toBeNull();
  });

  it("shows an expanded countdown at the three-hour, one-hour, and final-fifteen thresholds", async () => {
    const onExpired = jest.fn();
    const rendered = await renderCard({ onExpired, reminder: reminder({ seconds: 3 * 60 * 60 }) });
    expect(screen.getByText("03 : 00 : 00")).toBeTruthy();

    await rendered.rerender(
      <DailyRosaryCard
        error={false}
        isLoading={false}
        onExpired={onExpired}
        onPrayRosary={jest.fn()}
        onRetry={jest.fn()}
        reminder={reminder({ seconds: 60 * 60 })}
      />,
    );
    expect(screen.getByText("01 : 00 : 00")).toBeTruthy();

    await rendered.rerender(
      <DailyRosaryCard
        error={false}
        isLoading={false}
        onExpired={onExpired}
        onPrayRosary={jest.fn()}
        onRetry={jest.fn()}
        reminder={reminder({ seconds: 15 * 60 })}
      />,
    );
    expect(screen.getByText("00 : 15 : 00")).toBeTruthy();
  });

  it("uses the server baseline, never displays a negative timer, and refreshes on expiry", async () => {
    jest.useFakeTimers();
    const onExpired = jest.fn();
    await renderCard({ onExpired, reminder: reminder({ seconds: 1, status: "at-risk" }) });

    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });

    await waitFor(() => expect(onExpired).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Updating today’s Rosary status…")).toBeTruthy();
    expect(screen.queryByText(/-/)).toBeNull();
  });

  it("uses the backend reset status and avoids fabricating a timer without a deadline", async () => {
    const rendered = await renderCard({ reminder: reminder({ status: "reset" }) });
    expect(screen.getByText("Streak Reset")).toBeTruthy();

    await rendered.rerender(
      <DailyRosaryCard
        error={false}
        isLoading={false}
        onExpired={jest.fn()}
        onPrayRosary={jest.fn()}
        onRetry={jest.fn()}
        reminder={{ ...reminder(), deadlineAt: null }}
      />,
    );
    expect(screen.getByText("Today’s Rosary is waiting for you.")).toBeTruthy();
    expect(screen.queryByText(/00 :/)).toBeNull();
  });

  it("keeps a backend no-streak state neutral even near the deadline", async () => {
    await renderCard({ reminder: reminder({ seconds: 60, status: "none" }) });
    expect(screen.getByText("Begin a prayerful rhythm today.")).toBeTruthy();
    expect(screen.queryByText("00 : 01 : 00")).toBeNull();
  });

  it("cleans up the synchronized timer on unmount", async () => {
    const clearIntervalSpy = jest.spyOn(globalThis, "clearInterval");
    const rendered = await renderCard();
    await rendered.unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
