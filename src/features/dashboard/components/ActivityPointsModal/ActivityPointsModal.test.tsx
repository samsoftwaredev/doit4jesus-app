import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { ActivityPointsModal } from "./ActivityPointsModal";

const mockFetchActivityPointsPage = jest.fn();

jest.mock("@/features/progress", () => ({
  fetchActivityPointsPage: (...args: unknown[]) => mockFetchActivityPointsPage(...args),
}));

describe("ActivityPointsModal", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await act(async () => i18n.changeLanguage("en"));
  });

  it("loads activity points on open and appends the next cursor page", async () => {
    mockFetchActivityPointsPage
      .mockResolvedValueOnce({
        activities: [
          {
            activityCode: "ROSARY",
            completedAt: "2026-10-03T09:30:00Z",
            id: "rosary-1",
            occurredAt: "2026-10-03T09:00:00Z",
            points: 25,
          },
        ],
        hasMore: true,
        nextCursor: "2026-10-02T19:00:00Z",
      })
      .mockResolvedValueOnce({
        activities: [
          {
            activityCode: "SCRIPTURE",
            completedAt: null,
            id: "scripture-1",
            occurredAt: "2026-10-02T19:00:00Z",
            points: 0,
          },
        ],
        hasMore: false,
        nextCursor: null,
      });

    await render(<ActivityPointsModal onClose={jest.fn()} visible />);

    expect(await screen.findByText("Rosary")).toBeTruthy();
    expect(screen.getByText("+25")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Load more" }));

    await waitFor(() => {
      expect(mockFetchActivityPointsPage).toHaveBeenNthCalledWith(2, "2026-10-02T19:00:00Z");
    });
    expect(screen.getByText("Scripture")).toBeTruthy();
    expect(screen.getByText("0")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Load more" })).toBeNull();
  });

  it("uses Spanish activity labels and actions when Spanish is active", async () => {
    mockFetchActivityPointsPage.mockResolvedValue({
      activities: [
        {
          activityCode: "SCRIPTURE",
          completedAt: null,
          id: "scripture-es",
          occurredAt: "2026-10-02T19:00:00Z",
          points: 20,
        },
      ],
      hasMore: false,
      nextCursor: null,
    });
    await act(async () => i18n.changeLanguage("es"));

    await render(<ActivityPointsModal onClose={jest.fn()} visible />);

    expect(await screen.findByText("Escritura")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cerrar puntos de actividades" })).toBeTruthy();
  });
});
